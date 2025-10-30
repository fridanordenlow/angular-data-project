export interface Root {
  count: number;
  next: string | null;
  previous: string | null;
  results: Planet[];
}

export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  filmsArray?: any[];
  filmsCount?: number;
  created: string;
  edited: string;
  url: string;
}
