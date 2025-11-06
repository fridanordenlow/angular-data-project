import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { FlightData } from './flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  private readonly dataUrl = 'assets/flightsData.json';

  constructor(private http: HttpClient) {}

  getFlights(): Observable<FlightData[]> {
    return this.http.get<FlightData[]>(this.dataUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching flights data:', error);
        return of([]);
      })
    );
  }
}

// Idea about how to implement styling
// pipe for time format
// add flight icons, departure etc font awesome
// group data by airline charts etc

// src/
// └── app/
//     └── features/
//         └── flights-feature/
//             ├── flights/
//             │   ├── flights.ts
//             │   ├── flights.html
//             │   └── flights.scss
//             ├── services/
//             │   ├── flights.service.ts        ← API-hantering (den jag har)
//             │   └── flights-store.service.ts  ← State & logik (ny)
//             └── models/
//                 └── flight.model.ts

// export class FlightsService {
//   private readonly dataUrl = 'assets/flightsData.json';

//   constructor(private http: HttpClient) {}

//   getFlightsInfo(
//     page: number,
//     pageSize: number,
//     sortField: string,
//     sortDirection: string,
//     filters: FlightFilters
//     // filter: string
//   ): Observable<LazyLoadReturnType> {
//     return this.http.get<FlightData[] | null>(this.dataUrl).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.error('Error fetching flights data:', error);
//         return of(null);
//       }),
//       map((data) => {
//         if (data) {
//           // Ex. key = "airline_name", value = "SAS"
//           for (const [key, value] of Object.entries(filters)) {
//             if (value.trim() !== '') {
//               const searchVal = value.trim().toLowerCase();
//               data = data.filter((item) =>
//                 (item as any)[key]
//                   .trim()
//                   .toString()
//                   .toLowerCase()
//                   .includes(searchVal)
//               );
//             }
//           }
//         }
//         // if (data && filter) {
//         //   data = data.filter((item) =>
//         //     Object.values(item).some((val) =>
//         //       val.toString().toLowerCase().includes(filter.toLowerCase())
//         //     )
//         //   );
//         // }
//         if (data && sortField && sortDirection) {
//           data = data.sort((a: any, b: any) => {
//             const valA = a[sortField];
//             const valB = b[sortField];
//             // ? valA.localeCompare(valB, 'en', { sensitivity: 'base' })
//             if (typeof valA === 'string' && typeof valB === 'string') {
//               return sortDirection === 'asc'
//                 ? valA.localeCompare(valB)
//                 : valB.localeCompare(valA);
//             } else {
//               return sortDirection === 'asc'
//                 ? valA > valB
//                   ? 1
//                   : -1
//                 : valA < valB
//                 ? 1
//                 : -1;
//             }
//           });
//         }
//         const totalItems = data?.length;
//         const start = page * pageSize;
//         const items = data?.slice(start, start + pageSize);
//         console.log(sortField, sortDirection);

//         return { data: items ?? null, total: totalItems };
//       })
//     );
//   }
// }
