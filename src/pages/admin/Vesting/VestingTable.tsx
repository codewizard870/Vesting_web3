/* eslint-disable react-hooks/exhaustive-deps */
import React, { MouseEvent, ChangeEvent, useEffect, useState } from 'react'
import Web3 from 'web3'
import {
  Button,
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
} from '@material-ui/core'
import { useVesting } from 'contexts'
import { VestingInfo, IWalletList, IUpdateVestingList } from 'types'
import { AddVesting } from './AddVesting'
import { VestingHistory } from './VestingHistory'
import { formatEther, parseEther } from 'utils'
import { toast } from 'react-toastify'
import { PrimaryButtonMD } from 'components/PrimaryButtonMD'
import { SecondaryButtonMD } from 'components/SecondaryButtonMD'
import { getShortWalletAddress } from 'utils'

interface IVestingItem {
  index: number
  info: VestingInfo
  onAdd: (edit: boolean, info: Maybe<VestingInfo>) => void
  onHistory: (info: Maybe<VestingInfo>) => void
}

const useStyles = makeStyles((theme) => ({
  importButton: {
      margin: '4px',
      borderRadius: "9999px",        
      color: "#FFFFFF",       
      fontFamily: "Gibson",
      fontWeight: 600,        
      [theme.breakpoints.down('md')]: {
          paddingTop: '4px',
          paddingBottom: '4px',
          fontSize: "14px"
      },
      [theme.breakpoints.up('md')]: {
          paddingTop: '5px',
          paddingBottom: '5px',
          fontSize: "16px"
      }
  },
}))

const VestingItem: React.FC<IVestingItem> = ({
  index,
  info,
  onAdd,
  onHistory,
}) => {
  const { vestingTypes } = useVesting()  

  return (
    <TableRow key={info.vestingId}>
      <TableCell style={{textAlign: 'right'}}>{(index + 1)}</TableCell>
      <TableCell style={{textAlign: 'center'}}>{vestingTypes[info.typeId].name}</TableCell>
      <TableCell className='break-words' style={{textAlign: 'center'}}>{getShortWalletAddress(info.recipient)}</TableCell>
      <TableCell style={{textAlign: 'center'}}>{formatEther(info.amount, undefined, 3, true)} FLD</TableCell>
      <TableCell style={{textAlign: 'center'}}>
        {formatEther(info.claimedAmount, undefined, 3, true)} FLD
      </TableCell>
      <TableCell
        className='flex items-center gap-4'
        style={{textAlign: 'center'}}
      >
        <PrimaryButtonMD
          width='80px'
          onClick={() => onAdd(true, info)}
        >
          Edit
        </PrimaryButtonMD>
        <SecondaryButtonMD
          onClick={() => onHistory(info)}
        >
          History
        </SecondaryButtonMD>
      </TableCell>
    </TableRow>
  )
}

