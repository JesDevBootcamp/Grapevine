// Input Area: Multiline text input area for composing chat messages.

import { useState, useId, useRef } from 'react'
import lodash from 'lodash'
import axios from 'axios'
import Button from './Button'

import '../styles/input-area.scss'
import EmojiContainer from './EmojiContainer'
import GifContainer from './GifContainer'


export default function InputArea({ callback }) {
    const [message, setMessage] = useState('')
    const [openEmojis, setOpenEmojis] = useState(false)
    const [openGifs, setOpenGifs] = useState(false)
    const [randomGifs, setRandomGifs] = useState([])

    console.log('randomGifs', randomGifs)

    const inputId = useId()
    let ref = useRef()

    function submitHandler(event) {
        event.preventDefault()
        callback(message)
        setMessage('')
    }

    function onEnterPress(e) {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault()
            ref.requestSubmit()
        }
    }

    async function getRandomGifs(){
        const { data } = await axios.get(`/api/randomgifs`)
        setRandomGifs(data)
    }

    return (
        <form
            ref={(el) => (ref = el)}
            className="input-area"
            onSubmit={submitHandler}
        >
            <label className="input-area-label" htmlFor={inputId}>
                Enter Message:
            </label>
            <textarea
                className="input-area-field"
                id={inputId}
                autoFocus={true}
                autoComplete="off"
                placeholder={lodash.sample([
                    'I like rocks.',
                    'I like to watch kids tv.',
                    'Grapes are the best fruit!',
                    'The earth is flat.',
                    'Pancakes > waffles',
                    '#ihatewaffles',
                    'I drive a Ford f550.',
                ])}
                value={message}
                onChange={(event) => {
                    setMessage(event.target.value)
                }}
                onKeyDown={onEnterPress}
            />
            <button
                type="button"
                style={{
                    height: 40,
                    width: 40,
                    borderRadius: '50%',
                    border: '2px solid green',
                }}
                onClick={() => {
                    setOpenEmojis(!openEmojis)
                }}
            >
                😁
            </button>
            <EmojiContainer
                openEmojis={openEmojis}
                message={message}
                setMessage={setMessage}
            />
            <button
                type="button"
                style={{
                    height: 40,
                    width: 40,
                    borderRadius: '50%',
                    border: '2px solid green',
                }}
                onClick={() => {
                    setOpenGifs(!openGifs)
                    getRandomGifs(randomGifs)
                }}
            >
                GIF
            </button>
            <GifContainer openGifs={openGifs} randomGifs={randomGifs}/>
            <Button variant="primary" type="submit" children="Send" />
        </form>
    )
}
