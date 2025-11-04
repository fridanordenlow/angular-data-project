export interface FlightData {
  airline_name: string;
  departure_airport: string;
  departure_city: string;
  arrival_airport: string;
  arrival_city: string;
  flight_duration_hours: number;
  flight_number: string;
}

export interface LazyLoadReturnType {
  data: FlightData[] | null;
  total: number | undefined;
}

export interface HeaderItems {
  label: string;
  sortField: keyof FlightData;
}

export interface FlightFilters {
  airline_name: string;
  arrival_airport: string;
  arrival_city: string;
  departure_airport: string;
  departure_city: string;
}

export type FlightFilterKey = keyof FlightFilters;
