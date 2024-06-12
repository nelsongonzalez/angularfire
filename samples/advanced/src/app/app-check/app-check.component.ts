import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getToken, AppCheck } from '@angular/fire/app-check';
import { traceUntilFirst } from '@angular/fire/performance';
import { from, Observable } from 'rxjs';
import { keepUnstableUntilFirst } from '@angular/fire';
import { share, tap } from 'rxjs/operators';

@Component({
  selector: 'app-app-check',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      App Check!
      <code>{{ (change$ | async)?.token | slice:0:12 }}<ng-container *ngIf="(change$ | async) !== null">&hellip;</ng-container></code>
    </p>
  `,
  styles: []
})
export class AppCheckComponent implements OnInit {

  readonly change$: Observable<any>;

  constructor(appCheck: AppCheck) {
    this.change$ = from(getToken(appCheck)).pipe(
      keepUnstableUntilFirst,
      traceUntilFirst('app-check'),
      share(),
    );
  }

  ngOnInit(): void {
  }

}
