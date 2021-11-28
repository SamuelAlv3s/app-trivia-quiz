import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  done = 0;
  questions = [];
  points = 0;
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    const category = this.route.snapshot.paramMap.get('category');
    this.questionService
      .getQuestionsForCategories(category)
      .subscribe((res) => {
        console.log(res);

        this.questions = res;
      });
  }

  async endGame() {
    const alert = await this.alertCtrl.create({
      header: 'Do you want to quit the game?',
      message: 'Your progress will be lost.',
      buttons: [
        {
          text: 'Continue',
          role: 'cancel',
        },
        {
          text: 'End game',
          handler: () => {
            this.router.navigateByUrl('/', { replaceUrl: true });
          },
        },
      ],
    });

    await alert.present();
  }

  selectAnswer(question, answer) {
    if (question.correct_answer === answer) {
      console.log('true');
      this.points += 10;
    } else {
      console.log('false');
    }

    this.done += 1;
    this.swiper.swiperRef.slideNext(500);
  }
}
