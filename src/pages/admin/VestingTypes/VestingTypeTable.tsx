/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
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
import { useHistory } from 'react-router-dom'
import { VestingType, VF_LIST } from 'types'
import { formatTime, formatEther } from 'utils'
import { AddVestingType } from './AddVestingType'
import { VestingTypeHistory } from './VestingTypeHistory'
import { PrimaryButtonMD } from 'components/PrimaryButtonMD'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'

interface ITypeItem {
  index: number
  info: VestingType
  handleEdit: () => void,
  handleHistory: () => void
}

const TypeItem: React.FC<ITypeItem> = ({ index, info, handleEdit, handleHistory }) => {
  const history = useHistory()

  return (
    <TableRow key={info.typeId}>
      <TableCell>{(index + 1)}</TableCell>
      <TableCell>{info.name}</TableCell>
      <TableCell>{new Date(info.startTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{new Date(info.endTime * 1000).toLocaleString()}</TableCell>
      <TableCell>{formatTime(info.lockupDuration)}</TableCell>
      <TableCell>{VF_LIST[info.vestingFrequencyId].label}</TableCell>
      <TableCell>{formatEther(info.maxAmount, undefined, 3, true)} FLD</TableCell>
      <TableCell>{formatEther(info.vestedAmount, undefined, 3, true)} FLD</TableCell>
      <TableCell
        className='flex justify-between items-center'
        style={{ justifyContent: 'flex-start' }}
      >
        <PrimaryButtonMD
          width='80px'
          onClick={handleEdit}
        >
          Edit
        </PrimaryButtonMD>
        <SecondaryButtonMD        
          onClick={handleHistory}
        >
          History
        </SecondaryButtonMD>
      </TableCell>
    </TableRow>
  )
}

export const VestingTypeTable = () => {
  const history = useHistory()
  const { vestingTypes } = useVesting()
  const [isOpenAddType, setIsOpenAddType] = useState(false)
  const [isEditType, setIsEditType] = useState(false)
  const [editTypeId, setEditTypeId] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [activeInfo, setActiveInfo] = useState<Maybe<VestingType>>(null)

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

  const handleHistory = (id: number) => {
    setEditTypeId(id)
    setShowHistory(true)
  }

  return (
    <div className='w-full'>
      {showHistory ?
        <VestingTypeHistory
          typeId={editTypeId || 0}
          onBack={() => setShowHistory(false)}
        />
        :
        <div className='w-full'>
          <div className='w-full flex items-center justify-between'>
            <PrimaryButtonMD          
              onClick={() => {
                setIsEditType(false)
                handleOpenAddType()
              }}
            >
              Add Vesting Type
            </PrimaryButtonMD>
          </div>

          <AddVestingType handleClose={handleCloseAddType} isOpen={isOpenAddType} edit={isEditType} id={editTypeId} />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>No</b>
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
                <TypeItem index={index} info={info} key={index} handleEdit={() => handleEdit(info.typeId)} handleHistory={() => handleHistory(info.typeId)} />
              ))}
            </TableBody>
          </Table>
        </div>
      }
    </div>
  )
}
