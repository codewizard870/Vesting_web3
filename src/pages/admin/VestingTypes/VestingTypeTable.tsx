/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
import { VestingType, VF_LIST } from 'types';
import { formatTime } from 'utils';
import { AddVestingType } from './AddVestingType';

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
  handleEdit: () => void
}

const TypeItem: React.FC<ITypeItem> = ({ info, handleEdit }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <TableRow key={info.typeId}>
      <TableCell>{info.typeId}</TableCell>
      <TableCell>{info.name}</TableCell>
      <TableCell>{new Date(info.startTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{new Date(info.endTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{formatTime(info.lockupDuration)}</TableCell>
      <TableCell>{VF_LIST[info.vestingFrequencyId].label}</TableCell>
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
  const [isOpenAddType, setIsOpenAddType] = useState(false)
  const [isEditType, setIsEditType] = useState(false)
  const [editTypeId, setEditTypeId] = useState(0)

  const handleOpenAddType = () => {
    setIsOpenAddType(true)
  }

  const handleCloseAddType = () => {
    setIsOpenAddType(false)
  }

  const handleEdit = (id: number) => {
    setEditTypeId(id)
    setIsEditType(true)
    handleOpenAddType()
  }

  return (
    <Card className={classes.root}>
      <Box className={classes.flex}>
        <h3>Vesting Types</h3>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => {
            setIsEditType(false)
            handleOpenAddType()
          }}
        >
          Add Vesting Type
        </Button>
      </Box>

      <AddVestingType handleClose={handleCloseAddType} isOpen={isOpenAddType} edit={isEditType} id={editTypeId} />

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
              <b>Vesting Frequency</b>
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
            <TypeItem info={info} key={index} handleEdit={() => handleEdit(info.typeId)} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
