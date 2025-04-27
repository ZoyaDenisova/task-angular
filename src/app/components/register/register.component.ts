import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
  ],
})
export class RegisterComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['student', Validators.required],
    });
  }

  async submit(): Promise<void> {
    const { username, password, role } = this.form.value;

    if (username && password && role) {
      try {
        await firstValueFrom(this.auth.register({ username, password, role }));
        this.snackBar.open('Регистрация успешна! Теперь войдите.', 'Закрыть', { duration: 4000 });
        const success = await this.router.navigate(['/login']);
        if (!success) {
          this.snackBar.open('Не удалось перейти на страницу входа.', 'Закрыть', {
            duration: 4000,
          });
        }
      } catch (err: unknown) {
        console.error('Ошибка регистрации:', err);

        const errorMessage =
          err instanceof Error && err.message.includes('существует')
            ? 'Пользователь с таким именем уже существует.'
            : 'Ошибка сервера. Попробуйте позже.';

        this.snackBar.open(errorMessage, 'Закрыть', { duration: 4000 });
      }
    } else {
      this.snackBar.open('Заполните все поля.', 'Закрыть', { duration: 4000 });
    }
  }
}
