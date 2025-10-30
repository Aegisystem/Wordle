import { useEffect } from 'react'
import './Keyboard.css'

const keyboard = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
]

const Keyboard = ({ guesses, solution, onKeyDown }) => {

    return (
        <div className='keyboard'>
            {
                keyboard.map((row, index) => 
                    <KeyRow key={index} row={row} guesses={guesses} solution={solution} onKeyDown={onKeyDown}/>
                )
            }
        </div>
    )
}

const KeyRow = ({ row, guesses, solution, onKeyDown }) => {
    let keys = []
    const keysColors = {}

    guesses.map(guess => {
        guess?.split('').map((char, i) => {
            const newColor = solution[i] === char ? 'correct' 
                : solution.includes(char) ? 'almost'
                : 'incorrect'
            if(keysColors[char]) {
                if((keysColors[char] === 'almost' || keysColors === 'incorrect') && newColor === 'correct') {
                    keysColors[char] = newColor
                } else if(keysColors[char] === 'incorrect' && newColor === 'almost') {
                    keysColors[char] = newColor
                }

            } else {
                keysColors[char] = newColor
            }
        })
    })
    
    row.split("").forEach(key => {
        return keys.push(
        <div 
            key={key} 
            className={'key '+ keysColors[key]}
            onClick={ () => onKeyDown(key) }
        >
            {key}
        </div>)
    })

    if (row === "ZXCVBNM") {
        keys.unshift(
        <div
            key="ENTER"
            className="key wide"
            onClick={() => onKeyDown('ENTER')}
        >
            &nbsp;&nbsp;Enter&nbsp;&nbsp;
        </div>
        )
        keys.push(
        <div
            key="BACKSPACE"
            className="key wide"
            onClick={() => onKeyDown('BACKSPACE')}
        >
            ⌫
        </div>
        )
    }

    return (
        <div className='keyRow'>
            {keys}
        </div>
    )
}

export default Keyboard