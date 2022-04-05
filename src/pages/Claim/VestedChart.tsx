/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, makeStyles, Button } from '@material-ui/core';
import { useVesting, useWallet } from 'contexts';
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { bnToDec, decToBn } from 'utils';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { VestingInfo, VestingType } from 'types';

const seriesColor = ['#65a30d', '#0284c7', '#ea580c', '#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#57534e', '#ca8a04']
const options = {
    title: {
        text: ''
    },
    series: [
        {
            name: 'Vesting',
            type: 'area',
            data: [],
            color: seriesColor[0]
        }
    ],
    tooltip: {
        enabled: true,
        formatter: function () {
            let t: any = this
            return moment(t.x * 1000).format("MMMM Do YYYY, h:mm:ss") + '<br /><b>' + t.series.name + ': ' + t.y + '</b>'
        }
    },
    plotOptions: {
        series: {
            showInLegend: false
        },
        area: {
            lineWidth: 3,
            color: '#867EE8',
            fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, 'rgba(134,126,232, 0.5)'],
                    [0.5, 'rgba(134,126,232, 0)'],
                    [1, 'rgba(134,126,232, 0)']
                ]
            },
            marker: {
                fillColor: 'transparent',
                lineColor: 'transparent',
                lineWidth: 1,
                enabled: true
            }
        }
    },
    chart: {
        backgroundColor: 'transparent',
        height: '30%',
        // width: '100%',
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 30,
        animation: {
            duration: 1000
        }
    },
    credits: {
        enabled: false
    },
    xAxis: {
        visible: true,
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        // type: 'datetime',
        labels: {
            style: {
                color: 'transparent',
                fontSize: '11px',
                fontWeight: '300',
            }
        }
    },
    yAxis: {
        tickAmount: 5,
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        gridLineColor: '#112B40',
        labels: {
            style: {
                color: '#919699',
                fontSize: '11px',
                fontWeight: '300',
            },
            formatter: function (): any {
                let t: any = this
                return t.pos + " FLD"
            }
        },
        title: {
            text: ''
        }
    }
};

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        padding: '30px',
        boxSizing: 'border-box',

    }
}));

export const VestedChart = ({ info }: { info: VestingInfo }) => {
    const classes = useStyles();
    const { account } = useWallet();
    const { vestingList, vestingTypes, getClaimAvailable, getVestingFrequency } = useVesting();
    const [chartOptions, setChartOptions] = useState({ ...options })

    useEffect(() => {
        const fetch = async () => {
            if (vestingList.length > 0 && vestingTypes.length > 0 && info) {
                let chartPoints: any = []
                let startTime = vestingTypes[info.typeId].startTime
                let endTime = vestingTypes[info.typeId].endTime
                let curTime = Math.floor(Date.parse((new Date).toString()) / 1000)
                let vfId = vestingTypes[info.typeId].vestingFrequencyId
                let userAllocation = info.amount
                let vf = await getVestingFrequency(vfId)
                if (vf > 0) {
                    if (curTime < startTime) chartPoints.push({ x: curTime, y: 0 })
                    if (vf <= 1) {
                        chartPoints.push({ x: startTime, y: 0 })
                        if (curTime >= startTime && curTime < endTime) {
                            let cVfs = Math.floor((curTime - startTime) / vf)
                            let vested = Math.round(userAllocation * cVfs * vf / (endTime - startTime))
                            chartPoints.push({ x: curTime, y: vested })
                        }
                        chartPoints.push({ x: endTime, y: userAllocation })
                        if (curTime >= endTime) {
                            chartPoints.push({ x: curTime, y: userAllocation })
                        }
                    } else {
                        let preVested = 0
                        let passedNow = false
                        let preTimepoint = startTime
                        for (let i = startTime; i < endTime; i += vf) {
                            let cVfs = Math.floor((i - startTime) / vf)
                            let vested = Math.round(userAllocation * cVfs * vf / (endTime - startTime))
                            if (curTime >= preTimepoint && curTime < i && passedNow === false) {
                                passedNow = true
                                chartPoints.push({ x: curTime, y: preVested, marker:{enabled:true, fillColor: '#00ff00', lineWidth: 2, lineColor: '#ca8a04'} })
                            }
                            if (preVested !== vested) {
                                chartPoints.push({ x: i, y: preVested })
                            }
                            chartPoints.push({ x: i, y: vested })
                            preTimepoint = i
                            preVested = vested
                        }
                        if (passedNow === false && curTime >= preTimepoint && curTime < endTime) {
                            passedNow = true
                            chartPoints.push({ x: curTime, y: preVested })
                        }
                        if (preVested !== userAllocation) {
                            chartPoints.push({ x: endTime, y: preVested })
                        }
                        chartPoints.push({ x: endTime, y: userAllocation })
                        if (passedNow === false && curTime >= endTime) {
                            passedNow = true
                            chartPoints.push({ x: curTime, y: userAllocation })
                        }
                    }
                    if (curTime >= endTime) chartPoints.push({ x: curTime, y: userAllocation })
                }
                let chartSeries: any = []
                setChartOptions({ ...options, series: [{ name: vestingTypes[info.typeId].name, type: 'area', data: chartPoints, color: seriesColor[info.typeId] }] })
            }
        }
        fetch()
    }, [vestingList, vestingTypes, info])

    return (
        <div style={{ minWidth: '500px', width: '100%' }}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};
