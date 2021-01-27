import React from 'react';
import LineChart from './LineChart';

function LineCharts(props){
    return(
        <div>
            <section className="line-chart">
            <LineChart data={props.incrementalData} title="INCREMENTAL CASES" reverse={false}/>
            </section>
            <section className="line-chart">
            <LineChart data={props.cummulativeData} title="CUMULATIVE CASES" reverse={true}/>
            </section>
        </div>
    );
}

export default LineCharts;