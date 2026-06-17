import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [averageRating, setAverageRating] = useState(0);
  const [users, setUsers] = useState([]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    const res = await api.get("/owner/dashboard");

    setAverageRating(
      res.data.averageRating
    );

    setUsers(
      res.data.users || []
    );

  } catch (error) {
    console.log(error);
  }
};

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const updatePassword = async () => {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordForm;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return alert("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await api.post(
        "/auth/update-password",
        {
          currentPassword,
          newPassword,
        }
      );

      alert("Password Updated");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordModal(false);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error updating password"
      );
    }
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1>Store Owner Dashboard</h1>

        <div className="topbar-actions">
          <button
            className="update-password-btn"
            onClick={() =>
              setShowPasswordModal(true)
            }
          >
            Update Password
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="cards">
        <div className="card">
          <h3>Average Store Rating</h3>
          <h2>
            {averageRating || 0}
          </h2>
        </div>
      </div>

      <div className="section">
        <h2>
          Users Who Submitted Ratings
        </h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>

       <tbody>
  {users.length > 0 ? (
    users.map((user, index) => (
      <tr key={index}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.rating}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>
        No Ratings Found
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>

      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowPasswordModal(false)
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2>Update Password</h2>

            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={
                passwordForm.currentPassword
              }
              onChange={
                handlePasswordChange
              }
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={
                passwordForm.newPassword
              }
              onChange={
                handlePasswordChange
              }
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={
                passwordForm.confirmPassword
              }
              onChange={
                handlePasswordChange
              }
            />

            <div className="modal-actions">
              <button
                className="save-btn"
                onClick={updatePassword}
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowPasswordModal(
                    false
                  )
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;