import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, takeUntil } from 'rxjs';
import { FuseLoadingService } from '../services/loading/loading.service';

@Component({
  selector: 'fuse-loading-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseLoadingBar'
})
export class FuseLoadingBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() autoMode: boolean = true;
  mode: 'determinate' | 'indeterminate' = 'determinate';
  progress: number = 0;
  show: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _fuseLoadingService: FuseLoadingService,
    private _changeDetectRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoMode' in changes) {
      // Aquí puedes volver a activar el siguiente si `autoMode` es funcional
      // this._fuseLoadingService.setAutoMode(coerceBooleanProperty(changes.autoMode.currentValue));
    }
  }

  ngOnInit(): void {
    this._fuseLoadingService.mode$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => this.mode = value);

    this._fuseLoadingService.progress$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => this.progress = value);

    this._fuseLoadingService.show$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(value => {
        this.show = value;
        this._changeDetectRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
