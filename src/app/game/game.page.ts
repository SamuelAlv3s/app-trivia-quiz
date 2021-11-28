import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
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
}
