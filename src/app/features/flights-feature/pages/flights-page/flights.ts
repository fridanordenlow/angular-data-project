import { Component, type OnInit } from '@angular/core';
import { FlightsService } from '../../services/flights-service';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FlightData, HeaderItems } from '../../flight.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';

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
  filter = '';

  faSort = faSort;

  headerItems: HeaderItems[] = [
    {
      label: 'Airline',
      sortField: 'airline_name',
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
      label: 'Departure airport',
      sortField: 'departure_airport',
    },
    {
      label: 'Departure city',
      sortField: 'departure_city',
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

  ngOnInit(): void {
    this.getFlights();
  }

  getFlights() {
    this.flightService
      .getFlightsInfo(
        this.page,
        this.pageSize,
        this.sortField,
        this.sortDirection,
        this.filter
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
      this.getFlights();
    }
  }

  onPrevPage() {
    if (this.page > 0) {
      this.page--;
      this.getFlights();
    }
  }

  onSort(field: keyof FlightData) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.getFlights();
  }

  onFilter(value: string) {
    this.filter = value;
    this.page = 0;
    this.getFlights();
  }
}
