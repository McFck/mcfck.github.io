import * as Highcharts from 'highcharts';
import { Tooltip } from '../models/dataModels';

export class ChartsHelper {
    public static prepareChartData(
        originalData: any[],
        tooltip: Tooltip
      ): any[] {
        const data: any[] = [];
        for (let i = 0; i < originalData.length; i++) {
          data.push({
            name: originalData[i]?.name,
            headerName: tooltip.headerName,
            pointName: tooltip.pointName,
            y: originalData[i]?.value,
            x: originalData[i]?.x
          });
        }
        return data;
      }
    
      public static drawChart(
        divId: string,
        originalData: any[],
        chartType: string,
        chartTitle: string,
        tooltip: Tooltip,
        additionalOptions?: {}
      ): void {
        const data: any[] = ChartsHelper.prepareChartData(originalData, tooltip);
    
        const defaultOptions: any = {
          chart: {
            height: 350,
            width: 400,
            type: chartType,
            backgroundColor: null,
          },
          title: {
            text: chartTitle,
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false,
              },
              showInLegend: true,
            },
            bar: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false,
              },
              showInLegend: true,
              grouping: false,
            },
          },
          credits: {
            enabled: false,
          },
          legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            x: 90,
            width: '60%',
            maxWidth: '60%',
            itemMarginBottom: 5,
            itemStyle: {
              fontSize: '12px',
            },
            labelFormat: `{name} ({y})`,
          },
          tooltip: {
            formatter: function (this: any) {
              return `<span class="mb-2">${this.point.headerName}: ${this.key}</span><br> 
              <span>${this.point.pointName}: ${this.y}</span>`;
            },
            useHTML: true,
          },
          series: [
            {
              name: null,
              innerSize: '50%',
              data,
            },
          ],
        };
    
        Highcharts.chart(divId, { ...defaultOptions, ...additionalOptions } as any);
      }
}