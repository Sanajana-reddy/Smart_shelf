import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [120, 190, 170, 220, 260, 300],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Sales Data" }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* Quick Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ background: "#eee", padding: "20px", borderRadius: "8px", flex: 1 }}>
          <h3>Total Sales</h3>
          <p>₹1,25,000</p>
        </div>
        <div style={{ background: "#eee", padding: "20px", borderRadius: "8px", flex: 1 }}>
          <h3>Orders</h3>
          <p>256</p>
        </div>
        <div style={{ background: "#eee", padding: "20px", borderRadius: "8px", flex: 1 }}>
          <h3>Stock Items</h3>
          <p>1,024</p>
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Dashboard;
