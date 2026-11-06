import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';


interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  weight: number;
  height: number;
  abilities: string[];
}




@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-poke-api');
    private http = inject(HttpClient);
    // Señales reactivas
  pokemons = signal<Pokemon[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.loadPokemons();
  }

  private loadPokemons() {
    this.loading.set(true);
    this.error.set('');

    // Consume nuestro backend Express en lugar de la API directa
    this.http.get<Pokemon[]>('http://localhost:3000/api/pokemons?limit=4')
      .subscribe({
        next: (pokemons) => {
          this.pokemons.set(pokemons);
          this.loading.set(false);
          console.log('✅ Pokémon cargados desde backend:', pokemons.length);
        },
        error: (err) => {
          this.error.set(`Error conectando con el backend: ${err.message}`);
          this.loading.set(false);
          console.error('❌ Error backend:', err);
        }
      });
  }

  onImageError(event: Event, pokemonId: number) {
    const img = event.target as HTMLImageElement;
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  }

}
