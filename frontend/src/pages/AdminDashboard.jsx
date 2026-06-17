import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [storeSearch, setStoreSearch] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeSort, setStoreSort] = useState("asc");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(
        `/admin/users?name=${searchName}&email=${emailSearch}&address=${addressSearch}&role=${roleSearch}&sort=name&order=${sortOrder}`,
      );
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get(
        `/admin/stores?name=${storeSearch}&address=${storeAddress}&sort=name&order=${storeSort}`,
      );
      setStores(res.data.stores);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchName, emailSearch, addressSearch, roleSearch, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [storeSearch, storeAddress, storeSort]);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users", userForm);
      alert("User Added Successfully");
      fetchUsers();
      fetchDashboard();
      setUserForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
      setShowUserModal(false);
    } catch (error) {
alert(
    error.response?.data?.message ||
    "Something went wrong"
  );    }
  };

  const addStore = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/stores", storeForm);
      alert("Store Added");
      fetchStores();
      fetchDashboard();
      setStoreForm({ name: "", email: "", address: "", owner_id: "" });
      setShowStoreModal(false);
    } catch (error) {
alert(
    error.response?.data?.message ||
    "Something went wrong"
  );    }
  };

  return (
    <div className="dashboard">
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: #fff;
          border-radius: 10px;
          padding: 32px 28px 24px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }
        .modal h2 {
          margin: 0 0 4px;
          font-size: 1.2rem;
          font-weight: 700;
        }
        .modal input,
        .modal select {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.95rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s;
        }
        .modal input:focus,
        .modal select:focus {
          border-color: #6366f1;
        }
        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 4px;
        }
        .modal-actions .save-btn {
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 9px 22px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
        }
        .modal-actions .save-btn:hover {
          background: #4f46e5;
        }
        .modal-actions .cancel-btn {
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 6px;
          padding: 9px 18px;
          font-size: 0.95rem;
          cursor: pointer;
        }
        .modal-actions .cancel-btn:hover {
          background: #e5e7eb;
        }
        .modal-close {
          position: absolute;
          top: 14px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          color: #6b7280;
          line-height: 1;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .section-header h2 {
          margin: 0;
        }
        .add-btn {
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 8px 18px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .add-btn:hover {
          background: #4f46e5;
        }
      `}</style>

      <header className="topbar">
        <h1>StoreRate Admin</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      {/* Stats Cards */}
      <div className="cards">
        <div className="card">
          <h3>Total Users</h3>
          <h2>{stats.totalUsers || 0}</h2>
        </div>
        <div className="card">
          <h3>Total Stores</h3>
          <h2>{stats.totalStores || 0}</h2>
        </div>
        <div className="card">
          <h3>Total Ratings</h3>
          <h2>{stats.totalRatings || 0}</h2>
        </div>
      </div>

      {/* Users Section */}
      <div className="filter-box">
        <input
          placeholder="Search Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          placeholder="Search Email"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
        />
        <input
          placeholder="Search Address"
          value={addressSearch}
          onChange={(e) => setAddressSearch(e.target.value)}
        />
        <select
          value={roleSearch}
          onChange={(e) => setRoleSearch(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Users</h2>
          <button className="add-btn" onClick={() => setShowUserModal(true)}>
            + Add User
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.address}</td>
                <td>
                  <button onClick={() => navigate(`/admin/user/${user.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stores Section */}
      <div className="filter-box">
        <input
          placeholder="Store Name"
          value={storeSearch}
          onChange={(e) => setStoreSearch(e.target.value)}
        />
        <input
          placeholder="Store Address"
          value={storeAddress}
          onChange={(e) => setStoreAddress(e.target.value)}
        />
        <select
          value={storeSort}
          onChange={(e) => setStoreSort(e.target.value)}
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Stores</h2>
          <button className="add-btn" onClick={() => setShowStoreModal(true)}>
            + Add Store
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.averageRating || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowUserModal(false)}
            >
              ✕
            </button>
            <h2>Add New User</h2>

            <form
              onSubmit={addUser}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                placeholder="Name"
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({ ...userForm, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Email"
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
                required
              />
              <input
                placeholder="Address"
                value={userForm.address}
                onChange={(e) =>
                  setUserForm({ ...userForm, address: e.target.value })
                }
              />
              <select
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Store Modal */}
      {showStoreModal && (
        <div className="modal-overlay" onClick={() => setShowStoreModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowStoreModal(false)}
            >
              ✕
            </button>
            <h2>Add New Store</h2>

            <form
              onSubmit={addStore}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                placeholder="Store Name"
                value={storeForm.name}
                onChange={(e) =>
                  setStoreForm({ ...storeForm, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Store Email"
                type="email"
                value={storeForm.email}
                onChange={(e) =>
                  setStoreForm({ ...storeForm, email: e.target.value })
                }
              />
              <input
                placeholder="Store Address"
                value={storeForm.address}
                onChange={(e) =>
                  setStoreForm({ ...storeForm, address: e.target.value })
                }
                required
              />
              <input
                placeholder="Owner ID"
                value={storeForm.owner_id}
                onChange={(e) =>
                  setStoreForm({ ...storeForm, owner_id: e.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowStoreModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
