import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, AppBar, Toolbar } from '@material-ui/core'

import { Lang } from './Lang'
import { LocalizedLink } from '../../i18n/LocalizedLink'
import { useTranslation } from '../../i18n'

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    flexGrow: 1
  }
}))
export const Header: FC = () => {
  const styles = useStyles()
  const { home } = useTranslation()
  return (
    <AppBar position="static">
      <Toolbar>
        <LocalizedLink className={styles.title} to="/">
          <Typography variant="h6">{home}</Typography>
        </LocalizedLink>
        <Lang />
      </Toolbar>
    </AppBar>
  )
}
