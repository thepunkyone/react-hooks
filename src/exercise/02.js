// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (key, defaultValue, {
  serialize = JSON.stringify,
  deserialize = JSON.parse
} = {}) => {
  const getInitialValue = () => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue  // Type function is it is an expensive computation that should not be run
  }                                                                        // on each rerender

  const [value, setValue] = React.useState(getInitialValue)

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current // when key name is changed, the old key is no longer used, it should get cleared up
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize( value))
  }, [key, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {

  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName='Tracy' />
}

export default App
