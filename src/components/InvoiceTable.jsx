import { useEffect } from "react";

export default function InvoiceTable({ rows, setRows }) {
  useEffect(() => {
  if (rows.length === 0) {
    setRows([
    {
      description: "",
      sqft: 0,
      qty: 1,
      rate: 0,
      gst: 18,
      totalSqft: 0,
      gstAmount: 0,
      finalAmount: 0,
    },
  ]);
 }
}, [rows, setRows]);

  const calculateRow = (row) => {
    const totalSqft = row.sqft * row.qty;
    const baseAmount = totalSqft * row.rate;
    const gstAmount = (baseAmount * row.gst) / 100;

    return {
      ...row,
      totalSqft,
      gstAmount,
      finalAmount: baseAmount + gstAmount,
    };
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = Number.isNaN(Number(value)) ? value : Number(value);
    updated[index] = calculateRow(updated[index]);
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        description: "",
        sqft: 0,
        qty: 1,
        rate: 0,
        gst: 18,
        totalSqft: 0,
        gstAmount: 0,
        finalAmount: 0,
      },
    ]);
  };

  return (
    <>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description (W × H)</th>
            <th>Sqft</th>
            <th>Qty</th>
            <th>Total Sqft</th>
            <th>Rate</th>
            <th>GST %</th>
            <th>GST Amt</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>

              <td>
                <input
                  value={row.description}
                  onChange={(e) =>
                    updateRow(i, "description", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={row.sqft}
                  onChange={(e) => updateRow(i, "sqft", e.target.value)}
                />
              </td>

              <td>
                <input
                  type="number"
                  value={row.qty}
                  onChange={(e) => updateRow(i, "qty", e.target.value)}
                />
              </td>

              <td>{row.totalSqft.toFixed(2)}</td>

              <td>
                <input
                  type="number"
                  value={row.rate}
                  onChange={(e) => updateRow(i, "rate", e.target.value)}
                />
              </td>

              <td>
                <select
                  value={row.gst}
                  onChange={(e) => updateRow(i, "gst", e.target.value)}
                >
                   <option value={0}>0</option>
                  <option value={9}>9%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                </select>
              </td>

              <td>{row.gstAmount.toFixed(2)}</td>
              <td>{row.finalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="no-print" onClick={addRow}>
        + Add Row
      </button>
    </>
  );
}
