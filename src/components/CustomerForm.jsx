import { useState, useEffect } from "react";

export default function CustomerForm({ customer, setCustomer }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!customer.name?.trim()) {
      newErrors.name = "Customer name is required";
    }

    if (!customer.mobile?.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(customer.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!customer.address?.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // live validation
  useEffect(() => {
    validate();
    // eslint-disable-next-line
  }, [customer]);

  const update = (field, value) => {
    setCustomer({
      ...customer,
      [field]: value,
    });
  };

  return (
    <div className="card">
      <h3>Customer Details</h3>

      <div className="form-grid">
        {/* Customer Name */}
        <div className="form-field">
          <label>Customer Name <span>*</span></label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Enter customer name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Mobile */}
        <div className="form-field">
          <label>Mobile <span>*</span></label>
          <input
            type="tel"
            value={customer.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            placeholder="10 digit mobile number"
          />
          {errors.mobile && <span className="error">{errors.mobile}</span>}
        </div>

        {/* GST */}
        <div className="form-field">
          <label>GST No (optional)</label>
          <input
            type="text"
            value={customer.gst}
            onChange={(e) => update("gst", e.target.value)}
            placeholder="GSTIN"
          />
        </div>
      </div>

      {/* Address */}
      <div className="form-field">
        <label>Address <span>*</span></label>
        <textarea
          rows={3}
          value={customer.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Enter full address"
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>
    </div>
  );
}
