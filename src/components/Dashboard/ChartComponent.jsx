/* eslint-disable react-hooks/exhaustive-deps */
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';

import AuthUser from '../../utils/AuthUser';

function ChartComponent({ startYear, endYear }) {
    const { http } = AuthUser()

    useEffect(() => {
        http.get(`/api/getSiswaPerYear/${startYear}/${endYear}`)
            .then(res => {
                const newSeries = res.data.map(item => item.jumlah)
                const newCategories = res.data.map(item => item.year.toString())

                setChartData(prevState => ({
                    ...prevState,
                    series: [{ ...prevState.series[0], data: newSeries }],
                    options: { ...prevState.options, xaxis: { ...prevState.options.xaxis, categories: newCategories } }
                }));
            })
    }, [startYear, endYear])

    const [chartData, setChartData] = useState({
        series: [
            {
                name: "Jumlah Santri",
                data: [0]
            }
        ],
        options: {
            chart: {
                height: 350,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Jumlah Santri per Tahun',
                align: 'left'
            },
            xaxis: {
                categories: ['2000']
            },
            tooltip: {
                x: {
                    format: 'yyyy'
                },
            },
        }
    });
    return (
        <div className='bg-white border rounded-md m-2 mt-4 p-2'>
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={350}
            />
        </div>
    )
}
export default ChartComponent