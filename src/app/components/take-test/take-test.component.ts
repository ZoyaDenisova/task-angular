import { Component, OnInit, OnDestroy } from '@angular/core';
import { TestService } from '../../services/test.service';
import { ResultService } from '../../services/result.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Test, Question } from '../../models/test.model';
import { FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { timer, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-take-test',
  standalone: true,
  templateUrl: './take-test.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class TakeTestComponent implements OnInit, OnDestroy {
  test!: Test;
  answers!: FormArray;
  currentQ = 0;
  score = 0;
  timeLeft = 0;
  timerSub?: Subscription;
  isFinished = false; // Флаг завершения теста

  constructor(
    private ts: TestService,
    private rs: ResultService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.showError('Некорректный id теста.');
      this.router.navigate(['/student']).then();
      return;
    }

    const user = this.auth.getCurrent();
    if (!user) {
      this.showError('Ошибка: пользователь не найден.');
      this.router.navigate(['/student']).then();
      return;
    }

    // Проверяем: проходил ли пользователь этот тест
    this.rs.getByUser(user.id).subscribe(history => {
      const alreadyPassed = history.some(r => r.testId === id);
      if (alreadyPassed) {
        this.showError('Вы уже проходили этот тест.');
        this.router.navigate(['/student']).then();
      } else {
        // Если не проходил — загружаем тест
        this.loadTest(id);
      }
    });
  }

  private loadTest(id: string): void {
    this.ts.getById(id).subscribe({
      next: t => {
        this.test = t;
        this.answers = this.fb.array(
          t.questions.map(() => this.fb.control(null))
        );
        if (t.timerEnabled) {
          this.timeLeft = t.timerSeconds;
          this.timerSub = timer(0, 1000).subscribe(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
              this.finish();
            }
          });
        }
      },
      error: err => {
        console.error('Ошибка загрузки теста:', err);
        this.showError('Тест не найден или удалён.');
        this.router.navigate(['/student']).then();
      }
    });
  }

  select(idx: number): void {
    if (this.isFinished) return;
    this.answers.at(this.currentQ).setValue(idx);
  }

  next(): void {
    if (this.isFinished) return;
    if (this.currentQ < this.test.questions.length - 1) {
      this.currentQ++;
    } else {
      this.finish();
    }
  }

  finish(): void {
    if (this.isFinished) return; // Защита от повторного вызова
    this.isFinished = true;

    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }

    const user = this.auth.getCurrent();
    if (!user) {
      this.showError('Ошибка: пользователь не найден.');
      return;
    }

    const answers = this.test.questions.map((q: Question, i) => {
      const sel = this.answers.at(i).value;
      const isCorr = sel === q.correctOptionIndex;
      if (isCorr) this.score += q.points;
      return {
        questionId: q.id,
        selectedOptionIndex: sel,
        isCorrect: isCorr,
        pointsAwarded: isCorr ? q.points : 0
      };
    });

    this.rs.save({
      testId: this.test.id,
      testTitle: this.test.title,
      userId: user.id,
      userName: user.username,
      score: this.score,
      date: new Date().toISOString(),
      answers
    }).subscribe({
      next: () => {
        this.snackBar.open(`Вы набрали ${this.score} баллов!`, 'Закрыть', {
          duration: 4000
        });
        // После успешного сохранения — через 2 секунды возврат
        setTimeout(() => {
          this.router.navigate(['/student']).then();
        }, 2000);
      },
      error: () => {
        this.showError('Ошибка сохранения результата!');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Закрыть', { duration: 4000 });
  }
}
