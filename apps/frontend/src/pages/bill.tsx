import React, { FC } from 'react'
import { useFormik } from 'formik'
import { object, date } from 'yup'
import { gql, useQuery } from '@apollo/client'
import { Button, TextField } from '@material-ui/core'
import { useSnackbar } from 'notistack'

import { SEO } from '../components'
import { useTranslation } from '../i18n'
import { formatDate } from '../utils'

const schema = object()
  .defined()
  .shape({
    date: date()
      .defined()
      .default(new Date(`2020-11-05`))
  })

const BillQuery = gql`
  query bill($date: String!) {
    bill(date: $date) {
      billUrl
    }
  }
`

const BillPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { bill } = useTranslation()
  const { refetch } = useQuery<{ bill: { billUrl: string } }, { date: string }>(
    BillQuery,
    { skip: true }
  )
  const formik = useFormik({
    initialValues: schema.default(),
    validationSchema: schema,
    onSubmit: async values => {
      try {
        enqueueSnackbar(`querying Alipay bills`)

        const res = await refetch({ date: formatDate(values.date) })
        if (res.error) throw res.error
        if (!res.data) throw new Error(`query result is empty`)
        const billUrl = res.data.bill.billUrl
        console.log(billUrl)
        enqueueSnackbar(`bill created. download it in 30 seconds`)
        window.open(billUrl)
      } catch (e) {
        enqueueSnackbar(`querying failed`)
        throw e
      }
    }
  })
  return (
    <div>
      <SEO title={bill} />
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <TextField type="date" name="date" label="date" />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </div>
  )
}

export default BillPage
