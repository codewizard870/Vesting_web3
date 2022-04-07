import React, { useState } from 'react';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { useSession } from 'contexts';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '1rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: 400,
    margin: '0.5rem',
  },
  button: {
    width: 400,
    margin: '0.5rem',
  },
}));

interface IError {
  [field: string]: string;
}

export const Signin = () => {
  const classes = useStyles();
  const { requestUserSignin } = useSession();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<IError>({});
  const [loading, setLoading] = useState(false);

  const handleValidation = (field: string, value: Maybe<string>) => {
    const error: IError = {};
    error[field] = value ? '' : 'This field is required';
    return error;
  };

  const handleInputChange = (e: any) => {
    const field = e.target.id;
    const value = e.target.value;

    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }

    // const error = { ...errors, ...handleValidation(field, value) };
    // if (errors.invalidCredentials) {
    //   delete errors.invalidCredentials;
    // }
    // setErrors(error);
    setErrors({})
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const error = {
      ...errors,
      ...handleValidation('email', email),
      ...handleValidation('password', password),
    };
    const userCredentialsValid =
      Object.keys(error).filter((field) => error[field] !== '').length === 0;
    if (!userCredentialsValid) {
      setErrors(error);
      return;
    } else {
      setLoading(true);
      try {
        const res = await requestUserSignin(email, password);
        if (res.errors) {
          setErrors(res.errors);
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <TextField
        variant="outlined"
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={handleInputChange}
        error={!!errors.email || !!errors.invalidCredentials}
        helperText={errors.email || errors.invalidCredentials}
        className={classes.input}
        disabled={loading}
      />
      <TextField
        variant="outlined"
        id="password"
        type="password"
        label="Password"
        value={password}
        onChange={handleInputChange}
        error={!!errors.password}
        helperText={errors.password}
        className={classes.input}
        disabled={loading}
      />
      <br />
      <Button
        type="submit"
        color="primary"
        variant="contained"
        className={classes.button}
        disabled={loading}
      >
        Sign in
      </Button>
      <Button
        type="button"
        color="primary"
        variant="contained"
        className={classes.button}
        disabled={loading}
        onClick={() => history.push('/signup')}
      >
        Sign up
      </Button>
    </form>
  );
};
