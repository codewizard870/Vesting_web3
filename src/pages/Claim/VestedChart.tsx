/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, makeStyles, Button } from '@material-ui/core';
import { useVesting, useWallet } from 'contexts';
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { bnToDec, decToBn } from 'utils';
import BigNumber from 'bignumber.js';
import moment from 'moment';

const seriesColor = ['#65a30d', '#0284c7', '#ea580c','#2563eb', '#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#57534e', '#ca8a04']
const options = {
    title: {
        text: ''
    },
    series: [
        {
            name: 'Vesting',
            type: 'area',
            data: [],
        }
    ],
    tooltip: {
        enabled: true,
        formatter: function () {
            let t: any = this
            if (t.x === 0) return ''
            else return moment(t.x).format("MMMM Do YYYY, h:mm:ss") + '<br /><b>' + t.series.name + ': ' + t.y + '</b>'
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
                fillColor: '#001926',
                lineColor: '#867EE8',
                lineWidth: 2,
                enabled: true
            }
        }
    },
    chart: {
        backgroundColor: 'transparent',
        height: '45%',
        // width: 450,
        spacingBottom: 0,
        spacingLeft: 20,
        spacingRight: 60,
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
        // visible: false,
        // min: 0,
        // max: 10,
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
        display: 'flex',
        justifyContent: 'center'
    },
    table: {
        width: '100%',
        minWidth: 700,
    },
}));

export const VestedChart = () => {
    const classes = useStyles();
    const { account } = useWallet();
    const { vestingList, vestingTypes, getClaimAvailable } = useVesting();    
    const [chartOptions, setChartOptions] = useState({ ...options })

    useEffect(() => {
        const fetch = async () => {
            if (vestingList && vestingTypes) {
                const userVestingList = vestingList.filter(
                    (item) =>
                        item.recipient.toLowerCase() === account?.toLowerCase() && item.amount > 0
                );
                let chartSeries: any = []
                await Promise.all(userVestingList.map(async (item, index) => {
                    const res = await getClaimAvailable(item.vestingId);
                    let chartPoints: any = []
                    chartPoints.push({ x: 0, y: 0 })
                    let y2 = item.claimedAmount
                    if (res) {
                        y2 += Number(res)                        
                    }                                        
                    chartPoints.push({ x: new Date(), y: y2 })
                    chartSeries.push({ name: vestingTypes[item.typeId].name, type: 'area', data: chartPoints, color: seriesColor[index] })
                }))

                setChartOptions({ ...options, series: chartSeries })                
            }
        }
        fetch()
    }, [vestingList, vestingTypes])

    return (
        <div className={classes.root}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};
