import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { ResultService } from '../../services/result.service';
import { AuthService } from '../../services/auth.service';
import { Test } from '../../models/test.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatButtonModule, MatSnackBarModule],
})
export class StudentDashboardComponent implements OnInit {
  tests: (Test & { completed?: boolean })[] = [];

  constructor(
    private ts: TestService,
    private rs: ResultService,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrent();
    if (!user) {
      console.error('Пользователь не найден.');
      return;
    }

    this.ts.getAll().subscribe((tests) => {
      this.rs.getByUser(user.id).subscribe((results) => {
        const completedTestIds = results.map((r) => r.testId);
        this.tests = tests.map((test) => ({
          ...test,
          completed: completedTestIds.includes(test.id),
        }));
      });
    });
  }

  async take(test: Test & { completed?: boolean }): Promise<void> {
    if (test.completed) {
      this.snackBar.open('Этот тест уже пройден. Повторное прохождение невозможно.', 'Закрыть', {
        duration: 4000,
      });
      return;
    }

    console.log('Пробую перейти к тесту:', test);
    console.log('ID теста:', test.id);

    const success = await this.router.navigate(['/student/take', test.id]);
    if (!success) {
      console.error('Не удалось перейти к тесту.');
    }
  }

  async history(): Promise<void> {
    const success = await this.router.navigate(['/student/history']);
    if (!success) {
      console.error('Не удалось перейти к истории.');
    }
  }
}
