import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  AnimationController,
  Animation,
} from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';
import { QuestionService } from '../services/question.service';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  @ViewChild('correct', { static: false }) correct: ElementRef;
  @ViewChild('incorrect', { static: false }) incorrect: ElementRef;
  @ViewChild('confetticanvas', { static: false }) confetticanvas: ElementRef;
  done = 0;
  questions = [];
  points = 0;
  correctAnimation: Animation;
  incorrectAnimation: Animation;
  markAnswer = false;
  questionIndex = 0;
  name = '';
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private alertCtrl: AlertController,
    private router: Router,
    private animationCtrl: AnimationController,
    private changeDetectorRef: ChangeDetectorRef
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

  ngAfterViewInit() {
    this.correctAnimation = this.animationCtrl
      .create('correct')
      .addElement(this.correct.nativeElement)
      .duration(1500)
      .keyframes([
        { offset: 0, transform: 'translateY(100vh)' },
        { offset: 0.3, transform: 'translateY(70vh)' },
        { offset: 0.9, transform: 'translateY(70vh)' },
        { offset: 1, transform: 'translateY(100vh)' },
      ])
      .onFinish(() => {
        this.afterAnswer();
      });

    this.incorrectAnimation = this.animationCtrl
      .create('incorrect')
      .addElement(this.incorrect.nativeElement)
      .duration(1500)
      .keyframes([
        { offset: 0, transform: 'translateY(100vh)' },
        { offset: 0.3, transform: 'translateY(70vh)' },
        { offset: 0.9, transform: 'translateY(70vh)' },
        { offset: 1, transform: 'translateY(100vh)' },
      ])
      .onFinish(() => {
        this.afterAnswer();
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
    this.markAnswer = true;
    if (question.correct_answer === answer) {
      this.points += 10;
      this.correctAnimation.play();
    } else {
      this.incorrectAnimation.play();
    }
  }

  afterAnswer() {
    this.markAnswer = false;
    this.done += 1;

    if (this.done < 10) {
      this.questionIndex += 1;
      this.swiper.swiperRef.slideNext(500);
      this.changeDetectorRef.detectChanges();
    } else {
      this.changeDetectorRef.detectChanges();
      this.showConfetti();
    }
  }

  showConfetti() {
    confetti
      .create(this.confetticanvas.nativeElement, { resize: true })({
        particleCount: 200,
        spread: 90,
        decay: 0.91,
        origin: {
          x: 0.5,
          y: 0.7,
        },
      })
      .then((res) => {
        console.log('confetti done');
      });
  }

  saveScore() {
    this.questionService.saveScore(this.points, this.name).then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }
}
