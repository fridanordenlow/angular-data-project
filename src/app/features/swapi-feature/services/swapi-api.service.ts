import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Root } from '../models/swapi.model';

@Injectable({
  providedIn: 'root',
})
export class SwapiApiService {
  baseUrl = 'https://swapi.dev/api/';

  constructor(private http: HttpClient) {}

  getSwapiData(url: string): Observable<Root> {
    return this.http.get<Root>(url);
  }
}
