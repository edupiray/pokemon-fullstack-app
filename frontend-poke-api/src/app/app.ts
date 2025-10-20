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
  template: ` <div class="container">
      <h1>🏠 Pokédex Avanzada</h1>
      <p class="subtitle">Conectado via Backend Express</p>

      @if (pokemons().length > 0) {
        <div class="pokemon-grid">
          @for (pokemon of pokemons(); track pokemon.id) {
            <div class="pokemon-card">
              <div class="pokemon-header">
                <span class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
                <h3 class="pokemon-name">{{ pokemon.name | titlecase }}</h3>
              </div>

              <img
                [src]="pokemon.image"
                [alt]="pokemon.name"
                class="pokemon-image"
                (error)="onImageError($event, pokemon.id)"
              />

              <div class="pokemon-types">
                @for (type of pokemon.types; track type) {
                  <span [class]="'type-badge type-' + type">
                    {{ type }}
                  </span>
                }
              </div>

              <div class="pokemon-stats">
                <div class="stat">
                  <span class="stat-label">Altura</span>
                  <span class="stat-value">{{ pokemon.height / 10 }} m</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Peso</span>
                  <span class="stat-value">{{ pokemon.weight / 10 }} kg</span>
                </div>
              </div>

              <div class="pokemon-abilities">
                <strong>Habilidades:</strong>
                <div>
                  @for (ability of pokemon.abilities; track ability) {
                    <span class="ability">{{ ability | titlecase }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Cargando Pokémon desde el backend...</p>
        </div>
      } @else {
        <div class="error" [class.hidden]="!error()">
          {{ error() }}
        </div>
      }
    </div>
  `,
  styles: `
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Arial', sans-serif;
    }

    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .subtitle {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 30px;
      font-style: italic;
    }

    .pokemon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      justify-items: center;
    }

    .pokemon-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
      border: 2px solid #e0e0e0;
      position: relative;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        border-color: #ffcb05;
      }
    }

    .pokemon-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .pokemon-id {
      background: #34495e;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }

    .pokemon-name {
      color: #2c3e50;
      margin: 0;
      font-size: 1.4em;
    }

    .pokemon-image {
      width: 160px;
      height: 160px;
      object-fit: contain;
      background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
      border-radius: 50%;
      padding: 15px;
      margin: 10px auto;
    }

    .pokemon-types {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin: 15px 0;
      flex-wrap: wrap;
    }

    .type-badge {
      padding: 6px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pokemon-stats {
      display: flex;
      justify-content: space-around;
      margin: 15px 0;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-label {
      font-size: 11px;
      color: #7f8c8d;
      text-transform: uppercase;
    }

    .stat-value {
      font-weight: bold;
      color: #2c3e50;
    }

    .pokemon-abilities {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ecf0f1;
    }

    .ability {
      display: inline-block;
      background: #3498db;
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      margin: 2px;
    }

    /* Colores de tipos Pokémon */
    .type-normal { background: #a8a878; }
    .type-fire { background: #f08030; }
    .type-water { background: #6890f0; }
    .type-electric { background: #f8d030; color: #2c3e50; }
    .type-grass { background: #78c850; }
    .type-ice { background: #98d8d8; color: #2c3e50; }
    .type-fighting { background: #c03028; }
    .type-poison { background: #a040a0; }
    .type-ground { background: #e0c068; color: #2c3e50; }
    .type-flying { background: #a890f0; }
    .type-psychic { background: #f85888; }
    .type-bug { background: #a8b820; }
    .type-rock { background: #b8a038; }
    .type-ghost { background: #705898; }
    .type-dragon { background: #7038f8; }
    .type-dark { background: #705848; }
    .type-steel { background: #b8b8d0; color: #2c3e50; }
    .type-fairy { background: #ee99ac; }

    .loading {
      text-align: center;
      margin: 50px 0;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      background: #e74c3c;
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }

    .hidden {
      display: none;
    }
  `
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
