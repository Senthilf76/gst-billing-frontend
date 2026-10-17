
import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import "./Bill.css";

export default function Bill() {
  const billRef = useRef();

  /* ================= STATE ================= */

  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState("");
  const [buyer, setBuyer] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");

  const [items, setItems] = useState([
    {
      desc: "",
      sqft: 0,
      qty: 1,
      rate: 0,
      gst: 18,
    },
  ]);

  /* ================= FUNCTIONS ================= */

  const addRow = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        desc: "",
        sqft: 0,
        qty: 1,
        rate: 0,
        gst: 18,
      },
    ]);
  };

  const updateItem = (i, field, val) => {
    setItems((prevItems) =>
      prevItems.map((item, index) =>
        index === i
          ? {
            ...item,
            [field]:
              field === "desc" ? val : Number(val),
          }
          : item
      )
    );
  };

  /* ================= GST CALCULATIONS ================= */

  const getItemCalculations = (item) => {
    const sqft = Number(item.sqft) || 0;
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const gstRate = Number(item.gst) || 0;

    const totalSqft = sqft * qty;
    const amount = totalSqft * rate;
    const gstAmt = amount * (gstRate / 100);
    const cgst = gstAmt / 2;
    const sgst = gstAmt / 2;
    const total = amount + gstAmt;

    return {
      totalSqft,
      amount,
      gstRate,
      gstAmt,
      cgst,
      sgst,
      total,
    };
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + getItemCalculations(item).amount;
  }, 0);

  const totalGST = items.reduce((sum, item) => {
    return sum + getItemCalculations(item).gstAmt;
  }, 0);

  const totalCGST = totalGST / 2;
  const totalSGST = totalGST / 2;
  const total = subtotal + totalGST;

  /* ================= DOWNLOAD PDF ================= */

  const downloadPDF = () => {
    if (!billRef.current) return;

    html2pdf()
      .set({
        margin: 5,
        filename: `Invoice_${invoiceNo || "bill"}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(billRef.current)
      .save();
  };

  /* ================= UI ================= */

  return (
    <div className="page">
      {/* ================= CUSTOMER DETAILS ================= */}

      <div className="fill-ui">
        <div className="customer-card">
          <h2 className="card-title">Customer Details</h2>

          <div className="grid2">
            <div>
              <label>Invoice No *</label>
              <input
                className="rounded-input"
                placeholder="Enter invoice number"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </div>

            <div>
              <label>Customer Name *</label>
              <input
                className="rounded-input"
                placeholder="Enter customer name"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
              />
            </div>

            <div>
              <label>Mobile *</label>
              <input
                className="rounded-input"
                type="tel"
                placeholder="10 digit mobile number"
              />
            </div>

            <div>
              <label>Date</label>
              <input
                className="rounded-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <label>Address *</label>
          <textarea
            className="rounded-textarea"
            placeholder="Enter full address"
            value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)}
          />
        </div>

        {/* ================= ITEM ENTRY TABLE ================= */}

        <div className="items-card">
          <table className="entry-table">
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
              {items.map((it, i) => {
                const calc = getItemCalculations(it);

                return (
                  <tr key={i}>
                    <td>{i + 1}</td>

                    <td>
                      <input
                        className="table-input"
                        value={it.desc}
                        onChange={(e) =>
                          updateItem(i, "desc", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="table-input"
                        type="number"
                        min="0"
                        value={it.sqft}
                        onChange={(e) =>
                          updateItem(i, "sqft", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="table-input"
                        type="number"
                        min="0"
                        value={it.qty}
                        onChange={(e) =>
                          updateItem(i, "qty", e.target.value)
                        }
                      />
                    </td>

                    <td>{calc.totalSqft.toFixed(2)}</td>

                    <td>
                      <input
                        className="table-input"
                        type="number"
                        min="0"
                        value={it.rate}
                        onChange={(e) =>
                          updateItem(i, "rate", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <select
                        className="gst-select"
                        value={String(it.gst)}
                        onChange={(e) =>
                          updateItem(i, "gst", e.target.value)
                        }
                      >
                        <option value="18">18%</option>
                        <option value="9">9%</option>
                        <option value="0">0%</option>
                      </select>
                    </td>

                    <td>{calc.gstAmt.toFixed(2)}</td>

                    <td>{calc.amount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button
            type="button"
            className="add-row-btn"
            onClick={addRow}
          >
            + Add Row
          </button>

          <button type="button" onClick={downloadPDF}>
            Continue → Download Invoice
          </button>
        </div>
      </div>

      {/* ================= GST INVOICE PREVIEW ================= */}

      <div className="invoice-wrapper">
        <div ref={billRef} className="invoice">
          <h2 className="center">Tax Invoice</h2>

          {/* ================= COMPANY HEADER ================= */}

          <table className="header">
            <tbody>
              <tr>
                <td className="company">
                  <b>DRS Enterprises PVT.LTD</b>
                  <br />
                  NO.12,K.R Palayam Road
                  <br />
                  PUDUPEDU VILLADE,NEITHAVOYAL
                  <br />
                  MINJUR - 601203
                  <br />
                  GSTIN/UIN:33CYQPR1012K1ZB
                  <br />
                  State Name : Tamil Nadu
                </td>

                <td>
                  <table className="rightGrid">
                    <tbody>
                      <tr>
                        <td>
                          Invoice No.
                          <br />
                          <b>{invoiceNo}</b>
                        </td>
                        <td>
                          Dated
                          <br />
                          <b>{date}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Delivery Note</td>
                        <td>Mode/Terms of Payment</td>
                      </tr>
                      <tr>
                        <td>Reference No. &amp; Date</td>
                        <td>Other References</td>
                      </tr>
                      <tr>
                        <td>Buyer's Order No.</td>
                        <td>Dated</td>
                      </tr>
                      <tr>
                        <td>Dispatch Doc No.</td>
                        <td>Delivery Note Date</td>
                      </tr>
                      <tr>
                        <td>Dispatched through</td>
                        <td>Destination</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                <td>
                  <b>Consignee (Ship to)</b>
                  <br />
                  {buyer}
                  <br />
                  {buyerAddress}
                </td>
                <td>Terms of Delivery</td>
              </tr>

              <tr>
                <td colSpan="2">
                  <b>Buyer (Bill to)</b>
                  <br />
                  {buyer}
                  <br />
                  {buyerAddress}
                </td>
              </tr>
            </tbody>
          </table>

          {/* ================= INVOICE ITEMS ================= */}

          <table className="items">
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Description</th>
                <th></th>
                <th>Sqft</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>GST Rate</th>
                <th>GST Amount</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, i) => {
                const calc = getItemCalculations(it);

                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{it.desc}</td>
                    <td></td>
                    <td>{calc.totalSqft.toFixed(2)}</td>
                    <td>{Number(it.qty).toFixed(2)} Nos</td>
                    <td>{Number(it.rate).toFixed(2)}</td>
                    <td>{calc.gstRate}%</td>
                    <td>{calc.gstAmt.toFixed(2)}</td>
                    <td>{calc.total.toFixed(2)}</td>
                  </tr>
                );
              })}

              <tr className="bigSpace">
                <td colSpan="8"></td>
              </tr>

              <tr>
                <td colSpan="8" className="right">
                  Subtotal
                </td>
                <td>{subtotal.toFixed(2)}</td>
              </tr>

              <tr>
                <td colSpan="8" className="right">
                  CGST ({items.length ? (items.every((it) => Number(it.gst) === 0) ? 0 : "as applicable") : 0})
                </td>
                <td>{totalCGST.toFixed(2)}</td>
              </tr>

              <tr>
                <td colSpan="8" className="right">
                  SGST ({items.length ? (items.every((it) => Number(it.gst) === 0) ? 0 : "as applicable") : 0})
                </td>
                <td>{totalSGST.toFixed(2)}</td>
              </tr>

              <tr>
                <td colSpan="8" className="right">
                  <b>Grand Total</b>
                </td>
                <td>
                  <b>{total.toFixed(2)}</b>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ================= FOOTER ================= */}

          <div className="footer">
            <div className="declaration">
              <b>Declaration</b>
              <br />
              We declare that this invoice shows the actual price of the
              goods described and that all particulars are true and correct.
            </div>

            <div className="sign">
              for DRS Enterprises PVT.LTD
              <br />
              <br />
              <br />
              Authorised Signatory
            </div>
          </div>

          <p className="center small">
            This is a Computer Generated Invoice
          </p>
        </div>
      </div>
    </div>
  );
}
