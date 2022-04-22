/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { Redirect, Route, Switch } from 'react-router-dom'
import { VestingTable } from './VestingTable'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '2rem',
    boxSizing: 'border-box',
  },
}))

export const Vesting = () => {
  const classes = useStyles()

  return (
    <Box className={clsx(classes.root)}>
      <Switch>
        <Route path="/admin/vesting" component={VestingTable} />
        <Redirect to="/admin/vesting" />
      </Switch>
    </Box>
  )
}
