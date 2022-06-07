import React from 'react';
import LineChart from './LineChart';
import '../stylesheets/Etf.css'

function Etf({name, days, endDate, startDate, investment, horizont}) {
    let dates = [];
    let values = [];

    const profit = (start, end) => {
        return ((end / start) - 1) * 100;
    }

    const extractDays = (data) => {
        let keys = Object.keys(data);
        for (let k of keys) {
            if (k == startDate)
                break;
            values.push(profit(data[startDate]["4. close"], data[k]["4. close"]) / 100 * investment);
            dates.push(k);
        }
        return (<LineChart labels={dates.reverse()} values={values.reverse()} />);
    };

    return (
        <div className='etf-container'>
            <div className='etf-text-container text-justify'>
                {(!days || !endDate || !startDate || !investment) ? "Esperando API..." : `La rentabilidad para ${name} es del ${profit(days[startDate]["4. close"], days[endDate]["4. close"])}% (${profit(days[startDate]["4. close"], days[endDate]["4. close"]) / 100 * investment} dolares)`}
            </div>
            <div className='etf-chart'>
                {(days && endDate && startDate) ? extractDays(days) : "Graph should be here"}
            </div>
        </div>
    );
}

export default Etf;
