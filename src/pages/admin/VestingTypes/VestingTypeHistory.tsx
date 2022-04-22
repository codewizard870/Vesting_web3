/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
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
} from '@material-ui/core'
import { useVesting } from 'contexts'
import { VestingTypeEvent, VF_LIST } from 'types'
import { formatEther, formatTime } from 'utils'

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
}))

interface IHistoryItem {
  event: VestingTypeEvent
}

const HistoryItem: React.FC<IHistoryItem> = ({ event }) => {
  const { eventTopics } = useVesting()

  return (
    <TableRow>
      <TableCell>{eventTopics[event.topic] || 'Undefined'}</TableCell>
      <TableCell>{event.data.name}</TableCell>
      <TableCell>{new Date(event.data.startTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{new Date(event.data.endTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{formatTime(event.data.lockupDuration)}</TableCell>
      <TableCell>{VF_LIST[event.data.vestingFrequencyId].label}</TableCell>
      <TableCell>{formatEther(BigNumber.from(event.data.maxAmount), undefined, 3, true)}</TableCell>
      <TableCell>{new Date(event.timestamp * 1000).toLocaleString()}</TableCell>
    </TableRow>
  )
}

interface IVestingTypeHistory {
  typeId: number
  onBack: () => void
}

export const VestingTypeHistory: React.FC<IVestingTypeHistory> = ({
  typeId,
  onBack,
}) => {
  const classes = useStyles()
  const { getTypeEvents } = useVesting()

  const [eventList, setEventList] = useState<VestingTypeEvent[]>([])

  useEffect(() => {
    const updateEventList = async () => {
      const res = await getTypeEvents(typeId)
      setEventList(res)
    }

    updateEventList()
  }, [typeId])

  return (
    <Card className={classes.root}>
      <Box className={classes.flex}>
        <h3>Vesting Type History</h3>

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
  )
}
