import { Chart, ChartItem, registerables, Interaction } from 'chart.js';
// @ts-ignore
import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair';
import React, { useRef } from 'react';

export function MintPriceChart() {
  const canvas = useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!canvas.current) return;
    Chart.register(...registerables);

    Chart.register(CrosshairPlugin);
    // @ts-ignore
    Interaction.modes.interpolate = Interpolate;
    const start = 1.11;
    const end = 0.0111;
    const delta = start - end;
    const minus = delta / 50;
    const data = [start];
    for (let i = 1; i < 50; i++) {
      data[i] = data[i - 1] - minus;
    }
    data.push(end);

    const labels = [];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (i % 5 === 0) {
        labels.push(`Day ${++count}`);
      } else {
        labels.push('');
      }
    }
    console.log(data);
    new Chart(canvas.current.getContext('2d') as ChartItem, {
      type: 'line',
      data: {
        labels,

        datasets: [
          {
            label: 'Mint price',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            // @ts-ignore
            mode: 'interpolate',
            intersect: false,
          },
          crosshair: {
            line: {
              color: '#F66', // crosshair line color
              width: 1, // crosshair line width
            },
            sync: {
              enabled: true, // enable trace line syncing with other charts
              group: 1, // chart group
              suppressTooltips: false, // suppress tooltips when showing a synced tracer
            },
            zoom: {
              enabled: true, // enable zooming
              zoomboxBackgroundColor: 'rgba(66,133,244,0.2)', // background color of zoom box
              zoomboxBorderColor: '#48F', // border color of zoom box
              zoomButtonText: 'Reset Zoom', // reset zoom button text
              zoomButtonClass: 'reset-zoom', // reset zoom button class
            },
            callbacks: {
              beforeZoom: () =>
                function (start: any, end: any) {
                  // called before zoom, return false to prevent zoom
                  return true;
                },
              afterZoom: () =>
                function (start: any, end: any) {
                  // called after zoom
                },
            },
          },
        },
        scales: {
          // xAxes: {
          //   // ticks: {
          //   //   callback: function (value, index, values) {
          //   //     let day = "";
          //   //     if (index === values.length - 1) return "Day 11";
          //   //     if (index % 10 === 0) {
          //   //       // @ts-ignore
          //   //       this.item = this.item || 0;
          //   //       // @ts-ignore
          //   //       this.item++;
          //   //       // @ts-ignore
          //   //       day = this.item;
          //   //       return `Day ${day}`;
          //   //     }
          //   //     return null;
          //   //   },
          //   // },
          //   max: 11,
          //   min: 1,
          // },
          yAxes: {
            ticks: {
              stepSize: 0.05,
              callback: function (value) {
                return value + ' ETH';
              },
            },
          },
        },
      },
    });
  }, []);
  return <canvas ref={canvas} />;
}
