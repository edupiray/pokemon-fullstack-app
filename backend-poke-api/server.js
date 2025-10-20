const express = require('express');
const cors = require('cors');


const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Habilita CORS para el frontend Angular
app.use(express.json());

// Ruta para obtener Pokémon
app.get('/api/pokemons', async (req, res) => {
  try {
    const limit = req.query.limit || 4;
    
    console.log(`🔄 Solicitando ${limit} pokémons desde PokeAPI...`);
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error PokeAPI: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Enriquecer datos con información específica de cada Pokémon
    const enrichedPokemons = await Promise.all(
      data.results.map(async (pokemon, index) => {
        const pokemonId = index + 1;
        
        // Obtener detalles específicos del Pokémon
        const detailResponse = await fetch(pokemon.url);
        const pokemonData = await detailResponse.json();
        
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.other['official-artwork'].front_default,
          types: pokemonData.types.map(typeInfo => typeInfo.type.name),
          weight: pokemonData.weight,
          height: pokemonData.height,
          abilities: pokemonData.abilities.slice(0, 2).map(ability => ability.ability.name)
        };
      })
    );
    
    console.log(`✅ ${enrichedPokemons.length} pokémons obtenidos exitosamente`);
    res.json(enrichedPokemons);
    
  } catch (error) {
    console.error('❌ Error en el backend:', error.message);
    res.status(500).json({ 
      error: 'Error obteniendo pokémons', 
      details: error.message 
    });
  }
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor Pokémon funcionando',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Express ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   → GET /api/pokemons?limit=4`);
  console.log(`   → GET /health`);
});