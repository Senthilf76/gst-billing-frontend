import { useState } from "react";
import CustomerForm from "../components/CustomerForm";
import InvoiceTable from "../components/InvoiceTable";
import InvoiceSummary from "../components/InvoiceSummary";
import InvoiceActions from "../components/InvoiceActions";
import "../styles/invoice.css";

export default function InvoicePage() {
  // 🔹 STEP CONTROL
  const [step, setStep] = useState(1); // 1 = Customer, 2 = Invoice

  const [rows, setRows] = useState([]);

  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    gst: "",
  });

  const [summary, setSummary] = useState({
    subtotal: 0,
    totalGST: 0,
    transport: 0,
    grandTotal: 0,
  });

  const [terms] = useState([
    "Customer will be billed after indicating the acceptance of this quote.",
    "Payment of 70% will be due prior to delivery of goods.",
    "Pinned Glass white will be fixed with 4mm thickness.",
    "Extra charges applicable for colour Glass.",
    "Mesh charges Rs 80 per sqft is applicable.",
  ]);

  return (
    <div className="invoice-container">

      {/* ================= STEP 1 — CUSTOMER DETAILS ================= */}
      {step === 1 && (
        <div className="step-page">
          <h1>DRS Enterperies PVT Ltd.</h1>

          <CustomerForm
            customer={customer}
            setCustomer={setCustomer}
          />

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setStep(2)}
              disabled={!customer.name}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2 — INVOICE & ACTIONS ================= */}
      {step === 2 && (
        <div className="step-page">
          <button
            onClick={() => setStep(1)}
            style={{ marginBottom: "15px" }}
          >
            ← Back to Customer
          </button>

          <InvoiceTable rows={rows} setRows={setRows} />
          <InvoiceSummary rows={rows} setSummary={setSummary} />

          <InvoiceActions
            rows={rows}
            summary={summary}
            customer={customer}
            terms={terms}
          />
        </div>
      )}
    </div>
  );
}
