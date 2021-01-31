import React, { useState } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import db from '../db.json'
import Widget from '../src/components/Widget'
import QuizBackground from '../src/components/QuizBackground'
import GitHubCorner from '../src/components/GitHubCorner'
import Input from '../src/components/Input'
import Button from '../src/components/Button'

export const QuizContainer = styled.div`
  width: 100%;
  max-width: 350px;
  padding-top: 45px;
  opacity: .9;
  margin: auto 10%;
  @media screen and (max-width: 500px) {
    margin: auto;
    padding: 15px;
  }
`;

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')
  const names = ['paula', 'leandro', 'carol', 'henrique']

  const checkName = (e) => {
    if (names.includes(e.toLocaleLowerCase())) {
      setName(e)
    } 
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>Amigos mesmo?</title>
      </Head>
      <QuizContainer>
        <Widget>
          <Widget.Header>
            <h1>{db.title}</h1>
          </Widget.Header>
          <Widget.Content>
            <div className="text">
              {db.description}
            </div>
            <form onSubmit={function (e) {
              e.preventDefault()
              router.push({
                pathname: '/quiz',
                query: { name: name }
              })
            }}>
              <Input
                name="nomeDoUsuario"
                placeholder="Digite seu nome"
                onChange={(e) => checkName(e.target.value)}
                value={name}
              />
              <Button
                type="submit"
                disabled={name.length === 0}
                title="texto"
              >
                clique aqui para jogar
              </Button>
            </form>
          </Widget.Content>
        </Widget>
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/paulafalves" />
    </QuizBackground>
  )
}
