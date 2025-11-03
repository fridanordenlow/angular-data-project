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
        if (data && filter) {
          data = data.filter((item) =>
            Object.values(item).some((val) =>
              val.toString().toLowerCase().includes(filter.toLowerCase())
            )
          );
        }
        if (data && sortField && sortDirection) {
          data = data.sort((a: any, b: any) => {
            const valA = a[sortField];
            const valB = b[sortField];
            // ? valA.localeCompare(valB, 'en', { sensitivity: 'base' })
            if (typeof valA === 'string' && typeof valB === 'string') {
              return sortDirection === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
            } else {
              return sortDirection === 'asc'
                ? valA > valB
                  ? 1
                  : -1
                : valA < valB
                ? 1
                : -1;
            }
          });
        }
        const totalItems = data?.length;
        const start = page * pageSize;
        const items = data?.slice(start, start + pageSize);
        console.log(sortField, sortDirection);

        return { data: items ?? null, total: totalItems };
      })
    );
  }
}

// Idea about how to implement styling
// style pagination
// pipe for time format
// add flight icons, departure etc font awesome
// group data by airline charts etc
