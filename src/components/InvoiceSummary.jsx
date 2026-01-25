import { useEffect, useState } from "react";

export default function InvoiceSummary({ rows, setSummary }) {
  const [transport, setTransport] = useState(0);

  const subtotal = rows.reduce(
    (sum, r) => sum + (r.finalAmount - r.gstAmount),
    0
  );

  const totalGST = rows.reduce((sum, r) => sum + r.gstAmount, 0);
  const grandTotal = subtotal + totalGST + Number(transport);

  useEffect(() => {
    setSummary({
      subtotal,
      totalGST,
      transport: Number(transport),
      grandTotal,
    });
  }, [subtotal, totalGST, transport, grandTotal, setSummary]);

  return (
    <div className="invoice-summary">
      <div className="terms">
        <h4>Terms & Conditions</h4>
        <p>1. 70% advance payment</p>
        <p>2. Delivery within 15 days</p>
      </div>

      <div className="totals">
        <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
        <p>GST Total: ₹ {totalGST.toFixed(2)}</p>

        <p>
          Transport:
          <input
            type="number"
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
            style={{ width: "80px", marginLeft: "10px" }}
          />
        </p>

        <h3>Grand Total: ₹ {grandTotal.toFixed(2)}</h3>
      </div>
    </div>
  );
}
