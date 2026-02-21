import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

// Interfaz para tipar los datos que recibiremos de la API
interface PokemonDetails {
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  types: {
    type: {
      name: string;
    }
  }[];
}

export default function Details() {
  const params = useLocalSearchParams();
  const pokemonName = params.name as string;

  // Estados para guardar los datos y controlar la pantalla de carga
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonByName = async (name: string) => {
      try {
        // Hacemos el fetch usando el nombre del Pokémon en minúsculas
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.log("Error fetching pokemon details:", error);
      } finally {
        // Apagamos el loader independientemente de si hubo error o éxito
        setLoading(false); 
      }
    };

    if (pokemonName) {
      fetchPokemonByName(pokemonName);
    }
  }, [pokemonName]);

  return (
    <View style={styles.container}>
      {/* Configuramos el header dinámicamente con el nombre */}
      <Stack.Screen 
        options={{ 
          title: pokemonName, 
          headerTitleStyle: { textTransform: 'capitalize' } 
        }} 
      />
      
      {/* Mostrar un círculo de carga mientras llegan los datos */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : pokemon ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Usamos el artwork oficial si está disponible para mejor calidad, si no el sprite normal */}
          <Image 
            source={{ uri: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default }} 
            style={styles.image} 
          />
          
          <Text style={styles.name}>{pokemon.name}</Text>
          
          {/* Mapeamos los tipos del Pokémon */}
          <View style={styles.typesContainer}>
            {pokemon.types.map((t, index) => (
              <View key={index} style={styles.typeBadge}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>

          {/* Tarjeta de estadísticas (peso y altura) */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Peso</Text>
              {/* La API devuelve el peso en hectogramos, lo dividimos entre 10 para kg */}
              <Text style={styles.statValue}>{pokemon.weight / 10} kg</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Altura</Text>
              {/* La API devuelve la altura en decímetros, la dividimos entre 10 para metros */}
              <Text style={styles.statValue}>{pokemon.height / 10} m</Text>
            </View>
          </View>

        </ScrollView>
      ) : (
        <Text style={styles.errorText}>No se pudo cargar la información.</Text>
      )}
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
    color: '#333',
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  typeBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#555',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    // Sombras para iOS y Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'red',
  }
});