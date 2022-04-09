/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useVesting } from 'contexts';
import { VestingInfo } from 'types';
import { AddVesting } from './AddVesting';
import { VestingHistory } from './VestingHistory';

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
    height: 40,
    marginRight: 8,
  },
}));

interface IVestingItem {
  index: number;
  info: VestingInfo;
  onAdd: (edit: boolean, info: Maybe<VestingInfo>) => void;
  onHistory: (info: Maybe<VestingInfo>) => void;
}

const VestingItem: React.FC<IVestingItem> = ({
  index,
  info,
  onAdd,
  onHistory,
}) => {
  const classes = useStyles();
  const { vestingTypes } = useVesting();

  return (
    <TableRow key={info.vestingId}>
      <TableCell>{index}</TableCell>
      <TableCell>{vestingTypes[info.typeId].name}</TableCell>
      <TableCell>{info.recipient}</TableCell>
      <TableCell>{info.amount.toLocaleString()} FLD</TableCell>
      <TableCell>
        {Math.round(info.claimedAmount).toLocaleString()} FLD
      </TableCell>
      <TableCell
        className={classes.flex}
        style={{ justifyContent: 'flex-start' }}
      >
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => onAdd(true, info)}
        >
          Edit
        </Button>

        {/* <Button
          color="primary"
          variant="outlined"
          className={classes.button}
          onClick={() => onHistory(info)}
        >
          History
        </Button> */}
      </TableCell>
    </TableRow>
  );
};

export const VestingTable = () => {
  const classes = useStyles();
  const { vestingTypes, vestingList } = useVesting();

  const [typeId, setTypeId] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);  
  const [isEdit, setEdit] = useState(false);
  const [activeInfo, setActiveInfo] = useState<Maybe<VestingInfo>>(null);
  const [isOpenAddVesting, setIsOpenAddVesting] = useState(false)

  useEffect(() => {
    if (typeId >= vestingTypes.length) {
      setTypeId(-1);
    }
  }, [vestingTypes]);

  const handleOpenAddVesting = () => {
    setIsOpenAddVesting(true)
  }

  const handleCloseAddVesting = () => {
    setIsOpenAddVesting(false)
  }

  const handleAdd = (edit: boolean, info: Maybe<VestingInfo>) => {
    setEdit(edit);
    setActiveInfo(info);
    handleOpenAddVesting()
  };

  const handleHistory = (info: Maybe<VestingInfo>) => {
    setActiveInfo(info);
    setShowHistory(true);
  };

  return showHistory ? (
    <VestingHistory
      typeId={typeId}
      vestingId={activeInfo?.vestingId || 0}
      onBack={() => setShowHistory(false)}
    />
  ) : (
    <Card className={classes.root}>
      <AddVesting
        isOpen={isOpenAddVesting}
        handleClose={handleCloseAddVesting}
        edit={isEdit}
        info={activeInfo}
      />
      <Box className={classes.flex}>
        <FormControl style={{ width: 200 }}>
          <InputLabel id="vesting-type-label">Vesting Type</InputLabel>
          <Select
            labelId="vesting-type-label"
            value={typeId}
            label="Vesting Type"
            onChange={(e) => setTypeId(Number(e.target.value))}
          >
            <MenuItem value={-1}>All</MenuItem>
            {vestingTypes.map((info) => (
              <MenuItem value={info.typeId} key={info.typeId}>
                {info.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={() => handleAdd(false, null)}
        >
          Add Client
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>ID</b>
            </TableCell>
            <TableCell>
              <b>Type</b>
            </TableCell>
            <TableCell>
              <b>User Wallet</b>
            </TableCell>
            <TableCell>
              <b>Total</b>
            </TableCell>
            <TableCell>
              <b>Claimed</b>
            </TableCell>
            <TableCell>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {vestingList
            .filter(
              (item) =>
                (typeId === -1 || item.typeId === typeId) && item.amount > 0
            )
            .map((info, index) => (
              <VestingItem
                index={index}
                info={info}
                onAdd={handleAdd}
                onHistory={handleHistory}
                key={index}
              />
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};
