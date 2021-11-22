/* eslint-disable no-restricted-imports */
import MenuItem from '@material-ui/core/MenuItem';
import TextFieldCore, { TextFieldProps } from '@material-ui/core/TextField';
import { FormikInstance } from 'hooks/useFormikObservable';
import { Masks } from 'hooks/useMask';
import React, { memo } from 'react';

type IProps = TextFieldProps & {
  name: string;
  loading?: boolean;
  mask?: Masks;
  formik?: FormikInstance;
  items: any;
};

const SelectTextField = memo<IProps>(({ formik, value, name, items, ...props }) => {
  value = formik ? formik.values[name] : value;
  const hasError = formik && (formik.touched[name] || formik.submitCount > 0) && !!formik.errors[name];

  return (
    <TextFieldCore
      select
      error={hasError}
      {...props}
      disabled={formik?.isSubmitting || props.disabled}
      helperText={hasError ? formik.errors[name] : props.helperText}
      name={name}
      value={value}
      // onChange={handleChange}
      onChange={formik.handleChange}
    >
      {items?.map((option: any) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextFieldCore>
  );
});

export default SelectTextField;
