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
        (this.state.loaded === true) ? 
        <div className="App">
          <p>data last updated
          <b> {this.state.latestDate}</b>
          </p>
          <Numeric confirmed={this.state.totalConfirmed} recovered={this.state.totalRecovered} deaths={this.state.totalDeath} />
          <LineCharts incrementalData={this._getIncrementalData()} cummulativeData={this._getCummulativeCasesData()} />
          <RatioCharts recoveryData={this._getRecoveryData()} mortalityData={this._getMortalityData()} />
        </div>
        :
        (this.state.loaded === false) ? 
        <BounceLoader 
          css='
            margin: 27vh auto
          '
          size={300}
          color={Colors.WHITE}
          loaded={this.state.loaded}
        />
        :
        <div style={{margin: '30vh auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          Data Request Timeout <br/>
          please try again later
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
      loaded: false
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

    Axios.get('https://api.covid19api.com/total/country/ID', {timeout: 5000})
    .then((response) => {
        let responseData = response.data;
        for (let i = 39; i < responseData.length; i++) {
          newCases.push(responseData[i].Confirmed-responseData[i-1].Confirmed);
          newDeaths.push(responseData[i].Deaths-responseData[i-1].Deaths);
          newRecovery.push(responseData[i].Recovered-responseData[i-1].Recovered);
          cummulativeCases.push(responseData[i].Confirmed);
          cummulativeDeaths.push(responseData[i].Deaths);
          cummulativeRecovery.push(responseData[i].Recovered);
          dateLabels.push(
            new Date(responseData[i].Date).toLocaleDateString('en-GB')
          );
        }
        const latestDate = new Date(responseData[responseData.length-1].Date)
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
          loaded: true
        });
    })
    .catch((err) => {
      this.setState({loaded: undefined})
    });
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
