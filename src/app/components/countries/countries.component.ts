import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BordersModalComponent } from '../borders-modal/borders-modal.component';
import { Country } from 'src/app/interfaces/interfaces';
import { MatPaginator } from '@angular/material/paginator';
import {fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})

export class CountriesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'alpha3Code', 'population', 'capital', 'borders'];
  dataSource = new MatTableDataSource(<Country[]>[]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedOfflineCountries: Country[] = [];
  offlineMode = false;
  @ViewChild('input') input: ElementRef;
  
  constructor(private apiService: ApiService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getCountries();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    fromEvent(this.input.nativeElement,'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(800),
                distinctUntilChanged(),
                tap((text) => {
                  this.doFilter(this.input.nativeElement.value);
                })
            )
            .subscribe();
  }

  getCountries() {
    this.apiService.getCountries().subscribe(res => {
      this.dataSource.data = res;
      this.displayedColumns = ['checkbox'].concat(this.displayedColumns)
      this.setOfflineCountries();
    }, err => {
      this.offlineMode = true;      
      if(localStorage.getItem('offlineCountries')){
        this.dataSource.data = JSON.parse(localStorage.getItem('offlineCountries') || '');
      }
    })
  }

  doFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openBordersModal(country: Country) {
    let bordersInformation: Country[] = [];
    if(this.offlineMode){
      bordersInformation = country.offlineBorders;
    }
    else{
      bordersInformation = this.dataSource.data.filter(c => country.borders.includes(c.alpha3Code))
    }
    
    this.dialog.open(BordersModalComponent, {
      width: '400px',
      panelClass: 'custom-modalbox',
      data: { borders: bordersInformation }
    });
  }

  checkboxChanged(event: any, country: Country) {
    if (event.target.checked) {
      country.offlineBorders = this.dataSource.data.filter(c => country.borders.includes(c.alpha3Code));
      this.selectedOfflineCountries.push(country);
    }
    else {
      let index = this.selectedOfflineCountries.findIndex(c => c.alpha3Code == country.alpha3Code);
      if (index > -1) {
        this.selectedOfflineCountries.splice(index, 1);
      }
    }
  }

  saveOfflineData() {
    localStorage.setItem('offlineCountries', JSON.stringify(this.selectedOfflineCountries));
    Swal.fire(
      '',
      'The selected countries has been saved to offline mode',
      'success'
    )
  }

  setOfflineCountries() {
    if (localStorage.getItem('offlineCountries')) {
      this.selectedOfflineCountries = JSON.parse(localStorage.getItem('offlineCountries') || '');
      this.selectedOfflineCountries.forEach(c => {
        this.dataSource.data.map(country => {
          if(country.alpha3Code == c.alpha3Code){
            country.isStoredInOfflineMode = true;
          }
          return country;
        })
      })
    }
  }
}