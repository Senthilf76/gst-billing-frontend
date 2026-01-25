export default function Sidebar({ role, active, setActive }) {
  return (
    <div style={styles.sidebar}>
      <MenuItem
        label="Invoice"
        active={active === "invoice"}
        onClick={() => setActive("invoice")}
      />
       <MenuItem
        label="Terms & Conditions"
        active={active === "terms"}
        onClick={() => setActive("terms")}
      />

      {role === "admin" && (
        <MenuItem
          label="GST Report"
          active={active === "gst"}
          onClick={() => setActive("gst")}
        />
      )}
    </div>
  );
}

function MenuItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px",
        cursor: "pointer",
        backgroundColor: active ? "#e7f1ff" : "transparent",
        fontWeight: active ? "bold" : "normal",
      }}
    >
      {label}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    borderRight: "1px solid #ddd",
    height: "calc(100vh - 50px)",
  },
};
