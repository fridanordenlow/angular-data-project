import { Injectable, signal } from '@angular/core';
import { FlightData, FlightFilterKey, FlightFilters } from './flight.model';
import { FlightsService } from './flights.service';

@Injectable({
  providedIn: 'root',
})
export class FlightsStore {
  DEFAULT_FILTERS = Object.fromEntries(
    [
      'airline_name',
      'arrival_airport',
      'arrival_city',
      'departure_airport',
      'departure_city',
    ].map((key) => [key, ''])
  ) as Record<FlightFilterKey, string>;

  // Raw data from API, source of truth
  private allFlights = signal<FlightData[]>([]);
  // Derived data, what the user sees in the UI (after filters, sorting, pagination)
  displayedFlights = signal<FlightData[]>([]);

  totalItems = signal(0);
  page = signal(0);
  pageSize = signal(20);
  sortField = signal<keyof FlightData | ''>('');
  sortDirection = signal<'asc' | 'desc' | ''>('');
  filters = signal<FlightFilters>({
    ...this.DEFAULT_FILTERS,
  });

  constructor(private flightsService: FlightsService) {
    this.loadFlights();
  }

  loadFlights() {
    this.flightsService.getFlights().subscribe((res) => {
      this.allFlights.set(res ?? []);
      this.displayedFlights.set(res ?? []);
      this.totalItems.set(res.length);
      console.log(res);
    });
  }

  private recomputeFlights() {
    // Copy raw data
    let data = [...this.allFlights()];

    // Filter for ex. key = "airline_name", value = "SAS"
    for (const [key, value] of Object.entries(this.filters())) {
      if (value.trim() !== '') {
        const searchVal = value.trim().toLowerCase();
        data = data.filter((item: any) =>
          item[key].toString().toLowerCase().includes(searchVal)
        );
      }
    }

    // Sort
    const sortField = this.sortField();
    const sortDirection = this.sortDirection();

    if (sortField && sortDirection) {
      data.sort((a: any, b: any) => {
        const valA = a[sortField];
        const valB = b[sortField];

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

    // Pagination
    const start = this.page() * this.pageSize();
    const paged = data.slice(start, start + this.pageSize());

    // Update signals
    this.displayedFlights.set(paged);
    this.totalItems.set(data.length);
  }

  applyFilters() {
    this.page.set(0);
    this.recomputeFlights();
  }

  clearFilters() {
    this.filters.set({ ...this.DEFAULT_FILTERS });
    this.page.set(0);
    this.recomputeFlights();
  }

  sort(field: keyof FlightData) {
    const currentField = this.sortField();
    const currentDirection = this.sortDirection();

    if (currentField === field) {
      // Toggle direction
      this.sortDirection.set(currentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }

    this.recomputeFlights();
  }

  nextPage() {
    this.page.update((p) => p + 1);
    this.recomputeFlights();

    // const currentPage = this.page();
    // const pageSize = this.pageSize();
    // const totalItems = this.totalItems();

    // if ((currentPage + 1) * pageSize < totalItems) {
    //   this.page.set(currentPage + 1);
    //   this.recomputeFlights();
    // }
  }

  prevPage() {
    this.page.update((p) => Math.max(0, p - 1));
    this.recomputeFlights();

    // const currentPage = this.page();

    // if (currentPage > 0) {
    //   this.page.set(currentPage - 1);
    //   this.recomputeFlights();
    // }
  }
}
