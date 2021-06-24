import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Country } from '../interfaces/interfaces';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private BASE_URL = environment.baseHref;

  constructor(private http: HttpClient) { }

  getCountries(){
    // return throwError('offline mode');
    return this.http.get<Country[]>(`${this.BASE_URL}/all`);
  }

}