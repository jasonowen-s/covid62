import React from 'react';
import { Line } from "react-chartjs-2";
function LineChart(props){
  return(
      <Line
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
            position: 'bottom',
            reverse: true,
            labels: {
              fontFamily: 'Montserrat',
              fontColor: 'white',
              fontSize: 25,
            }
          },
          scales:{
            xAxes: [{
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                maxTicksLimit: 20,
                fontFamily: 'Montserrat',
                fontColor: 'white',
                fontSize: 15,
              },
            }],
            yAxes: [{
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                fontFamily: 'Montserrat',
                fontColor: 'white',
                fontSize: 15,
              },
            }]
          },
          tooltips:{
            mode: 'index',
            position: 'nearest',
            intersect: false,
            titleFontSize: 20,
            titleAlign: 'center',
            bodyFontSize: 20,
            titleMarginBottom: 10,
            xPadding: 20,
            yPadding: 20,
            itemSort: function(item1, item2) {
              return item2.datasetIndex - item1.datasetIndex
            },
          },
        }}
      />
  );
}

export default LineChart;