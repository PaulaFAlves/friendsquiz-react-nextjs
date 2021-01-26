import React from 'react'
import QuizBackground from '../src/components/QuizBackground'
import db from '../db.json'
import { QuizContainer } from '.'
import Widget from '../src/components/Widget'

export default function QuizPage() {
  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <Widget>
          <Widget.Header>
            Pergunta
          </Widget.Header>
          <Widget.Content>
            <div>Respostas</div>
            <div>Respostas</div>
            <div>Respostas</div>
            <div>Respostas</div>
            <div>Respostas</div>
          </Widget.Content>
        </Widget>
      </QuizContainer>
    </QuizBackground>
  )
}
