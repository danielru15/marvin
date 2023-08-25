import React from "react";
import { Chart } from "react-google-charts";



export function PieCard({data,titulo}) {
    const options = {
        title:titulo,
        sliceVisibilityThreshold: 0.2, // 20%
      };
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"100%"}
    />
  );
}