import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class TeacherDashboardComponent implements OnInit {
  tests: Test[] = [];

  constructor(
    private ts: TestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ts.getAll().subscribe(t => this.tests = t);
  }

  async create(): Promise<void> {
    const success = await this.router.navigate(['/teacher/create']);
    if (!success) {
      console.error('Не удалось перейти к созданию теста.');
    }
  }

  async viewResults(test: Test): Promise<void> {
    const success = await this.router.navigate(['/teacher/results', test.id]);
    if (!success) {
      console.error('Не удалось перейти к результатам теста.');
    }
  }
}
