import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserDashboard() {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  // Per-store selected rating (for both submit & modify)
  const [selectedRatings, setSelectedRatings] = useState({});

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores");
      setStores(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitRating = async (storeId) => {
    const rating = selectedRatings[storeId];
    if (!rating) {
      alert("Please select a rating first.");
      return;
    }
    try {
      await api.post("/ratings/submit", {
        store_id: storeId,
        rating,
      });
      fetchStores();
      alert("Rating saved!");
    } catch (error) {
      console.log(error);
      alert("Failed to save rating.");
    }
  };

  const handleRatingChange = (storeId, value) => {
    setSelectedRatings((prev) => ({ ...prev, [storeId]: value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const submitPasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    try {
      await api.post("/auth/update-password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update password.";
      setPasswordError(msg);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredStores = (stores || []).filter((store) => {
    return (
      store.name.toLowerCase().includes(searchName.toLowerCase()) &&
      store.address.toLowerCase().includes(searchAddress.toLowerCase())
    );
  });

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1>User Dashboard</h1>
        <div className="topbar-actions">
          <button
            className="update-password-btn"
            onClick={() => setShowPasswordModal(true)}
          >
            Update Password
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="filter-box">
        <input
          placeholder="Search Store Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          placeholder="Search Address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
      </div>

      <div className="section">
        <h2>All Stores</h2>
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th>Address</th>
              <th>Overall Rating</th>
              <th>My Rating</th>
              <th>Rate / Modify</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>{store.overallRating || "N/A"}</td>
                <td>{store.userRating || "Not Rated"}</td>
                <td>
                  <select
                    value={selectedRatings[store.id] ?? String(store.userRating ||  "")}
                    onChange={(e) => handleRatingChange(store.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={String(n)}>
                        {n}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="submit-rating-btn"
                    onClick={() => submitRating(store.id)}
                  >
                    {store.userRating ? "Modify" : "Submit"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={closePasswordModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Update Password</h2>

            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />

            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />

            {passwordError && <p className="error-msg">{passwordError}</p>}
            {passwordSuccess && <p className="success-msg">{passwordSuccess}</p>}

            <div className="modal-actions">
              <button className="save-btn" onClick={submitPasswordUpdate}>
                Save Password
              </button>
              <button className="cancel-btn" onClick={closePasswordModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;