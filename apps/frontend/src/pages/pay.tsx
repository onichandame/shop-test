import React, { FC } from 'react'
import { gql, useMutation } from '@apollo/client'
import { PageProps } from 'gatsby'
import { useFormik } from 'formik'
import { object, number, string } from 'yup'
import { useSnackbar } from 'notistack'
import { TextField, Button } from '@material-ui/core'

import { SEO } from '../components'

const PaySchema = gql`
  mutation pay($totalAmount: Float!, $subject: String!) {
    pay(totalAmount: $totalAmount, subject: $subject) {
      payUrl
    }
  }
`

const schema = object()
  .shape({
    totalAmount: number()
      .defined()
      .default(1)
      .positive(),
    subject: string()
      .defined()
      .default(``)
  })
  .defined()

const Pay: FC<PageProps> = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [submitPay] = useMutation<
    { pay: { payUrl: string } },
    { totalAmount: number; subject: string }
  >(PaySchema)
  const formik = useFormik({
    validationSchema: schema,
    initialValues: schema.default(),
    onSubmit: async values => {
      try {
        const res = await submitPay({ variables: values })
        if (res.errors || !res.data) {
          enqueueSnackbar(`payment failed in creation. double check the input.`)
          return
        }
        const redirectUrl = res.data.pay.payUrl
        if (redirectUrl) {
          enqueueSnackbar(`payment created. please complete the payment.`)
          console.log(redirectUrl)
          window.open(redirectUrl)
        } else {
          enqueueSnackbar(
            `payment created. but the payment url was not received.`
          )
        }
      } catch (e) {
        enqueueSnackbar(`payment submit failed`)
        throw e
      }
    }
  })
  return (
    <>
      <SEO title="pay" />
      <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <TextField
          required
          type="number"
          name="totalAmount"
          label="totalAmount"
          value={formik.values.totalAmount}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.totalAmount}
          helperText={formik.errors.totalAmount}
        />
        <TextField
          type="text"
          name="subject"
          label="subject"
          value={formik.values.subject}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={!!formik.errors.subject}
          helperText={formik.errors.subject}
        />
        <Button type="submit" variant="contained" color="primary">
          submit
        </Button>
        <Button type="reset" variant="contained" color="secondary">
          reset
        </Button>
      </form>
    </>
  )
}

export default Pay
