import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { AuthService } from '../../services/auth.service';
import { Result } from '../../models/result.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule
  ]
})
export class HistoryComponent implements OnInit {
  history: Result[] = [];
  displayed = ['testId', 'testTitle', 'score', 'date'];

  constructor(
    private rs: ResultService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const u = this.auth.getCurrent()!;
    this.rs.getByUser(u.id).subscribe(h => this.history = h);
  }
}
