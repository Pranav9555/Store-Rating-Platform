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
  const [storeForm, setStoreForm] =
  useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const [storeSearch, setStoreSearch] = useState("");

  const [searchName, setSearchName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [emailSearch, setEmailSearch] = useState("");
const [addressSearch, setAddressSearch] = useState("");
const [roleSearch, setRoleSearch] = useState("");

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
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
const res = await api.get(
  `/admin/users?name=${searchName}&email=${emailSearch}&address=${addressSearch}&role=${roleSearch}&sort=name&order=${sortOrder}`
);

      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

const fetchStores = async () => {
  try {
    const res = await api.get(
      `/admin/stores?name=${storeSearch}&address=${storeAddress}&sort=name&order=${storeSort}`
    );

    setStores(res.data.stores);
  } catch (error) {
    console.log(error);
  }
};

  const addUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/users", userForm);

      alert("User Added Successfully");

      fetchUsers();

      setUserForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  fetchUsers();
}, [
  searchName,
  emailSearch,
  addressSearch,
  roleSearch,
  sortOrder,
]);

  const addStore = async (e) => {
  e.preventDefault();

  try {
    await api.post(
      "/admin/stores",
      storeForm
    );

    alert("Store Added");

    fetchStores();
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchStores();
}, [
  storeSearch,
  storeAddress,
  storeSort,
]);

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1>StoreRate Admin</h1>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

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

 

      <div className="filter-box">
  <input
    placeholder="Search Name"
    value={searchName}
    onChange={(e) =>
      setSearchName(e.target.value)
    }
  />

  <input
    placeholder="Search Email"
    value={emailSearch}
    onChange={(e) =>
      setEmailSearch(e.target.value)
    }
  />

  <input
    placeholder="Search Address"
    value={addressSearch}
    onChange={(e) =>
      setAddressSearch(e.target.value)
    }
  />

  <select
    value={roleSearch}
    onChange={(e) =>
      setRoleSearch(e.target.value)
    }
  >
    <option value="">
      All Roles
    </option>

    <option value="admin">
      Admin
    </option>

    <option value="user">
      User
    </option>

    <option value="owner">
      Owner
    </option>
  </select>
</div>

      <div className="section">
        <h2>Users</h2>

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
      
      <div className="section">
        <h2>Add User</h2>

        <form onSubmit={addUser}>
          <input
            placeholder="Name"
            value={userForm.name}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            value={userForm.email}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={userForm.password}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                password: e.target.value,
              })
            }
          />

          <input
            placeholder="Address"
            value={userForm.address}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                address: e.target.value,
              })
            }
          />

          <select
            value={userForm.role}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                role: e.target.value,
              })
            }
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Add User</button>
        </form>
      </div>


<div className="filter-box">
  <input
    placeholder="Store Name"
    value={storeSearch}
    onChange={(e) =>
      setStoreSearch(e.target.value)
    }
  />

  <input
    placeholder="Store Address"
    value={storeAddress}
    onChange={(e) =>
      setStoreAddress(e.target.value)
    }
  />

  <select
    value={storeSort}
    onChange={(e) =>
      setStoreSort(e.target.value)
    }
  >
    <option value="asc">ASC</option>
    <option value="desc">DESC</option>
  </select>

  <button onClick={fetchStores}>
    Search
  </button>
</div>
<div className="section">
  <h2>Add Store</h2>

  <form onSubmit={addStore}>
    <input
      placeholder="Store Name"
      value={storeForm.name}
      onChange={(e) =>
        setStoreForm({
          ...storeForm,
          name: e.target.value,
        })
      }
    />

    <input
      placeholder="Store Email"
      value={storeForm.email}
      onChange={(e) =>
        setStoreForm({
          ...storeForm,
          email: e.target.value,
        })
      }
    />

    <input
      placeholder="Store Address"
      value={storeForm.address}
      onChange={(e) =>
        setStoreForm({
          ...storeForm,
          address: e.target.value,
        })
      }
    />

    <input
      placeholder="Owner ID"
      value={storeForm.owner_id}
      onChange={(e) =>
        setStoreForm({
          ...storeForm,
          owner_id: e.target.value,
        })
      }
    />

    <button type="submit">
      Add Store
    </button>
  </form>
</div>
      <div className="section">
        <h2>Stores</h2>

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
    </div>
  );
}

export default AdminDashboard;
