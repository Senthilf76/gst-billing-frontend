import { useState } from "react";

export default function TermsPage({ terms, setTerms }) {
  const [newTerm, setNewTerm] = useState("");

  const addTerm = () => {
    if (!newTerm.trim()) return;
    setTerms([...terms, newTerm]);
    setNewTerm("");
  };

  const removeTerm = (index) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Terms & Conditions</h2>

      <ul>
        {terms.map((term, index) => (
          <li key={index} style={{ marginBottom: "8px" }}>
            {term}
            <button
              onClick={() => removeTerm(index)}
              style={{ marginLeft: "10px" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "15px" }}>
        <input
          type="text"
          placeholder="Add new term"
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
          style={{ width: "60%" }}
        />
        <button onClick={addTerm} style={{ marginLeft: "10px" }}>
          Add
        </button>
      </div>
    </div>
  );
}
