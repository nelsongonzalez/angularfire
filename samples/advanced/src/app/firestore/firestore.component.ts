import { Component, OnInit, makeStateKey, TransferState } from '@angular/core';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';

import { traceUntilFirst } from '@angular/fire/performance';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-firestore',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      Firestore!
      <code>{{ testDocValue$ | async | json }}</code>
      <br>
      <small>Persistence enabled: <code>{{ (persistenceEnabled | async) ?? false }}</code></small>
    </p>
  `,
  styles: [``]
})
export class FirestoreComponent implements OnInit {

  public readonly testDocValue$: Observable<any>;
  public persistenceEnabled: Promise<boolean> = Promise.resolve(false);

  constructor(state: TransferState) {
    const key = makeStateKey<unknown>('FIRESTORE');
    const existing = state.get(key, undefined);
    this.testDocValue$ = of(existing).pipe(
      switchMap(() => import('./lazyFirestore')),
      tap(({ persistenceEnabled }) => this.persistenceEnabled = persistenceEnabled),
      switchMap(({ valueChanges }) => valueChanges),
      traceUntilFirst('firestore'),
      tap(it => state.set(key, it)),
      existing ? startWith(existing) : tap(),
    );
  }

  ngOnInit(): void {
  }

}
