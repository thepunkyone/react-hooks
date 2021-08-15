// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status: 'idle', pokemon: null, error: ''})

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending', pokemon: null, error: ''})

    fetchPokemon(pokemonName).then(pokemonData => {
      setState({status: 'resolved', pokemon: pokemonData, error: ''})
    }).catch(err => {
      setState({status: 'rejected', pokemon: null, error: err.message})
    })
  }, [pokemonName])

  if (state.status === 'rejected') throw state.error

  if (state.status === 'pending') return 'Searching pokemon'

  if (!pokemonName) return 'Submit a pokemon'

  if (pokemonName && !state.pokemon) return <PokemonInfoFallback name={pokemonName} />

  return <PokemonDataView pokemon={state.pokemon} />
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: '',
      errorInfo: '',
      hasError: false,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({errorInfo})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>{this.state.error}</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
        <div className="pokemon-info">
          <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
        </div>
    </div>
  )
}

export default App
