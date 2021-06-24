import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-borders-modal',
  templateUrl: './borders-modal.component.html',
  styleUrls: ['./borders-modal.component.scss']
})

export class BordersModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BordersModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  close(){
    this.dialogRef.close();
  }

}