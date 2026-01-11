import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import type { Expense } from '../types/expense';
import { CATEGORY_COLORS, CATEGORIES } from '../utils/constants';
import { getCategoryTotal } from '../utils/helpers';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

interface ChartsProps {
  expenses: Expense[];
  isDark: boolean;
}

export function CategoryPieChart({ expenses, isDark }: ChartsProps) {
  const categoryData = CATEGORIES.map((cat) => getCategoryTotal(expenses, cat)).filter(
    (val) => val > 0
  );
  const categoryLabels = CATEGORIES.filter((cat) => getCategoryTotal(expenses, cat) > 0);

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryData,
        backgroundColor: categoryLabels.map((cat) => CATEGORY_COLORS[cat]),
        borderColor: isDark ? '#1f2937' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDark ? '#e5e7eb' : '#374151',
          padding: 15,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#1f2937',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      {categoryData.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <div className={`h-full flex items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}

export function CategoryBarChart({ expenses, isDark }: ChartsProps) {
  const categoryData = CATEGORIES.map((cat) => getCategoryTotal(expenses, cat));

  const data = {
    labels: CATEGORIES,
    datasets: [
      {
        label: 'Amount (₹)',
        data: categoryData,
        backgroundColor: CATEGORIES.map((cat) => CATEGORY_COLORS[cat] + 'CC'),
        borderColor: CATEGORIES.map((cat) => CATEGORY_COLORS[cat]),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#1f2937',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          callback: function (value: any) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  );
}

export function TrendLineChart({ expenses, isDark }: ChartsProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyTotals = last7Days.map((date) =>
    expenses.filter((e) => e.date === date).reduce((sum, e) => sum + e.amount, 0)
  );

  const labels = last7Days.map((date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Daily Spending',
        data: dailyTotals,
        borderColor: '#3b82f6',
        backgroundColor: isDark ? '#3b82f680' : '#3b82f640',
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#1f2937',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          callback: function (value: any) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
}
