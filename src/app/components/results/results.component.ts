import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { Result } from '../../models/result.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule
  ]
})
export class ResultsComponent implements OnInit {
  results: Result[] = [];
  displayed = ['userName', 'score', 'date'];

  constructor(
    private rs: ResultService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log('ID теста для получения результатов:', id);

    if (id) {
      this.rs.getByTest(id).subscribe(r => {
        console.log('Результаты теста:', r);
        this.results = r;
      });
    }
  }

}
