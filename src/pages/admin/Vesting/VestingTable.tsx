/* eslint-disable react-hooks/exhaustive-deps */
import React, { MouseEvent, ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
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
import { VestingInfo, IWalletList, IUpdateVestingList } from 'types';
import { AddVesting } from './AddVesting';
import { VestingHistory } from './VestingHistory';
import { formatEther, parseEther } from 'utils';

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
  buttonUploadFile: {
    marginRight: 8
  },
  buttonList: {
    display: 'flex'
  }
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
      <TableCell>{formatEther(info.amount, undefined, 3, true)} FLD</TableCell>
      <TableCell>
        {formatEther(info.claimedAmount, undefined, 3, true)} FLD
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
  const { vestingTypes, vestingList, addUpdateMutiVesting } = useVesting();

  const [typeId, setTypeId] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);  
  const [isEdit, setEdit] = useState(false);
  const [activeInfo, setActiveInfo] = useState<Maybe<VestingInfo>>(null);
  const [isOpenAddVesting, setIsOpenAddVesting] = useState(false)
  const [file, setFile] = useState<FileList | null>();

  const fileReader = new FileReader()

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

  const csvFileToArray = (data: string) => {
    const csvRows = data.slice(data.indexOf("\n") + 1).split("\n");
    
    const array = csvRows.map(i => {
      const values = i.replaceAll('\r', '').split(",");
      const obj: IWalletList = {
        typeId: '',
        recipient: '',
        amount: parseEther('0', undefined)
      };
      if (values.length === 3) {
        obj['typeId'] = values[0]
        obj['recipient'] = values[1]
        obj['amount'] = parseEther(values[2], undefined)
      }

      return obj;
    });

    let _addVestingList: IWalletList[] = [], _updateVestingList: IUpdateVestingList[] = []
    array.map((d, i) => {
      const index = vestingList.findIndex(v => v.typeId === parseInt(d.typeId) && v.recipient === d.recipient)
      if (index < 0) {
        if (d.recipient.length > 0)
          _addVestingList.push(d)
      } else {
        _updateVestingList.push({
          vestingId: `${vestingList[i].vestingId}`,
          recipient: d.recipient,
          amount: d.amount
        })
      }
    })

    addUpdateMutiVesting(_addVestingList, _updateVestingList)
  };

  const handleOnUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const target = (e.target as HTMLInputElement).files;
    setFile(target);
  }

  const handleOnSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event: any) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput)
      };

      fileReader.readAsText(file[0]);
    }
  }

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

        <Box className={classes.buttonList}>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={() => handleAdd(false, null)}
          >
            Add Client
          </Button>
          <div>
            <input accept=".csv" id="file" type="file" hidden
              onChange={handleOnUpload} />
            <label htmlFor="file">
              <Button variant="contained" component="span" className={classes.buttonUploadFile} onClick={(e: MouseEvent<HTMLButtonElement>) => {e.stopPropagation()}}>
                Upload
              </Button>
            </label>
          </div>
          <div>
            <Button
              variant="contained"
              onClick={handleOnSubmit}
            >
              Import
            </Button>
          </div>
        </Box>
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
                (typeId === -1 || item.typeId === typeId) && item.amount.gt(0)
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
