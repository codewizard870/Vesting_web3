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
import { VestingEvent } from 'types';

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

interface IHistoryItem {
  event: VestingEvent;
}

const HistoryItem: React.FC<IHistoryItem> = ({ event }) => {
  const { eventTopics } = useVesting();

  return (
    <TableRow>
      <TableCell>{eventTopics[event.topic] || 'Undefined'}</TableCell>
      <TableCell>{new Date(event.timestamp * 1000).toLocaleString()}</TableCell>
    </TableRow>
  );
};

interface IVestingHistory {
  typeId: number;
  vestingId: number;
  address: string;
  onBack: () => void;
}

export const VestingHistory: React.FC<IVestingHistory> = ({
  typeId,
  vestingId,
  address,
  onBack,
}) => {
  const classes = useStyles();
  const { getEvents } = useVesting();

  const [eventList, setEventList] = useState<VestingEvent[]>([]);

  useEffect(() => {
    const updateEventList = async () => {
      const res = await getEvents(typeId, vestingId, address);
      setEventList(res);
    };

    updateEventList();
  }, [typeId, vestingId, address]);

  return (
    <Card className={classes.root}>
      <Box className={classes.flex}>
        <h3>Vesting History</h3>

        <Button
          color="primary"
          variant="outlined"
          className={classes.button}
          onClick={onBack}
        >
          Back
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Action</b>
            </TableCell>
            <TableCell>
              <b>Time</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {eventList.map((event, index) => (
            <HistoryItem event={event} key={index} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
