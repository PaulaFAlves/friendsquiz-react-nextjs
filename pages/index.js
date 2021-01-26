import React, { useState } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import db from '../db.json'
import Widget from '../src/components/Widget'
import QuizBackground from '../src/components/QuizBackground'
import QuizLogo from '../src/components/QuizLogo'
import GitHubCorner from '../src/components/GitHubCorner'
import Footer from '../src/components/Footer'

export const QuizContainer = styled.div`
  width: 100%;
  max-width: 350px;
  padding-top: 45px;
  margin: auto 10%;
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>Quiz dos "Friends"</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            {db.description}
            <form onSubmit={function (e) {
              e.preventDefault()
              router.push(`/quiz?name=${name}`)
            }}>
              <input placeholder="Digite seu nome" onChange={function (e) {
                setName(e.target.value)
              }} />
              <button
                type="submit"
                disabled={name.length === 0}
              >
                {name} clique em mim para
              </button>
            </form>
          </Widget.Content>
        </Widget>
        <Widget>
          <Widget.Header>
            <h2>Quiz da Galera</h2>
          </Widget.Header>
          <Widget.Content>Quizes dos outros</Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/paulafalves" />
    </QuizBackground>
  )
}
