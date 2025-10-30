import {
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { SwapiApiService } from '../../services/swapi-api.service';
import { Root } from '../../models/swapi.model';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-swapi-api',
  imports: [DecimalPipe],
  templateUrl: './swapi-api.component.html',
  styleUrl: './swapi-api.component.scss',
})
export class SwapiApiComponent implements OnInit, OnDestroy {
  planetResponse?: Root;
  initialPlanetsUrl = 'https://swapi.dev/api/planets';
  // subscription = new Subscription();
  // filmUrls?: string[];

  constructor(
    private swapiApiService: SwapiApiService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.getPlanets(this.initialPlanetsUrl);
  }

  ngOnDestroy(): void {}

  getPlanets(url: string) {
    this.swapiApiService.getSwapiData(url).subscribe((result: Root) => {
      result.results = result.results.map((planet) => {
        return {
          ...planet,
          filmsCount: planet.films.length,
          filmsArray: this.fetchParams(planet.films),
          residentsArray: this.fetchParams(planet.residents),
        };
      });
      this.planetResponse = result;
      console.log(this.planetResponse);
      console.log(this.planetResponse.results[0].filmsArray);
    });
  }

  fetchParams(endpoints: string[]) {
    const value: any[] = [];
    forkJoin(endpoints.map((url) => this.httpClient.get<any[]>(url))).subscribe(
      (results) => {
        value.push(results);
      }
    );
    return value;
  }
}

// export class SwapiApiService {
//   baseUrl = 'https://swapi.dev/api/';

//   constructor(private http: HttpClient) {}

//   getSwapiData(url: string): Observable<Root> {
//     return this.http.get<Root>(url);
//   }
