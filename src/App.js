import Axios from 'axios';
import React from 'react';
import * as Colors from './Colors';
import Numeric from './Numeric';
import LineCharts from './LineCharts';
import RatioCharts from './RatioCharts';
import {BounceLoader} from "react-spinners";
import './App.css';

class App extends React.Component{
  render(){
    return (
        this.state.loading ? 
        <BounceLoader 
          css='
            margin: 27vh auto;
          '
          size={300}
          color={Colors.WHITE}
          loading={this.state.loading}
        />
        :
        <div className="App">
          <p>data last updated
          <b> {this.state.latestDate}</b>
          </p>
          <Numeric confirmed={this.state.totalConfirmed} recovered={this.state.totalRecovered} deaths={this.state.totalDeath} />
          <LineCharts incrementalData={this._getIncrementalData()} cummulativeData={this._getCummulativeCasesData()} />
          <RatioCharts recoveryData={this._getRecoveryData()} mortalityData={this._getMortalityData()} />
        </div>
    );
  }
  
  constructor(props) {
    super(props);
    this.state = {
      newCases: [],
      newRecovery: [],
      newDeaths: [],
      dateLabels: [],
      cummulativeCases: [],
      cummulativeDeaths: [],
      cummulativeRecovery: [],
      totalDeath: 0,
      totalConfirmed: 0,
      totalRecovered: 0,
      loading: true
    };
  }

  async componentDidMount() {
    let newCases = [];
    let newRecovery = [];
    let newDeaths = [];
    let cummulativeCases = [];
    let cummulativeDeaths = [];
    let cummulativeRecovery = [];
    let dateLabels = [];
    Axios.get('https://yacdn.org/serve/https://data.covid19.go.id/public/api/update.json?maxAge=[3600]').then(
      (response) => {
        response.data.update.harian.forEach(day => {
          newCases.push(day.jumlah_positif.value);
          newDeaths.push(day.jumlah_meninggal.value);
          newRecovery.push(day.jumlah_sembuh.value);
          cummulativeCases.push(day.jumlah_positif_kum.value);
          cummulativeDeaths.push(day.jumlah_meninggal_kum.value);
          cummulativeRecovery.push(day.jumlah_sembuh_kum.value);
          dateLabels.push(
            new Date(day.key).toLocaleDateString('en-GB')
          );
        });

        const latestDate = new Date(response.data.update.harian[response.data.update.harian.length-1].key)
        .toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        this.setState({
          newCases: newCases,
          newDeaths: newDeaths,
          newRecovery: newRecovery,
          cummulativeDeaths: cummulativeDeaths,
          cummulativeCases: cummulativeCases,
          cummulativeRecovery: cummulativeRecovery,
          totalDeath: cummulativeDeaths[cummulativeDeaths.length-1],
          totalConfirmed: cummulativeCases[cummulativeCases.length-1],
          totalRecovered: cummulativeRecovery[cummulativeRecovery.length-1],
          dateLabels: dateLabels,
          latestDate: latestDate,
          loading: false
        });
      }
    );
  }

  _getRecoveryData(){
    return {
      labels: ["recovered", "confirmed"],
      datasets: [
        {
          data: [this.state.totalRecovered, this.state.totalConfirmed],
          fill: true,
          backgroundColor: [
            Colors.BLUE,
            Colors.GREEN
          ],
        }
      ],
    };
  }

  _getMortalityData(){
    return {
      labels: ["deaths", "confirmed"],
      datasets: [
        {
          data: [this.state.totalDeath, this.state.totalConfirmed],
          fill: true,
          backgroundColor: [
            Colors.RED,
            Colors.GREEN
          ],
        }
      ],
    };
  }

  _getIncrementalData(){
    return{
      labels: this.state.dateLabels,
      datasets: [
        {
          label: "deaths",
          backgroundColor: Colors.RED,
          borderColor: Colors.RED,
          data: this.state.newDeaths,
          hidden: true,
          fill: false,
        },
        {
          label: "recovered",
          backgroundColor: Colors.BLUE,
          borderColor: Colors.BLUE,
          data: this.state.newRecovery,
          hidden: true,
          fill: false,
        },
        {
          label: "confirmed",
          backgroundColor: Colors.GREEN,
          borderColor: Colors.GREEN,
          data: this.state.newCases,
          fill: false,
        },
      ],
    };
  }

  _getCummulativeCasesData(){
    return{
      labels: this.state.dateLabels,
      datasets: [
        {
          label: "deaths",
          backgroundColor: Colors.RED_TRANSPARENT,
          borderColor: Colors.RED,
          data: this.state.cummulativeDeaths,
          fill: true,
        },
        {
          label: "recovered",
          backgroundColor: Colors.BLUE_TRANSPARENT,
          borderColor: Colors.BLUE,
          data: this.state.cummulativeRecovery,
          fill: true,
        },
        {
          label: "confirmed",
          backgroundColor: Colors.GREEN_TRANSPARENT,
          borderColor: Colors.GREEN,
          data: this.state.cummulativeCases,
          fill: true,
        },
      ],
    };
  }
}

export default App;
