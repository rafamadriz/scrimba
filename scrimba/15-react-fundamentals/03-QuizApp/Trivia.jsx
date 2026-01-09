import { useEffect, useState } from "react"
import { decode } from "html-entities"

const getTrivia = async () => {
    const api = "https://opentdb.com/api.php?amount=5&category=21"
    try {
        const response = await fetch(api)
        if (!response.ok) {
            throw new Error (`Response status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (err) {
        console.error(err)
    }
}

const Options = (options, id) => {
    const optionsEls = options.map(option => {
        return (
                <label className={`option`}><input type="radio" name={id} value={option} required /><span>{option}</span></label>
        )
    })
    return (
        <>
            {optionsEls}
        </>
    )
}

const Question = (question, options, id) => {
    return (
        <>
            <fieldset className="question">
                <legend>{decode(question)}</legend>
                {Options(options, id)}
            </fieldset>
            <hr />
        </>
    )
}

const checkAnswers = (event, trivia, setCorrectCount, setGameOver) => {
    event.preventDefault()
    setGameOver(true)

    const data = new FormData(event.target)
    const entries = Object.fromEntries(data)

    for (const [i, answer] of Object.entries(entries)) {
        const correct_answer = decode(trivia.results[i].correct_answer)
        const input = document.querySelector(`input[name="${i}"]:checked`)

        const allInputs = document.querySelectorAll(`input[name="${i}"]`)
        for (const input of allInputs) {
            input.parentElement.classList.add("answered")
            input.disabled = true
        }

        if (correct_answer === answer) {
            setCorrectCount(count => count + 1)
            input.parentElement.classList.add("correct")
        } else {
            input.parentElement.classList.add("incorrect")
        }
    }
}

const playAgain = (setGameOver, setTrivia, setCorrectCount, setShuffledOptions) => {
    getTrivia().then(data => {
        setTrivia(data)
        const shuffled = data.results.map(q => {
            const randomIndex = Math.floor(Math.random() * (q.incorrect_answers.length + 1))
            return [
                ...q.incorrect_answers.slice(0, randomIndex),
                q.correct_answer,
                ...q.incorrect_answers.slice(randomIndex)
            ].map(option => decode(option))
        })
        setShuffledOptions(shuffled)
    })
    setGameOver(false)
    setCorrectCount(0)

    const allInputs = document.querySelectorAll("input")
    for (const input of allInputs) {
        input.parentElement.classList.remove("answered")
        input.parentElement.classList.remove("correct")
        input.parentElement.classList.remove("incorrect")
        input.disabled = false
        input.checked = false
    }
}

const finalMessage = (count, setGameOver, setTrivia, setCorrectCount, setShuffledOptions) => {
    return (
        <>
            <p className="score">You scored {count}/5 correct answers</p> 
            <button className="playAgain" onClick={() => playAgain(setGameOver, setTrivia, setCorrectCount, setShuffledOptions)}>Play Again</button>
        </>
    )
}

export default function Trivia() {
    const [trivia, setTrivia] = useState(null)
    const [correctCount, setCorrectCount] = useState(0)
    const [gameOver, setGameOver] = useState(null)
    const [shuffledOptions, setShuffledOptions] = useState([])

    useEffect(() => {
        getTrivia().then(data => {
            setTrivia(data)
            const shuffled = data.results.map(q => {
                const randomIndex = Math.floor(Math.random() * (q.incorrect_answers.length + 1))
                return [
                    ...q.incorrect_answers.slice(0, randomIndex),
                    q.correct_answer,
                    ...q.incorrect_answers.slice(randomIndex)
                ].map(option => decode(option))
            })
            setShuffledOptions(shuffled)
        })
    }, [])

    if (!trivia) return

    console.log(trivia.results)

    const questions = []
    trivia.results.forEach((question, i) => {
        questions.push(Question(question.question, shuffledOptions[i], i))
    })

    return (
        <>
            <form onSubmit={() => checkAnswers(event, trivia, setCorrectCount, setGameOver)}>
                {questions}
                <div className="final">
                        {gameOver ? finalMessage(correctCount, setGameOver, setTrivia, setCorrectCount, setShuffledOptions) : <button className="check">Check answers</button>}
                </div>
            </form>
        </>
    )
}
