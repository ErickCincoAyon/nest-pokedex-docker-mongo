import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {

    try {
      const pokemon: Pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) { 
      console.log( error );
      await this.handleExceptions( error ) 
    };
    
  }

  async findAll() {
    return `This action returns all pokemon`;
  }

  async findOne( term: string ) {
    let pokemon: Pokemon;
    
    if ( !isNaN( +term ) ) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    
    if ( !pokemon && isValidObjectId( term) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found !`);

    return pokemon;
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto ) {
    const pokemon = await this.findOne( term );

    try {
      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) { await this.handleExceptions( error ) };
  }

  async remove( id: string ) {
    const pokemon = await this.pokemonModel.findByIdAndDelete( id );
    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id "${ id }" not found !`);
    
    return pokemon;
  }

  private async handleExceptions( error: any ) {
    if ( error.code === 11000 )
      throw new ConflictException(`Pokemon exists in db: ${ JSON.stringify( error.keyValue )}`);
    
    throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
  }
}
