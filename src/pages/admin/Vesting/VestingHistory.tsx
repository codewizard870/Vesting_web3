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
import { VestingEvent } from 'types'
import { formatEther } from 'utils'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'

interface IHistoryItem {
  event: VestingEvent
}

const HistoryItem: React.FC<IHistoryItem> = ({ event }) => {
  const { eventTopics } = useVesting()

  return (
    <TableRow>
      <TableCell>{eventTopics[event.topic] || 'Undefined'}</TableCell>
      <TableCell>{formatEther(BigNumber.from(event.amount), undefined, 3, true)}</TableCell>
      <TableCell>{new Date(event.timestamp * 1000).toLocaleString()}</TableCell>
    </TableRow>
  )
}

interface IVestingHistory {
  typeId: number
  vestingId: number
  address: string
  onBack: () => void
}

export const VestingHistory: React.FC<IVestingHistory> = ({
  typeId,
  vestingId,
  address,
  onBack,
}) => {
  const { getEvents } = useVesting()

  const [eventList, setEventList] = useState<VestingEvent[]>([])

  useEffect(() => {
    const updateEventList = async () => {
      const res = await getEvents(typeId, vestingId, address)
      setEventList(res)
    }

    updateEventList()
  }, [typeId, vestingId, address])

  return (
    <div className='w-full'>
      <div className='w-full flex justify-between items-center'>
        <h3>Vesting History</h3>

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
              <b>Amount</b>
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
