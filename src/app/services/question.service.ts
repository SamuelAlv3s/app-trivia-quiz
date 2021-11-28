import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
