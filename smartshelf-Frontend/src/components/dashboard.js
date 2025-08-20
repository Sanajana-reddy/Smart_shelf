import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { useNavigate } from "react-router-dom";
import '../style.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();
  
  // Dummy data for Phase A
  const dashboardData = {
    stats: {
      totalSales: "₹1,25,000",
      totalOrders: 256,
      totalProducts: 1024,
      lowStockItems: 5
    },
    monthlySales: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [65000, 85000, 75000, 95000, 115000, 125000]
    }
  };

  // Navigation handlers
  const handleViewSales = () => navigate('/sales');
  const handleViewOrders = () => navigate('/orders');
  const handleViewStock = () => navigate('/stock');

  const chartData = {
    labels: dashboardData.monthlySales.labels,
    datasets: [
      {
        label: "Monthly Sales",
        data: dashboardData.monthlySales.data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Sales Data" }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₹' + (value/1000) + 'K'
        }
      }
    }
  };

  // Reusable card component
  const StatCard = ({ title, value, onClick }) => (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease"
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", color: "#666" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#333" }}>{value}</p>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      
      {/* Summary Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px", 
        marginBottom: "30px" 
      }}>
        <StatCard 
          title="Total Sales" 
          value={dashboardData.stats.totalSales}
          onClick={handleViewSales}
        />
        <StatCard 
          title="Total Orders" 
          value={dashboardData.stats.totalOrders}
          onClick={handleViewOrders}
        />
        <StatCard 
          title="Stock Items" 
          value={dashboardData.stats.totalProducts}
          onClick={handleViewStock}
        />
      </div>

      {/* Sales Chart */}
      <div style={{ 
        height: "400px", 
        backgroundColor: "white", 
        padding: "20px", 
        borderRadius: "8px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)" 
      }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Dashboard;
