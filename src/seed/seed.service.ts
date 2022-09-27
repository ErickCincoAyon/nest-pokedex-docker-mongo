import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonService.removePokemonsToSeedData();

    const { results } = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    await Promise.all(
      results.map( async ({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments[ segments.length - 2 ];
        
        await this.pokemonService.fillPokemonWithSeedData({ name, no });
      })
    );

    return 'Seed executed !';
  }

}