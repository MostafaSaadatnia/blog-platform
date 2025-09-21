import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete post?</h2>
    <div mat-dialog-content>Are you sure? This action cannot be undone.</div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">Cancel</button>
      <button mat-flat-button color="warn" (click)="close(true)">Delete</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  private ref = inject(MatDialogRef<ConfirmDialogComponent, boolean>);
  close(v: boolean) {
    this.ref.close(v);
  }
}
