import React, { forwardRef, Fragment, memo, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import { IOrder } from 'interfaces/models/order';
import { tap } from 'rxjs/operators';
import orderService from 'services/order';
import * as yup from 'yup';
import SelectTextField from 'components/Shared/Fields/Select';
import { STATUSES_OPTIONS, BOOLEAN_OPTIONS, CURRENCY_OPTIONS } from './constants';

interface IProps {
  opened: boolean;
  order?: IOrder;
  onComplete: (order: IOrder) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  description: yup.string().required().min(3).max(500),
  quantity: yup.number().required().max(10000),
  amount: yup.number().required(),
  currency: yup.string().required().max(3),
  status: yup.string().required(),
  unitPrice: yup.number().required(),
  discount: yup.string().required(),
  source: yup.string().required().max(30),
  isCompleted: yup.boolean()
});

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  },
  selectMenu: {
    minWidth: '100%'
  }
});

const FormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<IOrder>({
    initialValues: {
      currency: 'BRL',
      quantity: 1,
      status: 'placed' as any,
      source: 'WEB',
      amount: 0,
      unitPrice: 0,
      discount: 0,
      isCompleted: false
    },
    validationSchema,
    onSubmit(model) {
      const data = {
        ...model,
        amount: Math.round(model?.amount * 100),
        discount: Math.round(model?.discount * 100),
        unitPrice: Math.round(model?.unitPrice * 100),
        quantity: parseInt(model.quantity as any) || 1
      };
      return orderService.save(data).pipe(
        tap(order => {
          Toast.show(`seu pedido com ID ${order?.id} foi salvo com sucesso `);
          props.onComplete(order);
        }),
        logError(true)
      );
    }
  });

  const handleEnter = useCallback(() => {
    if (props.order) {
      props.order.amount = props.order.amount / 100;
      props.order.discount = props.order.discount / 100;
      props.order.unitPrice = props.order.unitPrice / 100;
      props.order.quantity = props.order.quantity || 0;
    }
    formik.setValues(props.order ?? formik.initialValues, false);
  }, [formik, props.order]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{formik.values.id ? 'Editar' : 'Novo'} Pedido</DialogTitle>
        <DialogContent className={classes.content}>
          <Fragment>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth label='Descrição do Pedido' name='description' formik={formik} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label='Quantidade' name='quantity' formik={formik} />
              </Grid>
              <Grid item xs={12}>
                <SelectTextField
                  className={classes.selectMenu}
                  margin='normal'
                  items={CURRENCY_OPTIONS}
                  label='Moeda'
                  name='currency'
                  formik={formik}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Valor Unitário' mask='money' name='unitPrice' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth mask='money' label='Valor Total' name='amount' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Valor Desconto' mask='money' name='discount' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectTextField
                  fullWidth
                  className={classes.selectMenu}
                  margin='normal'
                  items={STATUSES_OPTIONS}
                  label='Status'
                  name='status'
                  formik={formik}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label='Origem' name='source' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectTextField
                  name='isCompleted'
                  fullWidth
                  className={classes.selectMenu}
                  margin='normal'
                  items={BOOLEAN_OPTIONS}
                  label='Pedido Finalizado'
                  formik={formik}
                />
              </Grid>
            </Grid>
          </Fragment>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: SlideProps, ref: React.Ref<React.ExoticComponent>) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
