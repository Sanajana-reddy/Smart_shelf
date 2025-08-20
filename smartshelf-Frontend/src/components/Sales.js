import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Sales() {
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Chart Data
  const salesChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales (₹)",
        data: [120000, 190000, 170000, 220000, 260000, 300000],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Sales Performance" },
    },
  };

  // Dummy Sales Data Table
  const salesData = [
    { month: "January", sales: "₹1,20,000", orders: 210, daily: [5000, 6000, 4000, 8000, 7500, 6500] },
    { month: "February", sales: "₹1,90,000", orders: 260, daily: [7000, 8000, 6000, 9000, 10000, 7500] },
    { month: "March", sales: "₹1,70,000", orders: 230, daily: [5500, 7000, 7200, 6500, 8000, 6000] },
    { month: "April", sales: "₹2,20,000", orders: 280, daily: [8000, 9500, 8700, 9100, 10000, 10500] },
    { month: "May", sales: "₹2,60,000", orders: 320, daily: [9000, 11000, 12000, 9500, 10000, 10500] },
    { month: "June", sales: "₹3,00,000", orders: 350, daily: [10000, 12000, 11500, 12500, 13000, 14000] },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sales Overview</h2>

      {/* Sales Chart */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <Line data={salesChartData} options={salesChartOptions} />
      </div>

      {/* Sales Summary Table */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <h3>Monthly Sales Data</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Month</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Sales</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Orders</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row, index) => (
              <tr
                key={index}
                onClick={() => setSelectedMonth(row)}
                style={{ cursor: "pointer", transition: "0.2s", borderBottom: "1px solid #ddd" }}
              >
                <td style={{ padding: "10px" }}>{row.month}</td>
                <td style={{ padding: "10px" }}>{row.sales}</td>
                <td style={{ padding: "10px" }}>{row.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Daily Sales */}
      {selectedMonth && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedMonth(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedMonth.month} - Daily Sales</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
              <thead>
                <tr style={{ background: "#eee" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Day</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Sales (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedMonth.daily.map((value, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Day {idx + 1}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>₹{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setSelectedMonth(null)}
              style={{ marginTop: "15px", padding: "8px 16px", border: "none", background: "#007bff", color: "#fff", borderRadius: "5px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;
