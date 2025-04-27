import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TestService } from '../../services/test.service';

interface Question {
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}

@Component({
  selector: 'app-create-test',
  standalone: true,
  templateUrl: './create-test.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
  ],
})
export class CreateTestComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ts: TestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      timerEnabled: [false],
      timerSeconds: [0],
      questions: this.fb.array<Question>([]),
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(
      this.fb.group({
        text: ['', Validators.required],
        options: this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required),
        ]),
        correctOptionIndex: [0],
        points: [1, Validators.min(1)],
      })
    );
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addOption(qIdx: number): void {
    (this.questions.at(qIdx).get('options') as FormArray).push(
      this.fb.control('', Validators.required)
    );
  }

  submit(): void {
    if (this.form.invalid) {
      this.showValidationErrors();
      return;
    }

    const val = this.form.value;
    this.ts
      .create({
        title: val.title,
        timerEnabled: val.timerEnabled,
        timerSeconds: val.timerSeconds,
        questions:
          val.questions?.map((q: Question, i: number) => ({
            id: i + 1,
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            points: q.points,
          })) ?? [],
      })
      .subscribe(() => this.router.navigate(['/teacher']));
  }

  private showValidationErrors(): void {
    if (!this.form.get('title')?.value) {
      this.snackBar.open('Введите название теста.', 'Закрыть', { duration: 4000 });
      return;
    }

    if (this.questions.length === 0) {
      this.snackBar.open('Добавьте хотя бы один вопрос.', 'Закрыть', { duration: 4000 });
      return;
    }

    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions.at(i);
      if (q.get('text')?.invalid) {
        this.snackBar.open(`Вопрос №${i + 1}: текст обязателен.`, 'Закрыть', { duration: 4000 });
        return;
      }
      const options = (q.get('options') as FormArray).controls;
      if (options.length < 2) {
        this.snackBar.open(`Вопрос №${i + 1}: минимум 2 варианта ответа.`, 'Закрыть', {
          duration: 4000,
        });
        return;
      }
      if (q.get('points')?.invalid) {
        this.snackBar.open(`Вопрос №${i + 1}: баллы должны быть больше 0.`, 'Закрыть', {
          duration: 4000,
        });
        return;
      }
    }
  }

  getOptionsControls(q: AbstractControl): AbstractControl[] {
    return (q.get('options') as FormArray).controls;
  }
}
