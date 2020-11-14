import React, { useEffect, useState } from 'react';
import * as Colors from './Colors';
import Numeric from './Numeric';
import LineCharts from './LineCharts';
import RatioCharts from './RatioCharts';
import {BounceLoader} from "react-spinners";
import data from './data.json';
import './App.css';

const App = () => {
  const [newConfirmed, setNewConfirmed] = useState([]);
  const [newRecoveries, setNewRecoveries] = useState([]);
  const [newDeaths, setNewDeaths] = useState([]);
  const [cummulativeConfirmed, setCummulativeConfirmed] = useState([]);
  const [cummulativeDeaths, setCummulativeDeaths] = useState([]);
  const [cummulativeReoveries, setCummulativeReoveries] = useState([]);
  const [totalDeaths, setTotalDeaths] = useState(0);
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalRecoveries, setTotalRecoveries] = useState(0);
  const [dateLabels, setDateLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestDate, setLatestDate] = useState(new Date());

  useEffect(() => {
    let currentNewConfirmed = [];
    let currentNewRecoveries = [];
    let currentNewDeaths = [];
    let currentCummulativeConfirmed = [];
    let currentCummulativeDeaths = [];
    let currentCummulativeRecoveries = [];
    let currentDateLabels = [];

    data.update.harian.forEach(day => {
      currentNewConfirmed.push(day.jumlah_positif.value);
      currentNewDeaths.push(day.jumlah_meninggal.value);
      currentNewRecoveries.push(day.jumlah_sembuh.value);
      currentCummulativeConfirmed.push(day.jumlah_positif_kum.value);
      currentCummulativeDeaths.push(day.jumlah_meninggal_kum.value);
      currentCummulativeRecoveries.push(day.jumlah_sembuh_kum.value);
      currentDateLabels.push(
        new Date(day.key).toLocaleDateString('en-GB')
      );
    
      const currentLatestDate = new Date(data.update.harian[data.update.harian.length-1].key)
      .toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      setNewConfirmed(currentNewConfirmed);
      setNewDeaths(currentNewDeaths);
      setNewRecoveries(currentNewRecoveries);
      setCummulativeConfirmed(currentCummulativeConfirmed);
      setCummulativeDeaths(currentCummulativeDeaths);
      setCummulativeReoveries(currentCummulativeRecoveries);
      setTotalConfirmed(currentCummulativeConfirmed[currentCummulativeConfirmed.length-1]);
      setTotalDeaths(currentCummulativeDeaths[currentCummulativeDeaths.length-1]);
      setTotalRecoveries(currentCummulativeRecoveries[currentCummulativeRecoveries.length-1]);
      setDateLabels(currentDateLabels);
      setLatestDate(currentLatestDate);
      setIsLoading(false);
    });
  }, []);

  const _getRecoveryData = () => {
    return {
      labels: ["recovered", "confirmed"],
      datasets: [
        {
          data: [totalRecoveries, totalConfirmed],
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
          data: [totalDeaths, totalConfirmed],
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
      labels: dateLabels,
      datasets: [
        {
          label: "deaths",
          backgroundColor: Colors.RED,
          borderColor: Colors.RED,
          data: newDeaths,
          hidden: true,
          fill: false,
        },
        {
          label: "recovered",
          backgroundColor: Colors.BLUE,
          borderColor: Colors.BLUE,
          data: newRecoveries,
          hidden: true,
          fill: false,
        },
        {
          label: "confirmed",
          backgroundColor: Colors.GREEN,
          borderColor: Colors.GREEN,
          data: newConfirmed,
          fill: false,
        },
      ],
    };
  }

  const _getCummulativeCasesData = () => {
    return{
      labels: dateLabels,
      datasets: [
        {
          label: "deaths",
          backgroundColor: Colors.RED_TRANSPARENT,
          borderColor: Colors.RED,
          data: cummulativeDeaths,
          fill: true,
        },
        {
          label: "recovered",
          backgroundColor: Colors.BLUE_TRANSPARENT,
          borderColor: Colors.BLUE,
          data: cummulativeReoveries,
          fill: true,
        },
        {
          label: "confirmed",
          backgroundColor: Colors.GREEN_TRANSPARENT,
          borderColor: Colors.GREEN,
          data: cummulativeConfirmed,
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
        data last updated <span className='latest-date'> {latestDate} </span>
      </div>
      <Numeric confirmed={totalConfirmed} recovered={totalRecoveries} deaths={totalDeaths} />
      <LineCharts incrementalData={_getIncrementalData()} cummulativeData={_getCummulativeCasesData()} />
      <RatioCharts recoveryData={_getRecoveryData()} mortalityData={_getMortalityData()} />
    </div>
  );
}

export default App;