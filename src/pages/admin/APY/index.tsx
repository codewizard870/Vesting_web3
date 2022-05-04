/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
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
    Checkbox,
    FormControlLabel
} from '@material-ui/core'
import { toast } from 'react-toastify'
import { useSession } from 'contexts'
import CircularProgress from '@material-ui/core/CircularProgress'

export const APY_Edit = () => {
    const { requestUserList } = useSession()
    const [userList, setUserList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true)
            try {
                const res = await requestUserList()
                if (res) {
                    setUserList(res.userlist)
                } else {
                    setUserList([])
                }
                setIsLoading(false)
            } catch (err) {
                setIsLoading(false)
                console.log(err)
            }
        }
        fetch()
    }, [])

    return (
        <div className="w-full flex justify-center py-8 md:px-6 lg:px-8 xl:px-16 2xl:px-[124px]">
            <div className='w-full max-w-[1620px] flex flex-col items-center gap-4 rounded-[20px] bg-white shadow-xl py-8 px-6'>


                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <b>No</b>
                            </TableCell>
                            <TableCell>
                                <b>Pool</b>
                            </TableCell>
                            <TableCell>
                                <b>APY</b>
                            </TableCell>
                            <TableCell>
                                <b>UpdatedAt</b>
                            </TableCell>
                            <TableCell>
                                <b>Actions</b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {!isLoading &&
                        <TableBody>
                           
                        </TableBody>
                    }
                </Table>
                {isLoading &&
                    <div className='m-5 w-full flex justify-center items-center'>
                        <CircularProgress />
                    </div>
                }
            </div>
        </div>
    )
}
