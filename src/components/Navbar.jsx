export default function Navbar({ onLogout }) {
  return (
    <div style={styles.navbar}>
      <h3 style={{ margin: 0 }}>GST Billing System</h3>
      <button onClick={onLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    height: "50px",
    backgroundColor: "#0b5ed7",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  logoutBtn: {
    background: "white",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};