export const VestingTable = () => {
  const { vestingTypes, vestingList, addUpdateMultiVesting } = useVesting()
  const classes = useStyles()
  const [typeId, setTypeId] = useState(-1)
  const [showHistory, setShowHistory] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [activeInfo, setActiveInfo] = useState<Maybe<VestingInfo>>(null)
  const [isOpenAddVesting, setIsOpenAddVesting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const fileReader = new FileReader()

  useEffect(() => {
    if (typeId >= vestingTypes.length) {
      setTypeId(-1)
    }
  }, [vestingTypes])

  const handleOpenAddVesting = () => {
    setIsOpenAddVesting(true)
  }

  const handleCloseAddVesting = () => {
    setIsOpenAddVesting(false)
  }

  const handleAdd = (edit: boolean, info: Maybe<VestingInfo>) => {
    setEdit(edit)
    setActiveInfo(info)
    handleOpenAddVesting()
  }

  const handleHistory = (info: Maybe<VestingInfo>) => {
    setActiveInfo(info)
    setShowHistory(true)
  }

  const csvFileToArray = (data: string) => {
    const csvRows = data.slice(data.indexOf("\n") + 1).split("\n")

    const array = csvRows.map(i => {
      const values = i.replaceAll('\r', '').split(",")
      const obj: IWalletList = {
        typeId: '',
        recipient: '',
        amount: parseEther('0', undefined)
      }
      if (values.length === 3) {
        obj['typeId'] = values[0]
        obj['recipient'] = values[1]
        obj['amount'] = parseEther(values[2], undefined)
      }

      return obj
    })

    let _addVestingList: IWalletList[] = [], _updateVestingList: IUpdateVestingList[] = []
    let errors: string[] = []
    array.map((d, i) => {
      if (d.recipient || d.typeId) {
        const inx = vestingTypes.findIndex(v => v.name.toLowerCase() === d.typeId.toLowerCase())
        if (inx < 0 || !Web3.utils.isAddress(d.recipient)) {
          if (inx < 0)
            errors.push(`VestingType Name: ${d.typeId}`)
          if (!Web3.utils.isAddress(d.recipient))
            errors.push(`Wallet: ${d.recipient}`)
        } else {
          const index = vestingList.findIndex(v => v.typeId === vestingTypes[inx].typeId && v.recipient.toLowerCase() === d.recipient.toLowerCase())
          if (index < 0) {
            if (d.recipient.length > 0)
              _addVestingList.push({
                typeId: `${vestingTypes[inx].typeId}`,
                recipient: d.recipient,
                amount: d.amount
              })
          } else {
            _updateVestingList.push({
              vestingId: `${vestingList[index].vestingId}`,
              recipient: d.recipient,
              amount: d.amount
            })
          }
        }
      }
    })

    if (errors.length) {
      setErrors(errors)
      console.error('error', errors.join(','))
      toast.warning("Error: " + errors.join(','))
      return
    }

    if (_addVestingList.length || _updateVestingList.length)
      addUpdateMultiVesting(_addVestingList, _updateVestingList)
    else toast.warning("There is no valid data in this importing!")
  }

  const handleOnUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setErrors([])
    const target = (e.target as HTMLInputElement).files
    if (target) {
      fileReader.onload = function (event: any) {
        const csvOutput = event.target.result
        csvFileToArray(csvOutput)
      }

      fileReader.readAsText(target[0])
    }
  }

  return showHistory ? (
    <VestingHistory
      typeId={activeInfo?.typeId || 0}
      vestingId={activeInfo?.vestingId || 0}
      address={activeInfo?.recipient || ''}
      onBack={() => setShowHistory(false)}
    />
  ) : (
    <div className='w-full'>
      <AddVesting
        isOpen={isOpenAddVesting}
        handleClose={handleCloseAddVesting}
        edit={isEdit}
        info={activeInfo}
      />
      <div className='w-full flex justify-between'>
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

        <div className='flex gap-4'>
          <PrimaryButtonMD
            onClick={() => handleAdd(false, null)}
          >
            Add Client
          </PrimaryButtonMD>
          <div>
            <input accept=".csv" id="file" type="file" hidden
              onChange={handleOnUpload} />
            <label htmlFor="file">
              <Button
                variant="outlined"
                color="secondary"
                component="span"
                className={classes.importButton}
                style={{ width: '120px', border: '2px solid #050025' }}
                onClick={(e: MouseEvent<HTMLButtonElement>) => {e.stopPropagation()}}
                disableElevation
              >
                <span className={`text-[14px] md:text-[16px] text-[#051C42] font-medium uppercase`}>Import</span>
              </Button>           
            </label>
          </div>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{textAlign: 'right'}}>
              <b>No</b>
            </TableCell>
            <TableCell style={{textAlign: 'center'}}>
              <b>Type</b>
            </TableCell>
            <TableCell style={{textAlign: 'center'}}>
              <b>User Wallet</b>
            </TableCell>
            <TableCell style={{textAlign: 'center'}}>
              <b>Total</b>
            </TableCell>
            <TableCell style={{textAlign: 'center'}}>
              <b>Claimed</b>
            </TableCell>
            <TableCell style={{textAlign: 'center'}}>
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
    </div>
  )
}