import { useEffect, useState } from 'react'
import './App.css'
import Keyboard from './Keyboard'

const WORD_LENGTH = 5

const WORDS_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

function App() {

  const [solution, setSolution] = useState('')
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentWord, setCurrentWord] = useState("")
  const [gameOver, setGameOver] = useState(false)


  useEffect( () => {
    const fetchWord = async () => {
      const resp = await fetch('https://api.frontendexpert.io/api/fe/wordle-words')
      const words = await resp.json()
      const rand = words[Math.floor(Math.random() * words.length)]
      setSolution( rand )
    }

    fetchWord()
  }, [])

  useEffect( () => {
    const checkWord = async (word) => {
      const res = await fetch(WORDS_API+word)
      return res.status != 404
    } 

    const keyDownHandler = async (e) => {
      const pressedKey = e.key.toUpperCase()

      if(gameOver) return;
      
      if(pressedKey === 'BACKSPACE') {
        setCurrentWord(currentWord.slice(0,-1))
        return
      }

      if(pressedKey === "ENTER" && currentWord.length === 5) {
        if(!(await checkWord(currentWord))) {
          alert('Word doesn\'t exist')
          return
        }


        const currGuess = guesses.findIndex(guess => guess === null)
        const newGuesses = [...guesses]
        newGuesses[currGuess] = currentWord
        const oldWord = currentWord
        setCurrentWord('')
        setGuesses(newGuesses)
        if(currGuess === 5 || oldWord == solution) {
          setGameOver(true)
        }
      }

      if(pressedKey.match(/^[A-Z]{1}$/) && currentWord.length < 5) {
        setCurrentWord(currentWord + pressedKey)
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => document.removeEventListener("keydown", keyDownHandler)
  }, [currentWord, guesses])

  return (
      <div className='board'>
        {
          guesses.map((guess, index) => {
            const isCurrent = guesses.findIndex(guess => guess === null) === index
            return (
              <WordLine key={index}
                isReady={!isCurrent && guess != null}
                solution={solution}
                word={isCurrent ? currentWord : guess ?? ""}/>
            )
          })
        }
        <Keyboard guesses={guesses} solution={solution}/>
        {gameOver ? guesses.includes(solution) ? 
          "You Won" : `You Lose the word was: ${solution}` : ""
        }
      </div>
  )
}

const WordLine = ( { word, isReady, solution } ) => {
  const tiles = []
  const copy = solution.split('')
  for(let i=0; i<WORD_LENGTH; i++) {
    const char = word[i]
    const state = !isReady ? '' : copy[i] === char ? 'correct' 
      : copy.includes(char) ? 'almost'
      : 'incorrect'
    if(state !== '') copy[copy.findIndex(letter => letter==char)] = '-' 
    tiles.push(
      <div key={i} className={'tile '+state}>{char}</div>
    )
  }
  
  return (
    <div className='wordLine'>
      {tiles}
    </div>
  )
}

export default App
