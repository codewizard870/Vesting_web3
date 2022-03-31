/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Box,
  Button,
  Card,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useVesting } from 'contexts';
import { useHistory } from 'react-router-dom';
import { VestingType } from 'types';
import { formatTime } from 'utils';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
  },
}));

interface ITypeItem {
  info: VestingType;
}

const TypeItem: React.FC<ITypeItem> = ({ info }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleEdit = async () => {
    history.push(`/admin/vesting_type/edit/${info.typeId}`);
  };

  return (
    <TableRow key={info.typeId}>
      <TableCell>{info.typeId}</TableCell>
      <TableCell>{info.name}</TableCell>
      <TableCell>{new Date(info.startTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{new Date(info.endTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{formatTime(info.lockupDuration)}</TableCell>
      <TableCell>{info.maxAmount.toLocaleString()} FLD</TableCell>
      <TableCell>{info.vestedAmount.toLocaleString()} FLD</TableCell>
      <TableCell
        className={classes.flex}
        style={{ justifyContent: 'flex-start' }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleEdit}
          style={{ marginRight: 8 }}
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const VestingTypeTable = () => {
  const classes = useStyles();
  const history = useHistory();
  const { vestingTypes } = useVesting();

  return (
    <Card className={classes.root}>
      <Box className={classes.flex}>
        <h3>Vesting Types</h3>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => {
            history.push('/admin/vesting_type/add');
          }}
        >
          Add Vesting Type
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>
              <b>Start Time</b>
            </TableCell>
            <TableCell>
              <b>End Time</b>
            </TableCell>
            <TableCell>
              <b>Lockup Period</b>
            </TableCell>
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell>
              <b>Sold</b>
            </TableCell>
            <TableCell>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {vestingTypes.map((info, index) => (
            <TypeItem info={info} key={index} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
