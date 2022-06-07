import {React, useMemo} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
};

export default function LineChart({labels, values}) {
    const data = useMemo(function () {
        return {
            datasets: [
                {
                    data: values,
                }
            ],
            labels,
        };
    }, []);
    return <Line data={data} options={options} />;
}
