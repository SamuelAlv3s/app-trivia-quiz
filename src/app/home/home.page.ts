import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AnimationController, Platform, Animation } from '@ionic/angular';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('menu', { read: ElementRef }) menu: ElementRef;
  @ViewChild('score', { read: ElementRef }) score: ElementRef;
  @ViewChild('game', { read: ElementRef }) game: ElementRef;

  hideMenuAnimation: Animation;
  showGame: Animation;
  showScore: Animation;
  activeView = 'menu';
  categories = [];
  scrollEnabled = false;

  constructor(
    private animationCtrl: AnimationController,
    private plt: Platform,
    private questionService: QuestionService
  ) {
    this.questionService.getCategories().subscribe((res) => {
      console.log('Categories: ', res);

      this.categories = res;
    });
  }

  ngAfterViewInit() {
    const viewWidth = this.plt.width();

    this.hideMenuAnimation = this.animationCtrl
      .create('hide-menu')
      .addElement(this.menu.nativeElement)
      .duration(500)
      .easing('ease-out')
      .fromTo('opacity', 1, 0)
      .fromTo('transform', 'translateX(0px)', `translateX(-${viewWidth}px)`);

    this.showGame = this.animationCtrl
      .create('game')
      .addElement(this.game.nativeElement)
      .duration(500)
      .easing('ease-in')
      .fromTo('opacity', 0, 1)
      .fromTo('transform', `translateX(${viewWidth}px)`, 'translateX(0px)');

    this.showScore = this.animationCtrl
      .create('score')
      .addElement(this.score.nativeElement)
      .duration(500)
      .easing('ease-in')
      .fromTo('opacity', 0, 1)
      .fromTo('transform', `translateX(${viewWidth}px)`, 'translateX(0px)');
  }

  openCategories() {
    this.hideMenuAnimation.direction('alternate').play();
    this.showGame.direction('alternate').play();
    this.activeView = 'game';
    this.scrollEnabled = true;
  }

  openHighscore() {
    this.hideMenuAnimation.direction('alternate').play();
    this.showScore.direction('alternate').play();
    this.activeView = 'score';
    this.scrollEnabled = true;
  }

  showMenu() {
    this.hideMenuAnimation.direction('reverse').play();

    if (this.activeView === 'game') {
      this.showGame.direction('reverse').play();
    } else {
      this.showScore.direction('reverse').play();
    }

    this.activeView = 'menu';
    this.scrollEnabled = false;
  }

  startGame(categorie) {
    console.log('Selected categorie: ', categorie);
  }
}
