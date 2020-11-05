import React, { FC } from 'react'
import { PageProps } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'

import { LocaleContext } from '../../i18n'
import { Header } from './Header'
import { Footer } from './Footer'

type Props = PageProps<{}, { locale: string }>

const useStyles = makeStyles(theme => ({
  main: { margin: `0 auto`, maxWidth: 960, padding: theme.spacing[2] }
}))

export const Layout: FC<Props> = ({ children, pageContext: { locale } }) => {
  const styles = useStyles()
  return (
    <LocaleContext.Provider value={locale}>
      <Header />
      <div className={styles.main}>
        <main>{children}</main>
        <Footer />
      </div>
    </LocaleContext.Provider>
  )
}
