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
    Checkbox,
    FormControlLabel
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { useSession } from 'contexts';
import { Redirect, Route, Switch } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
    },
    flex: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 40,
        marginRight: 8,
    },
    checkbox: {
        marginLeft: "30px"
    },
}));

interface IUserInfo {
    index: number;
    info: any;
}

const UserInfo: React.FC<IUserInfo> = ({
    index,
    info
}) => {
    const classes = useStyles();
    const [checked, setChecked] = useState(info.permit ? true : false)
    const [sendingPermit, setSendingPermit] = useState(false)
    const { requestUpdatePermit } = useSession()

    const handlePermit = async (event: any) => {
        let id = info._id
        let permit = event.target.checked ? 1 : 0
        try {
            setSendingPermit(true)
            const res = await requestUpdatePermit(id, permit)            
            if (res.status) {
                setChecked(!event.target.checked)
                toast.success(permit===1?"Approve!":"Unapprove!");
            } else {
                setChecked(event.target.checked)
                toast.error(res.msg);
            }
            setSendingPermit(false)
        } catch (err) {            
            setChecked(event.target.checked)
            let error:any=err
            toast.error(error.message);
            setSendingPermit(false)
        }
    }


    return (
        <TableRow key={info.vestingId}>
            <TableCell>{index}</TableCell>
            <TableCell>{info.name}</TableCell>
            <TableCell>{info.email}</TableCell>
            <TableCell>{info.createdAt}</TableCell>
            <TableCell className={classes.flex}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={handlePermit}
                            // value={checked}
                            classes={{
                                root: classes.checkbox
                            }}
                            color="primary"
                            disabled={sendingPermit}
                        />
                    }
                    label=""
                />
            </TableCell>
        </TableRow>
    );
};

export const UserList = () => {
    const classes = useStyles();
    const { requestUserList } = useSession()
    const [permitId, setPermitId] = useState(-1);
    const [userList, setUserList] = useState([])    

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await requestUserList()
                console.log(res)
                if (res) {
                    setUserList(res.userlist)
                } else {
                    setUserList([])
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetch()
    }, [])

    return (
        <Card className={classes.root}>
            <Box className={classes.flex}>
                <FormControl style={{ width: 200 }}>
                    <InputLabel id="vesting-type-label">Approval Status</InputLabel>
                    <Select
                        labelId="vesting-type-label"
                        value={permitId}
                        label="Vesting Type"
                        onChange={(e) => setPermitId(Number(e.target.value))}
                    >
                        <MenuItem value={-1}>All</MenuItem>
                        <MenuItem value={0}>Not Approved</MenuItem>
                        <MenuItem value={1}>Approved</MenuItem>
                    </Select>
                </FormControl>
            </Box>

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
                            <b>Email</b>
                        </TableCell>
                        <TableCell>
                            <b>CreatedAt</b>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                            <b>Approval</b>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {userList && userList
                        .filter(
                            (item: any) =>
                                permitId === -1 || item.permit === permitId
                        )
                        .map((info, index) => (
                            <UserInfo
                                index={index}
                                info={info}
                                key={index}
                            />
                        ))}
                </TableBody>
            </Table>
        </Card>
    );
};
