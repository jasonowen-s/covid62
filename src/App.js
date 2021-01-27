import React, { useEffect, useState } from 'react';
import * as Colors from './Constants/Colors';
import Numeric from './Components/Numeric';
import LineCharts from './Components/LineCharts';
import RatioCharts from './Components/RatioCharts';
import {BounceLoader} from 'react-spinners';
import './App.css';
import Axios from 'axios';
import { Radio } from 'antd';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeSeriesData, setTimeSeriesData] = useState({});
  const [totalData, setTotalData] = useState({});
  const [filterDays, setFilterDays] = useState(0);

  useEffect(() => {
    let newConfirmed = [];
    let newRecoveries = [];
    let newDeaths = [];
    let cummulativeConfirmed = [];
    let cummulativeDeaths = [];
    let cummulativeRecoveries = [];
    let cummulativeActive = [];
    let dateLabels = [];
    Axios.get('https://raw.githubusercontent.com/jasonowen-s/covid62-data/main/data.json')
      .then((res) => {
        const responseData = res.data;
        responseData.update.harian.forEach(day => {
          newConfirmed.push(day.jumlah_positif.value);
          newDeaths.push(day.jumlah_meninggal.value);
          newRecoveries.push(day.jumlah_sembuh.value);
          cummulativeConfirmed.push(day.jumlah_positif_kum.value);
          cummulativeDeaths.push(day.jumlah_meninggal_kum.value);
          cummulativeRecoveries.push(day.jumlah_sembuh_kum.value);
          cummulativeActive.push(day.jumlah_positif_kum.value - day.jumlah_sembuh_kum.value - day.jumlah_meninggal_kum.value);
          dateLabels.push(
            new Date(day.key).toLocaleDateString('en-GB')
          );
        });
        const currentLatestDate = new Date(responseData.update.harian[responseData.update.harian.length-1].key)
        .toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timeSeriesData = {
          newConfirmed: newConfirmed,
          newDeaths: newDeaths,
          newRecoveries: newRecoveries,
          cummulativeConfirmed: cummulativeConfirmed,
          cummulativeDeaths: cummulativeDeaths,
          cummulativeReoveries: cummulativeRecoveries,
          cummulativeActive: cummulativeActive,
          dateLabels: dateLabels,
          latestDate: currentLatestDate,
        }
        const totalData = {
          totalConfirmed: cummulativeConfirmed[cummulativeConfirmed.length-1],
          totalDeaths: cummulativeDeaths[cummulativeDeaths.length-1],
          totalRecoveries: cummulativeRecoveries[cummulativeRecoveries.length-1],
        }
        setTimeSeriesData(timeSeriesData);
        setTotalData(totalData);
        setIsLoading(false);
      })
  }, []);

  const _getRecoveryData = () => {
    return {
      labels: ['recovered', 'confirmed'],
      datasets: [
        {
          data: [totalData.totalRecoveries, totalData.totalConfirmed],
          fill: true,
          backgroundColor: [
            Colors.BLUE,
            Colors.GREEN
          ],
        }
      ],
    };
  }

  const _getMortalityData = () => {
    return {
      labels: ['deaths', 'confirmed'],
      datasets: [
        {
          data: [totalData.totalDeaths, totalData.totalConfirmed],
          fill: true,
          backgroundColor: [
            Colors.RED,
            Colors.GREEN
          ],
        }
      ],
    };
  }

  const _getIncrementalData = () => {
    return{
      labels: timeSeriesData.dateLabels.slice(filterDays),
      datasets: [
        {
          label: 'deaths',
          backgroundColor: Colors.RED,
          borderColor: Colors.RED,
          data: timeSeriesData.newDeaths.slice(filterDays),
          hidden: true,
          fill: false,
        },
        {
          label: 'recovered',
          backgroundColor: Colors.BLUE,
          borderColor: Colors.BLUE,
          data: timeSeriesData.newRecoveries.slice(filterDays),
          hidden: true,
          fill: false,
        },
        {
          label: 'confirmed',
          backgroundColor: Colors.GREEN,
          borderColor: Colors.GREEN,
          data: timeSeriesData.newConfirmed.slice(filterDays),
          fill: false,
        },
      ],
    };
  }

  const _getCummulativeCasesData = () => {
    return{
      labels: timeSeriesData.dateLabels.slice(filterDays),
      datasets: [
        {
          label: 'deaths',
          backgroundColor: Colors.RED_TRANSPARENT,
          borderColor: Colors.RED,
          data: timeSeriesData.cummulativeDeaths.slice(filterDays),
          fill: true,
        },
        {
          label: 'active',
          backgroundColor: Colors.WHITE_TRANSPARENT,
          borderColor: Colors.WHITE,
          data: timeSeriesData.cummulativeActive.slice(filterDays),
          fill: true,
        },
        {
          label: 'recovered',
          backgroundColor: Colors.BLUE_TRANSPARENT,
          borderColor: Colors.BLUE,
          data: timeSeriesData.cummulativeReoveries.slice(filterDays),
          fill: true,
        },
        {
          label: 'confirmed',
          backgroundColor: Colors.GREEN_TRANSPARENT,
          borderColor: Colors.GREEN,
          data: timeSeriesData.cummulativeConfirmed.slice(filterDays),
          fill: true,
        },
      ],
    };
  }

  const renderLoadingAnimation = () => {
    return (
      <BounceLoader 
        css='
        margin: 27vh auto;
      '
      size={300}
      color={Colors.WHITE}
      loading={isLoading}
    />
  )
}

const renderFilterDays = () => {
  const options = [
    { label: 'All', value: 0 },
    { label: '3 Months', value: -90 },
    { label: '30 Days', value: -30 },
    { label: '7 Days', value: -7 },
  ];
  return (
    <Radio.Group
      style={{marginTop:'1.5rem'}}
      options={options}
      onChange={(event) => setFilterDays(event.target.value)}
      value={filterDays}
      optionType='button'
      buttonStyle='solid'
    />
  )
}

return (
  isLoading ? 
  renderLoadingAnimation() :
  <div className='App'>
    <span className='latest-date'> {timeSeriesData.latestDate} </span>
    {renderFilterDays()}
    <Numeric confirmed={totalData.totalConfirmed} recovered={totalData.totalRecoveries} deaths={totalData.totalDeaths} />
    <LineCharts incrementalData={_getIncrementalData()} cummulativeData={_getCummulativeCasesData(filterDays)} />
    <RatioCharts recoveryData={_getRecoveryData()} mortalityData={_getMortalityData()} />
  </div>
  );
}

export default App;