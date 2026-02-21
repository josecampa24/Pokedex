import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Interfaces para TypeScript
interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

// Objeto de colores basados en el tipo
const colorsByType: { [key: string]: string } = {
  grass: '#78C850', 
  fire: '#F08030',
  water: '#6890F0',
  bug: '#A8B820',
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        const data = await response.json();

        
        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              name: pokemon.name,
              image: details.sprites.front_default,
              imageBack: details.sprites.back_default,
              types: details.types,
            };
          })
        );
        
        setPokemons(detailedPokemons);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      {pokemons.map((pokemon) => {
       
        const bgColor = colorsByType[pokemon.types[0].type.name] || '#ccc';

        return (
          <Link
            key={pokemon.name}
            href={{ pathname: "/details", params: { name: pokemon.name } }}
            asChild
          >
            <Pressable>
              <View style={[styles.card, { backgroundColor: bgColor + '50' }]}>
                
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={{ uri: pokemon.image }}
                    style={{ width: 150, height: 150 }}
                  />
                  <Image
                    source={{ uri: pokemon.imageBack }}
                    style={{ width: 150, height: 150 }}
                  />
                </View>
                
                <Text style={styles.name}>{pokemon.name}</Text>
                <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

              </View>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});