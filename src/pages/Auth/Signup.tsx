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

export const Signup = () => {
  const classes = useStyles();
  const { requestUserSignup } = useSession();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
    } else if (field === 'name') {
      setName(value);
    }

    const error = { ...errors, ...handleValidation(field, value) };
    if (errors.invalidCredentials) {
      delete errors.invalidCredentials;
    }
    setErrors(error);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const error = {
      ...errors,
      ...handleValidation('email', email),
      ...handleValidation('password', password),
      ...handleValidation('name', name),
    };
    const userCredentialsValid =
      Object.keys(error).filter((field) => error[field] !== '').length === 0;
    if (!userCredentialsValid) {
      setErrors(error);
      return;
    } else {
      setLoading(true);
      try {
        const res = await requestUserSignup(email, password, name);
        if (res.errors) {
          setErrors(res.errors);
        } else {
          history.push('/signin');
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <h2>Sign up</h2>
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
      <TextField
        variant="outlined"
        id="name"
        value={name}
        label="Name"
        onChange={handleInputChange}
        error={!!errors.name}
        helperText={errors.name}
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
        Sign up
      </Button>
      <Button
        type="button"
        color="primary"
        variant="contained"
        className={classes.button}
        disabled={loading}
        onClick={() => history.push('/signin')}
      >
        Sign in
      </Button>
    </form>
  );
};
