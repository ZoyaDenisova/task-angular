import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-teacher-layout',
  imports: [MatToolbar, RouterOutlet, MatButton],
  templateUrl: './teacher-layout.component.html',
})
export class TeacherLayoutComponent {
  username = '';
  role = 'Teacher';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrent();
    if (user) {
      this.username = user.username;
    } else {
      this.router
        .navigate(['/login'])
        .catch((err) => console.error('Ошибка при переходе на страницу входа:', err));
    }
  }

  goHome() {
    this.router
      .navigate(['/teacher'])
      .catch((err) => console.error('Ошибка при переходе на главную:', err));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).catch((err) => console.error('Ошибка при выходе:', err));
  }
}
