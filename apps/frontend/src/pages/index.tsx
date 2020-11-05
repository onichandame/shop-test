import React, { FC } from 'react'
import { PageProps } from 'gatsby'

import { LocalizedLink } from '../i18n'
import { SEO } from '../components'

type Props = PageProps<{ locale: string }>

const IndexPage: FC<Props> = () => {
  return (
    <>
      <SEO title="home" />
      <LocalizedLink to="/pay">pay</LocalizedLink>
    </>
  )
}

export default IndexPage
