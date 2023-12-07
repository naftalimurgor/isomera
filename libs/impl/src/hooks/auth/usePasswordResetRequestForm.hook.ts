import { useFormik } from 'formik'

import { useNavigate } from 'react-router-dom'

import { pages } from '../../constants/pages'
import { formikValidate } from '@isomera/dtos'
import { useHandleErrorHook } from '../error/useHandleError.hook'
import { Pure } from '@isomera/interfaces'
import { usePasswordResetRequestHook } from './usePasswordResetRequest.hook'
import { ForgotPasswordResetRequestDto } from '@isomera/dtos'
import { toast } from 'react-toastify'

const initialValues: Pure<ForgotPasswordResetRequestDto> = {
  email: ''
}

export const usePasswordResetRequestForm = () => {
  const { requestReset } = usePasswordResetRequestHook()
  const { handleError } = useHandleErrorHook()
  const navigate = useNavigate()

  const onSubmit = async (values: typeof initialValues) => {
    try {
      await requestReset(values)
      toast.success(
        `If there was such user registered with email ${values.email}, then you'll receive confirmation code.`
      )
      navigate(pages.passwordResetRequestConfirmation.path)
    } catch (error) {
      handleError(error, { view: 'login' })
    }
  }

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    isSubmitting
  } = useFormik({
    initialValues,
    validate: values => formikValidate(ForgotPasswordResetRequestDto, values),
    onSubmit
  })

  return {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    isSubmitting
  }
}
