import Trivia from "./Trivia"
import { useState } from "react"

export default function App() {
    const [quizStarted, setQuizStarted] = useState(false)

    return (
        <main>
            { quizStarted ?
            <Trivia /> :
                <div className="start">
                    <h1>Quizzical</h1>
                    <p>Test your knowladge</p>
                    <button onClick={() => setQuizStarted(true)}>Start Quiz</button>
                </div>}
        </main>
    )
}
