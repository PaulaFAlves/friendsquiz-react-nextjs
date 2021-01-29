import React, { useState, useEffect } from 'react'
import QuizBackground from '../src/components/QuizBackground'
import db from '../db.json'
import { QuizContainer } from '.'
import Widget from '../src/components/Widget'
import Button from '../src/components/Button'
import AlternativeForm from '../src/components/AlternativeForm'
import { useRouter } from 'next/router'

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Tela de resultado
      </Widget.Header>

      <Widget.Content>
        <p>
          Você acertou
          {' '}
          {results.reduce((sum, result) => {
            const isAcerto = result.isCorrect === true
            if (isAcerto) {
              return sum + 1
            }
            return sum
          }, 0)}
          {' '}
        perguntas
        </p>
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <p>{`${result.id}. ${result.question}`}</p>
              <p>{result.isCorrect === true ? 'Acertou' : 'Errou'}</p>
            </li>
          ))}
        </ul>
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
          <div className="text">
            {`${name}, vamos lá!`}
          </div>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

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
          {isQuestionSubmitted && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmitted && !isCorrect && <p>Você errou!</p>}
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
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  const router = useRouter()

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

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  )
}
