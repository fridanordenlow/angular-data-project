import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSort, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
// import { debounceTime, Subject } from 'rxjs';
import { FlightsService } from '../../services/flights-service';
import {
  FlightData,
  FlightFilterKey,
  FlightFilters,
  HeaderItems,
} from '../../models/flight.model';

@Component({
  selector: 'app-flights',
  imports: [CommonModule, FontAwesomeModule],
  providers: [FlightsService],
  templateUrl: './flights.html',
  styleUrl: './flights.scss',
})
export class Flights implements OnInit {
  flightsData: FlightData[] | null = null;
  totalItems = 0;

  page = 0;
  pageSize = 20;
  sortField: keyof FlightData | '' = '';
  sortDirection: 'asc' | 'desc' | '' = '';
  // filter = '';
  filters: FlightFilters = {
    airline_name: '',
    arrival_airport: '',
    arrival_city: '',
    departure_airport: '',
    departure_city: '',
  };

  faMagnifyingGlass = faMagnifyingGlass;
  faSort = faSort;

  filterItems: { key: FlightFilterKey; label: string }[] = [
    { key: 'airline_name', label: 'Airline' },
    { key: 'departure_airport', label: 'Departure airport' },
    { key: 'departure_city', label: 'Departure city' },
    { key: 'arrival_airport', label: 'Arrival airport' },
    { key: 'arrival_city', label: 'Arrival city' },
  ];

  headerItems: HeaderItems[] = [
    {
      label: 'Airline',
      sortField: 'airline_name',
    },
    {
      label: 'Departure airport',
      sortField: 'departure_airport',
    },
    {
      label: 'Departure city',
      sortField: 'departure_city',
    },
    {
      label: 'Arrival airport',
      sortField: 'arrival_airport',
    },
    {
      label: 'Arrival city',
      sortField: 'arrival_city',
    },
    {
      label: 'Flight duration',
      sortField: 'flight_duration_hours',
    },
    {
      label: 'Flight number',
      sortField: 'flight_number',
    },
  ];

  constructor(private title: Title, private flightService: FlightsService) {
    this.title.setTitle('Flights page');
  }

  // private filterSubject = new Subject<string>();
  // private filterSubject = new Subject<void>();

  ngOnInit(): void {
    this.loadFlights();

    // this.filterSubject.pipe(debounceTime(500)).subscribe(() => {
    //   this.page = 0;
    //   this.loadFlights();
    // });
  }

  loadFlights() {
    this.flightService
      .getFlightsInfo(
        this.page,
        this.pageSize,
        this.sortField,
        this.sortDirection,
        this.filters
      )
      .subscribe({
        next: (res) => {
          this.flightsData = res.data;
          this.totalItems = res.total ?? 0;
        },
      });
  }

  onNextPage() {
    if ((this.page + 1) * this.pageSize < this.totalItems) {
      this.page++;
      this.loadFlights();
    }
  }

  onPrevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadFlights();
    }
  }

  onSort(field: keyof FlightData) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadFlights();
  }

  onFilter(field: keyof typeof this.filters, inputVal: string) {
    this.filters[field] = inputVal; // Ex. this.filters.arrival_city = "Stockholm".
    // this.filterSubject.next();
  }

  applyFilters() {
    for (const key in this.filters) {
      if (!this.filters[key as keyof FlightFilters]?.trim()) {
        this.filters[key as keyof FlightFilters] = '';
      }
    }
    console.log('Applied filters', this.filters);

    this.page = 0;
    this.loadFlights();
  }

  clearFilters() {
    this.filters = {
      airline_name: '',
      arrival_airport: '',
      arrival_city: '',
      departure_airport: '',
      departure_city: '',
    };

    this.page = 0;
    this.loadFlights();
  }
  // onFilter(value: string) {
  //   this.filterSubject.next(value);
  // }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
