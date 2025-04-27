import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
    NgIf
  ]
})
export class LoginComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async submit(): Promise<void> {
    const { username, password } = this.form.value;

    if (username && password) {
      try {
        const ok = await firstValueFrom(this.auth.login(username, password));

        if (ok) {
          const user = this.auth.getCurrent();
          if (user?.role === 'teacher') {
            const success = await this.router.navigate(['/teacher']);
            if (!success) {
              this.showError('Не удалось перейти на страницу преподавателя.');
            }
          } else {
            const success = await this.router.navigate(['/student']);
            if (!success) {
              this.showError('Не удалось перейти на страницу студента.');
            }
          }
        } else {
          this.showError('Неверное имя пользователя или пароль.');
        }
      } catch (err) {
        console.error('Ошибка авторизации:', err);
        this.showError('Ошибка авторизации. Попробуйте ещё раз.');
      }
    } else {
      this.showError('Заполните все поля.');
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Закрыть', { duration: 4000 });
  }
}
