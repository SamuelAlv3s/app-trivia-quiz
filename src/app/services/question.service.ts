import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  categories = [];
  constructor(private http: HttpClient) {}

  getCategories() {
    if (this.categories.length === 0) {
      return this.http.get('https://opentdb.com/api_category.php').pipe(
        map((data: any) => {
          this.categories = data.trivia_categories;
          return this.categories;
        })
      );
    } else {
      return of(this.categories);
    }
  }

  getQuestionsForCategories(categoryId) {
    return this.http
      .get(`https://opentdb.com/api.php?amount=10&caregory=${categoryId}`)
      .pipe(
        map((data: any) => {
          let results = data.results;
          results = results.map((q) => {
            q.answers = [...q.incorrect_answers, q.correct_answer];
            q.answers.sort(() => Math.random() - 0.5);
            return q;
          });
          return results;
        })
      );
  }

  async saveScore(score, name) {
    const { value }: any = await Storage.get({ key: 'scores' });
    let scores = [];
    const newScore = { score, name };
    if (value) {
      scores = JSON.parse(value);
      scores.push(newScore);
    } else {
      scores = [newScore];
    }

    return Storage.set({ key: 'scores', value: JSON.stringify(scores) });
  }

  async loadScores() {
    const { value }: any = await Storage.get({ key: 'scores' });

    if (value) {
      const scores = JSON.parse(value);
      return scores.sort((a, b) => {
        return b.score - a.score;
      });
    } else {
      return [];
    }
  }
}
