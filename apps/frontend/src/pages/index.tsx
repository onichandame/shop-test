import React, { FC } from 'react'
import { PageProps } from 'gatsby'
import { Grid } from '@material-ui/core'

import { useTranslation, LocalizedLink } from '../i18n'
import { SEO } from '../components'

type Props = PageProps<{ locale: string }>

const IndexPage: FC<Props> = () => {
  const { home } = useTranslation()
  return (
    <div>
      <SEO title={home} />
      <Grid container direction="column">
        <Grid item>
          <LocalizedLink to="/pay">pay</LocalizedLink>
        </Grid>
        <Grid item>
          <LocalizedLink to="/bill">bills</LocalizedLink>
        </Grid>
      </Grid>
    </div>
  )
}

export default IndexPage
