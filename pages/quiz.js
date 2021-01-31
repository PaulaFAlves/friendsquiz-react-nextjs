import React, { useState, useEffect } from 'react'
import QuizBackground from '../src/components/QuizBackground'
import db from '../db.json'
import { QuizContainer } from '.'
import Widget from '../src/components/Widget'
import Button from '../src/components/Button'
import AlternativeForm from '../src/components/AlternativeForm'
import { useRouter } from 'next/router'

function ResultWidget({ results, totalQuestions, name }) {
  const res = () => {
    return results.reduce((sum, result) => {
      const isAcerto = result.isCorrect === true
      if (isAcerto) {
        return sum + 1
      }
      return sum
    }, 0)
  }

  const back = () => {
    window.location.href="/"
  }

  return (
    <Widget>
      <Widget.Header>
        A hora da verdade!
      </Widget.Header>

      <Widget.Content>
        <p>
          {`${name[0].toUpperCase() + name.substr(1)}, você acertou ${res()} de ${totalQuestions} perguntas!`}
        </p>
        {
          (res() > 22) ? 
          <div>
            <h1>Baita amigx!</h1>
            <img src="https://media.giphy.com/media/1jkV5ifEE5EENHESRa/giphy.gif" style={{ width: "100%", marginBottom: "15px" }}/>
          </div> 
          : 
          <div>
            <h1>Que bosta de amigx tu é!</h1>
            <img src="https://media.giphy.com/media/bQloCmn3sCDeDbTsl1/giphy.gif" style={{ width: "100%", marginBottom: "15px"  }}/>
          </div>
        }
        <Button
          type="button"
          onClick={back}
        >
          Jogar de novo
        </Button>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
  name
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined)
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false)
  const questionId = `question__${questionIndex}`
  const isCorrect = selectedAlternative === question.answer
  const hasAlternativeSelected = selectedAlternative !== undefined
  return (
    <Widget>
      <Widget.Header>
        <h3>
          {/* <div className="text">
            {`${name}, vamos lá!`}
          </div> */}
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <AlternativeForm
          onSubmit={(e) => {
            e.preventDefault();
            setIsQuestionSubmitted(true)
            setTimeout(() => {
              addResult({
                id: question.id,
                isCorrect,
                question: question.title
              })
              onSubmit()
              setIsQuestionSubmitted(false)
              setSelectedAlternative(undefined)
            }, 3 * 1000)
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR'
            const isSelected = selectedAlternative === alternativeIndex

            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmitted && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmitted && isCorrect && <p>Você acertou, espertinhx!</p>}
          {isQuestionSubmitted && !isCorrect && <p>{`Você errou, mula! Era ${question.alternatives[question.answer]}!`}</p>}
        </AlternativeForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage() {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([])
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const router = useRouter()
  const questionsFiltered = db.questions.filter((question) => question.author.toLowerCase() !== router.query.name.toLowerCase())
  const question = questionsFiltered[questionIndex];
  const totalQuestions = questionsFiltered.length;

  function addResult(result) {
    setResults([
      ...results,
      result
    ])
  }
 
  useEffect(() => {
    setTimeout(() => { setScreenState(screenStates.QUIZ) }, 1000)
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
            name={router.query.name}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} totalQuestions={totalQuestions} name={router.query.name} />}
      </QuizContainer>
    </QuizBackground>
  )
}
