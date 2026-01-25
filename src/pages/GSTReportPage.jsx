import { useState } from "react";
import axios from "axios";

export default function GSTReportPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(false);

  // ✅ SAFE INITIAL STATE
  const [report, setReport] = useState({
    invoices: [],
    effective_taxable: 0,
    effective_gst: 0,
    effective_total: 0,
  });

  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://127.0.0.1:8000/api/gst/monthly?year=${year}&month=${month}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      // ✅ BACKEND RESPONSE SAFETY
      setReport({
        invoices: res.data.invoices || [],
        effective_taxable: res.data.effective_taxable || 0,
        effective_gst: res.data.effective_gst || 0,
        effective_total: res.data.effective_total || 0,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load GST report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Monthly GST Report</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{ marginLeft: "10px" }}
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button onClick={fetchReport} style={{ marginLeft: "10px" }}>
          Generate
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* ✅ SUMMARY */}
      {!loading && (
        <table border="1" cellPadding="10" style={{ marginBottom: "20px" }}>
          <tbody>
            <tr>
              <td>Taxable Amount</td>
              <td>{report.effective_taxable.toFixed(2)}</td>
            </tr>
            <tr>
              <td>GST Amount</td>
              <td>{report.effective_gst.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total Amount</td>
              <td>{report.effective_total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* ✅ INVOICE LIST (SAFE MAP) */}
      {report.invoices.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Taxable</th>
              <th>GST</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {report.invoices.map((inv) => (
              <tr key={inv.invoice_no}>
                <td>{inv.invoice_no}</td>
                <td>{inv.date}</td>
                <td>{inv.taxable.toFixed(2)}</td>
                <td>{inv.gst.toFixed(2)}</td>
                <td>{inv.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
