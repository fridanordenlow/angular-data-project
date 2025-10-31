import { Component, type OnInit } from '@angular/core';
import { FlightsService } from '../../services/flights-service';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FlightData, LazyLoadReturnType } from '../../flight.model';

@Component({
  selector: 'app-flights',
  imports: [CommonModule],
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
}
