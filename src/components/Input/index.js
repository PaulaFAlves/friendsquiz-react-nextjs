import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const InputBase = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 14px;
  border: 0.5px solid ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.contrastText};
  background-color: ${({ theme }) => theme.colors.mainBg};
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: 0;
  margin-bottom: 25px;
  ::-webkit-input-placeholder {
   color: ${({ theme }) => theme.colors.contrastText};
   opacity: 0.3;
}

`

export default function Input({ onChange, placeholder }) {
  return (
    <div>
      <InputBase
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

Input.prototypes = {
  onChange: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}
