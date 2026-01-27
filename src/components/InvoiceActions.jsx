import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function InvoiceActions({
  rows,
  summary,
  customer,
  quotationNo,
  terms = [],
}) {

  // ================= QUOTATION NUMBER =================
  const generateQuotationNo = () => {
    const key = "QTN_COUNTER";
    let count = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, count);
    return `QTN-${String(count).padStart(4, "0")}`;
  };

  const quotationNumber = quotationNo || generateQuotationNo();

  // ================= SAVE TO DATABASE =================
  const saveInvoice = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/invoices`,
        {
          quotation_no: quotationNumber,
          customer_name: customer.name || "NIL",
          customer_address: customer.address || "NIL",
          customer_mobile: customer.mobile || "NIL",
          customer_gst: customer.gst || "NIL",
          date: new Date().toISOString().slice(0, 10),
          subtotal: summary.subtotal,
          gst_total: summary.totalGST,
          transport: summary.transport,
          grand_total: summary.grandTotal,
          items: rows,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      alert(`Quotation saved: ${quotationNumber}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save quotation");
    }
  };

  // ================= HEADER =================
  const drawHeader = (doc) => {
    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, 194, 281);

    doc.addImage(logo, "PNG", 14, 14, 30, 14);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DRS Enterprises", 60, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("No.12, K.R. Palayam Road", 60, 24);
    doc.text("Pudupedu Village, Neithavoyal Minjur - 601203", 60, 29);
    doc.text("Phone: 74185 66946, 74010 14854, 90436 31741", 60, 34);
    doc.text("GST: applied", 60, 39);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("BILL-Details", 190, 18, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 190, 25, { align: "right" });
    doc.text(`Name : ${customer.name || "NIL"}`, 190, 31, { align: "right" });

    doc.line(12, 44, 196, 44);
  };

  // ================= CREATE PDF =================
  const createPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    drawHeader(doc);

    autoTable(doc, {
      startY: 48,
      margin: { left: 12, right: 12 },
      theme: "grid",
      head: [[
        "#", "Description", "Sqft", "Qty",
        "Total Sqft", "Rate", "GST %", "GST Amt", "Amount"
      ]],
      body: rows.map((r, i) => [
        i + 1,
        r.description || "NIL",
        r.sqft || 0,
        r.qty || 0,
        r.totalSqft || 0,
        r.rate || 0,
        `${r.gst || 0}%`,
        Number(r.gstAmount || 0).toFixed(2),
        Number(r.finalAmount || 0).toFixed(2),
      ]),
      styles: { fontSize: 9, halign: "center" },
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: 255,
        fontStyle: "bold",
      },
      didDrawPage: () => drawHeader(doc),
    });

    let y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(9);
    doc.text("Subtotal :", 140, y);
    doc.text(summary.subtotal.toFixed(2), 190, y, { align: "right" }); y += 6;

    doc.text("GST Total :", 140, y);
    doc.text(summary.totalGST.toFixed(2), 190, y, { align: "right" }); y += 6;

    doc.text("Transport :", 140, y);
    doc.text(summary.transport.toFixed(2), 190, y, { align: "right" }); y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Grand Total :", 140, y);
    doc.text(summary.grandTotal.toFixed(2), 190, y, { align: "right" });
    doc.setFont("helvetica", "normal");

    y += 14;
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", 14, y); y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Name : ${customer.name}`, 14, y); y += 6;
    doc.text(`Address : ${customer.address}`, 14, y, { maxWidth: 120 }); y += 10;
    doc.text("Mobile : ************", 14, y); y += 6;
    doc.text("GST : ************", 14, y);

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 14, y); y += 6;
    doc.setFont("helvetica", "normal");
    terms.forEach((t, i) => {
      doc.text(`${i + 1}. ${t}`, 14, y, { maxWidth: 120 });
      y += 6;
    });

    return doc;
  };

  // ================= ACTIONS =================
  const downloadPDF = () => {
    const doc = createPDF();
    doc.save(`${quotationNumber}.pdf`);
  };

  const printPDF = () => {
    const doc = createPDF();
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div className="actions no-print">
      <button onClick={saveInvoice}>Save</button>
      <button onClick={downloadPDF}>Download PDF</button>
      <button onClick={printPDF}>Print PDF</button>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}
