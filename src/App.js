import React, { useEffect, useState } from 'react';
import * as Colors from './Colors';
import Numeric from './Numeric';
import LineCharts from './LineCharts';
import RatioCharts from './RatioCharts';
import {BounceLoader} from "react-spinners";
import './App.css';
import Axios from 'axios';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [covidData, setCovidData] = useState({});

  useEffect(() => {
    console.log(isLoading);
    let currentNewConfirmed = [];
    let currentNewRecoveries = [];
    let currentNewDeaths = [];
    let currentCummulativeConfirmed = [];
    let currentCummulativeDeaths = [];
    let currentCummulativeRecoveries = [];
    let currentDateLabels = [];
    Axios.get('https://raw.githubusercontent.com/jasonowen-s/covid62-data/main/data.json')
      .then((res) => {
        const respoonseData = res.data;
        respoonseData.update.harian.forEach(day => {
          currentNewConfirmed.push(day.jumlah_positif.value);
          currentNewDeaths.push(day.jumlah_meninggal.value);
          currentNewRecoveries.push(day.jumlah_sembuh.value);
          currentCummulativeConfirmed.push(day.jumlah_positif_kum.value);
          currentCummulativeDeaths.push(day.jumlah_meninggal_kum.value);
          currentCummulativeRecoveries.push(day.jumlah_sembuh_kum.value);
          currentDateLabels.push(
            new Date(day.key).toLocaleDateString('en-GB')
          );
        });
        const currentLatestDate = new Date(respoonseData.update.harian[respoonseData.update.harian.length-1].key)
        .toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const data = {
          newConfirmed: currentNewConfirmed,
          newDeaths: currentNewDeaths,
          newRecoveries: currentNewRecoveries,
          cummulativeConfirmed: currentCummulativeConfirmed,
          cummulativeDeaths: currentCummulativeDeaths,
          cummulativeReoveries: currentCummulativeRecoveries,
          totalConfirmed: currentCummulativeConfirmed[currentCummulativeConfirmed.length-1],
          totalDeaths: currentCummulativeDeaths[currentCummulativeDeaths.length-1],
          totalRecoveries: currentCummulativeRecoveries[currentCummulativeRecoveries.length-1],
          dateLabels: currentDateLabels,
          latestDate: currentLatestDate,
        }
        setCovidData(data);
        setIsLoading(false);
      })
  }, []);

  const _getRecoveryData = () => {
    return {
      labels: ["recovered", "confirmed"],
      datasets: [
        {
          data: [covidData.totalRecoveries, covidData.totalConfirmed],
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
      labels: ["deaths", "confirmed"],
      datasets: [
        {
          data: [covidData.totalDeaths, covidData.totalConfirmed],
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
      labels: covidData.dateLabels,
      datasets: [
        {
          label: "deaths",
          backgroundColor: Colors.RED,
          borderColor: Colors.RED,
          data: covidData.newDeaths,
          hidden: true,
          fill: false,
        },
        {
          label: "recovered",
          backgroundColor: Colors.BLUE,
          borderColor: Colors.BLUE,
          data: covidData.newRecoveries,
          hidden: true,
          fill: false,
        },
        {
          label: "confirmed",
          backgroundColor: Colors.GREEN,
          borderColor: Colors.GREEN,
          data: covidData.newConfirmed,
          fill: false,
        },
      ],
    };
  }

  const _getCummulativeCasesData = () => {
    return{
      labels: covidData.dateLabels,
      datasets: [
        {
          label: "deaths",
          backgroundColor: Colors.RED_TRANSPARENT,
          borderColor: Colors.RED,
          data: covidData.cummulativeDeaths,
          fill: true,
        },
        {
          label: "recovered",
          backgroundColor: Colors.BLUE_TRANSPARENT,
          borderColor: Colors.BLUE,
          data: covidData.cummulativeReoveries,
          fill: true,
        },
        {
          label: "confirmed",
          backgroundColor: Colors.GREEN_TRANSPARENT,
          borderColor: Colors.GREEN,
          data: covidData.cummulativeConfirmed,
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

  return (
    isLoading ? 
    renderLoadingAnimation() :
    <div className="App">
      <div>
        data last updated <span className='latest-date'> {covidData.latestDate} </span>
      </div>
      <Numeric confirmed={covidData.totalConfirmed} recovered={covidData.totalRecoveries} deaths={covidData.totalDeaths} />
      <LineCharts incrementalData={_getIncrementalData()} cummulativeData={_getCummulativeCasesData()} />
      <RatioCharts recoveryData={_getRecoveryData()} mortalityData={_getMortalityData()} />
    </div>
  );
}

export default App;