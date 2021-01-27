import React from 'react';
import { Doughnut, Chart } from "react-chartjs-2";
import * as Colors from '../Constants/Colors';


// Variation of K Scandrett's code on StackOverflow
// https://stackoverflow.com/questions/42759306/add-text-inside-doughnut-chart-from-chart-js-2-in-react
var donut = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw: function() {
    donut.apply(this, arguments);

    var chart = this.chart;
    var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;

    ctx.font = "3rem Montserrat";
    ctx.textBaseline = "middle";
    
    const percentage = (chart.config.data.datasets[0].data[0]!==0) ? ((chart.config.data.datasets[0].data[0]/chart.config.data.datasets[0].data[1])*100).toFixed(1) : 0;
    var text = percentage+"%",
        xpos = (width - ctx.measureText(text).width) / 2,
        ypos = (height/2)+20

    ctx.fillText(text, xpos, ypos);
    ctx.font = "1.7rem Montserrat";
    ctx.textBaseline = "middle";
    text = (chart.config.data.labels[0]).toLowerCase();
    xpos = Math.round((width - ctx.measureText(text).width) / 2);
    ypos = (height/2)+55;
    ctx.fillText(text, xpos, ypos);
  }
});

function RatioChart(props){
  return(
      <Doughnut
        data={props.data}
        options={{
          maintainAspectRatio : false,
          title: {
            display: true,
            text: props.title,
            fontFamily: 'Montserrat',
            fontColor: 'white',
            fontSize: 35,
          },
          legend:{
            display:false
          },
          elements:{
            arc:{
              borderWidth: 10,
              borderColor: Colors.BACKGROUND_COLOR,
            }
          },
          tooltips:{
            enabled: false
          }
        }}
        width={1}
        height={1}
      />
  );
}

export default RatioChart;