import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function OrdersChart({ labels, datasets, options = {} }) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Orders/Revenue Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            // Check if the dataset represents currency
            if (datasets.some(d => d.isCurrency)) {
              return '₹' + (value/1000) + 'K';
            }
            return value;
          }
        }
      }
    }
  };

  const chartData = {
    labels,
    datasets: datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor || 'rgb(75, 192, 192)',
      backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)',
      tension: 0.3,
      ...dataset
    }))
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Line data={chartData} options={{ ...defaultOptions, ...options }} />
    </div>
  );
}

OrdersChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  datasets: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    isCurrency: PropTypes.bool
  })).isRequired,
  options: PropTypes.object
};

export default OrdersChart;
