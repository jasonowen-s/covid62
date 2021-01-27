import React from 'react';
import RatioChart from './RatioChart';

function RatioCharts(props){
    return(
        <section className="ratio-charts">
          <div className="ratio-chart">
            <RatioChart data={props.recoveryData} title="RECOVERY RATIO"/>
          </div>
          <div className="ratio-chart">
            <RatioChart data={props.mortalityData} title="MORTALITY RATIO"/>
          </div>
        </section>
    );
}

export default RatioCharts;