import React, { FC } from 'react'
import { PageProps } from 'gatsby'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'

import { Image } from '../components/Image'
import { LocalizedLink } from '../i18n'

type Props = PageProps<{ locale: string }>

const Query = gql`
  query greet($name: String!) {
    greet(name: $name) {
      timestamp
      message
    }
  }
`

const IndexPage: FC<Props> = () => {
  const { data, error, loading } = useQuery<
    { greet: { message: string } },
    { name: string }
  >(Query, {
    pollInterval: 1000,
    variables: { name: `bill` }
  })
  return (
    <>
      <h1>Hi</h1>
      <p>Welcome to my site.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <h3>
        {error
          ? error.message
          : loading
          ? `loading`
          : data
          ? data.greet.message
          : `not loaded`}
      </h3>
      <LocalizedLink to="/pay" />
    </>
  )
}

export default IndexPage
