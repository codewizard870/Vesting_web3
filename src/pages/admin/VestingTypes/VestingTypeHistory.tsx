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
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'

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
    <div className='w-full'>
      <div className='w-full flex justify-between items-center'>
        <h3>Vesting Type History</h3>

        <SecondaryButtonMD
          width='80px'
          onClick={onBack}
        >
          Back
        </SecondaryButtonMD>
      </div>

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
    </div>
  )
}
