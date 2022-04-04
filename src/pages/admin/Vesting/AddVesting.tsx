/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogContent
} from '@material-ui/core';
import { useVesting } from 'contexts';
import { VestingInfo } from 'types';

const useStyles = makeStyles(() => ({
  root: {
    width: 500,
    margin: '1rem',
    padding: '1rem',
    boxSizing: 'border-box',
    border: '1px solid black',
    borderRadius: 8,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  row: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0.5rem',
  },
  input: {
    width: '100%',
  },
}));

interface IAddVesting {
  isOpen: boolean
  handleClose: () => void
  edit: boolean;
  info: Maybe<VestingInfo>;
}

export const AddVesting: React.FC<IAddVesting> = ({ isOpen, handleClose, edit, info }) => {
  const classes = useStyles();
  const { addVesting, updateVesting, vestingTypes } = useVesting();

  const [typeId, setTypeId] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit && info) {
      setRecipient(info.recipient);
      setValue(info.amount.toString());
    }
  }, [edit, info, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTypeId(0);
      setRecipient('');
      setValue('');
      setLoading(false);
    }
  }, [isOpen])

  const handleSubmit = async () => {
    setLoading(true);
    let res = false;
    if (edit) {
      if (info) {
        res = await updateVesting(info.vestingId, recipient, Number(value));
      }
    } else {
      res = await addVesting(typeId, recipient, Number(value));
    }
    setLoading(false);

    if (res) {
      handleClose()
    }
  };

  const validAmount = () => {
    if (vestingTypes.length > 0 && !isNaN(Number(value))) {
      return (
        Number(value) <=
        vestingTypes[typeId].maxAmount - vestingTypes[typeId].vestedAmount
      );
    }
    return false;
  };

  return (
    <div>
      <Dialog
        onClose={() => loading ? () => { } : handleClose()}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogContent>
          <Box className={clsx(classes.root, classes.flex)}>
            <Typography variant="h5">{edit ? 'Edit' : 'Add'} User Vesting</Typography>
            <br />

            {edit && info ? (
              <Box className={classes.row}>
                <Typography>
                  Type:{' '}
                  <b>
                    {vestingTypes.length > typeId ? vestingTypes[typeId].name : ''}
                  </b>
                </Typography>
              </Box>
            ) : (
              <FormControl className={classes.row}>
                <InputLabel id="vesting-type-label1">Type</InputLabel>
                <Select
                  labelId="vesting-type-label1"
                  value={typeId}
                  label="Vesting Type"
                  style={{ width: '100%' }}
                  onChange={(e) => setTypeId(Number(e.target.value))}
                >
                  {vestingTypes.map((type) => (
                    <MenuItem value={type.typeId} key={type.typeId}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box className={classes.row}>
              <TextField
                variant="outlined"
                label="User Wallet"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={loading}
                className={classes.input}
              />
            </Box>

            <Box className={classes.row}>
              <TextField
                variant="outlined"
                type="number"
                label="Amount"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
                className={classes.input}
              />
            </Box>

            <Box className={classes.row}>
              <Button
                color="primary"
                variant="contained"
                disabled={loading || !validAmount()}
                className={classes.input}
                onClick={handleSubmit}
              >
                {loading ? 'Confirming' : 'Confirm'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};
