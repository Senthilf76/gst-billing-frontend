import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import "./Bill.css";

export default function Bill() {

const billRef = useRef();

/* ================= STATE ================= */

const [invoiceNo,setInvoiceNo]=useState("");
const [date,setDate]=useState("");
const [buyer,setBuyer]=useState("");
const [buyerAddress,setBuyerAddress]=useState("");

const [items,setItems]=useState([
{desc:"",sqft:0,qty:1,rate:0}
]);

/* ================= FUNCTIONS ================= */

const addRow=()=>{
setItems([...items,{desc:"",sqft:0,qty:1,rate:0}])
}

const updateItem=(i,field,val)=>{
const arr=[...items];
arr[i][field]=val;
setItems(arr);
}

/* subtotal must include sqft */

const subtotal = items.reduce((s,it)=>s+(it.sqft*it.qty*it.rate),0);
const cgst=subtotal*0.09;
const sgst=subtotal*0.09;
const total=subtotal+cgst+sgst;

const downloadPDF=()=>{
html2pdf().set({
margin:5,
filename:`Invoice_${invoiceNo||"bill"}.pdf`,
html2canvas:{scale:2},
jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}
}).from(billRef.current).save();
};

/* ================= UI ================= */

return(
<div className="page">

{/* ================= FILLING UI ================= */}

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
onChange={(e)=>setInvoiceNo(e.target.value)}
/>
</div>

<div>
<label>Customer Name *</label>
<input
className="rounded-input"
placeholder="Enter customer name"
onChange={(e)=>setBuyer(e.target.value)}
/>
</div>

<div>
<label>Mobile *</label>
<input
className="rounded-input"
placeholder="10 digit mobile number"
/>
</div>

<div>
<label>Date</label>
<input
className="rounded-input"
placeholder="Invoice Date"
onChange={(e)=>setDate(e.target.value)}
/>
</div>

</div>

<label>Address *</label>
<textarea
className="rounded-textarea"
placeholder="Enter full address"
onChange={(e)=>setBuyerAddress(e.target.value)}
/>

</div>

{/* ===== ITEM ENTRY TABLE ===== */}

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

{items.map((it,i)=>{

const totalSqft = it.sqft * it.qty;
const amount = totalSqft * it.rate;
const gstAmt = amount * 0.18;

return(
<tr key={i}>

<td>{i+1}</td>

<td>
<input
className="table-input"
onChange={(e)=>updateItem(i,"desc",e.target.value)}
/>
</td>

{/* ✅ USER CAN ENTER SQFT */}

<td>
<input
className="table-input"
type="number"
value={it.sqft}
onChange={(e)=>updateItem(i,"sqft",Number(e.target.value))}
/>
</td>

<td>
<input
className="table-input"
type="number"
value={it.qty}
onChange={(e)=>updateItem(i,"qty",Number(e.target.value))}
/>
</td>

<td>{totalSqft.toFixed(2)}</td>

<td>
<input
className="table-input"
type="number"
value={it.rate}
onChange={(e)=>updateItem(i,"rate",Number(e.target.value))}
/>
</td>

<td>
<select className="gst-select">
<option>18%</option>
<option>9%</option>
<option>0%</option>
</select>
</td>

<td>{gstAmt.toFixed(2)}</td>

<td>{amount.toFixed(2)}</td>

</tr>
);
})}

</tbody>
</table>

<button className="add-row-btn" onClick={addRow}>
+ Add Row
</button>

<button onClick={downloadPDF}>
Continue → Download Invoice
</button>

</div>

</div>

{/* ================= GST INVOICE PREVIEW ================= */}

<div className="invoice-wrapper">

<div ref={billRef} className="invoice">

<h2 className="center">Tax Invoice</h2>

<table className="header">
<tbody>

<tr>
<td className="company">
<b>DRS Enterprises PVT.LTD</b><br/>
NO.12,K.R Palayam Road<br/>
PUDUPEDU VILLADE,NEITHAVOYAL<br/>
MINJUR - 601203<br/>
GSTIN/UIN:33CYQPR1012K1ZB<br/>
State Name : Tamil Nadu
</td>

<td> <table className="rightGrid"> <tbody> <tr> <td>Invoice No.<br/><b>{invoiceNo}</b></td> <td>Dated<br/><b>{date}</b></td> </tr> <tr><td>Delivery Note</td><td>Mode/Terms of Payment</td></tr> <tr><td>Reference No. & Date</td><td>Other References</td></tr> <tr><td>Buyer's Order No.</td><td>Dated</td></tr> <tr><td>Dispatch Doc No.</td><td>Delivery Note Date</td></tr> <tr><td>Dispatched through</td><td>Destination</td></tr> </tbody> </table> </td> </tr>

<tr>
<td>
<b>Consignee (Ship to)</b><br/>
{buyer}<br/>
{buyerAddress}
</td>
<td>Terms of Delivery</td>
</tr>

<tr>
<td colSpan="2">
<b>Buyer (Bill to)</b><br/>
{buyer}<br/>
{buyerAddress}
</td>
</tr>

</tbody>
</table>

{/* ITEMS TABLE */}

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
<th>Amount</th>
</tr>
</thead>

<tbody>

{items.map((it,i)=>{

const amount = it.sqft * it.qty * it.rate;

return(
<tr key={i}>
<td>{i+1}</td>
<td>{it.desc}</td>
<td></td>
<td>{it.sqft.toFixed(2)}</td>
<td>{it.qty.toFixed(2)} Nos</td>
<td>{it.rate.toFixed(2)}</td>
<td>18%</td>
<td>{amount.toFixed(2)}</td>
</tr>
)
})}

<tr className="bigSpace"><td colSpan="8"></td></tr>

<tr>
<td colSpan="7" className="right">CGST 9%</td>
<td>{cgst.toFixed(2)}</td>
</tr>

<tr>
<td colSpan="7" className="right">SGST 9%</td>
<td>{sgst.toFixed(2)}</td>
</tr>

<tr>
<td colSpan="7" className="right"><b>Total</b></td>
<td><b>{total.toFixed(2)}</b></td>
</tr>

</tbody>
</table>

<div className="footer">

<div className="declaration">
<b>Declaration</b><br/>
We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
</div>



<div className="sign">
for DRS Enterprises PVT.LTD<br/><br/><br/>
Authorised Signatory
</div>

</div>
<p className="center small"></p>

<p className="center small">This is a Computer Generated Invoice</p>

</div>
</div>

</div>
)
}