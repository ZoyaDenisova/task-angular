import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TeacherLayoutComponent } from './components/layouts/teacher-layout.component';
import { StudentLayoutComponent } from './components/layouts/student-layout.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { ResultsComponent } from './components/results/results.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { TakeTestComponent } from './components/take-test/take-test.component';
import { HistoryComponent } from './components/history/history.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- Teacher Routes ---
  {
    path: 'teacher',
    component: TeacherLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'teacher' },
    children: [
      { path: '', component: TeacherDashboardComponent },
      { path: 'create', component: CreateTestComponent },
      { path: 'results/:id', component: ResultsComponent },
    ],
  },

  // --- Student Routes ---
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
    children: [
      { path: '', component: StudentDashboardComponent },
      { path: 'take/:id', component: TakeTestComponent },
      { path: 'history', component: HistoryComponent },
    ],
  },

  { path: '**', redirectTo: 'login' }
];
