import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user)
    return (
      <div className="loading">
        <h2>Loading User Details...</h2>
      </div>
    );

  return (
    <div className="details-container">
      <div className="details-header">
        <button
          className="back-btn"
          onClick={() => navigate("/admin")}
        >
          ← Back
        </button>

        <h1>User Details</h1>
      </div>

      <div className="details-card">
        <div className="detail-row">
          <span>Name</span>
          <strong>{user.name}</strong>
        </div>

        <div className="detail-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="detail-row">
          <span>Address</span>
          <strong>{user.address}</strong>
        </div>

        <div className="detail-row">
          <span>Role</span>
          <strong>{user.role}</strong>
        </div>

        {user.role === "owner" && (
          <div className="detail-row">
            <span>Store Rating</span>
            <strong>{user.rating || "N/A"}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetails;