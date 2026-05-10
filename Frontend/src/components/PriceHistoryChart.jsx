import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceHistoryChart = ({ gameId, API_URL }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/games/${gameId}/history`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching price history:', err);
        setLoading(false);
      });
  }, [gameId, API_URL]);

  if (loading) {
    return <div className="text-center text-xs text-gray-500 py-4">Cargando gráfica...</div>;
  }

  if (history.length === 0) {
    return null;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        display: false,
        min: Math.min(...history.map(h => parseFloat(h.precio))) - 5,
        max: Math.max(...history.map(h => parseFloat(h.precio))) + 5,
      },
      x: {
        display: false,
      }
    },
    elements: {
      line: {
        tension: 0.4, // Curva suave
      }
    }
  };

  const labels = history.map(h => {
    const d = new Date(h.fecha);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Precio (€)',
        data: history.map(h => parseFloat(h.precio)),
        borderColor: '#22d3ee', // cyan-400
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(168, 85, 247, 1)', // purple-500
      },
    ],
  };

  return (
    <div className="h-24 w-full mt-2 bg-gray-900/30 rounded px-2 pt-2 pb-1 border border-gray-700/50">
      <p className="text-[10px] text-gray-400 mb-1 text-center font-semibold tracking-wider">EVOLUCIÓN 30 DÍAS</p>
      <div className="h-16">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default PriceHistoryChart;
