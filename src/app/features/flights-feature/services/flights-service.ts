import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { FlightData, LazyLoadReturnType } from '../flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  private readonly dataUrl = 'assets/flightsData.json';

  constructor(private http: HttpClient) {}

  getFlightsInfo(
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
    filter: string
  ): Observable<LazyLoadReturnType> {
    return this.http.get<FlightData[] | null>(this.dataUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching flights data:', error);
        return of(null);
      }),
      map((data) => {
        const totalItems = data?.length;
        const start = page * pageSize;
        const items = data?.slice(start, start + pageSize);

        return { data: items ?? null, total: totalItems };
      })
    );
  }
}

// style pagination
// pipe for time format
// add flight icons, departure etc font awesome
// group data by airline charts etc
