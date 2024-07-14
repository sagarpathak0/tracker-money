import "../App.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";

function Home() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoggedInUser(user);
      getTransactions().then((transactions) => {
        setTransactions(transactions);
      });
    } else {
      navigate("/login");
    }
  }, []);

  async function deleteTransaction(id) {
    const url = `https://tracker-money-api.vercel.app/transactions/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    });
    if (response.ok) {
      setTransactions(transactions.filter(transaction => transaction._id !== id));
    } else {
      console.error(response.statusText);
    }
  }

  async function getTransactions() {
    const url = `https://tracker-money-api.vercel.app/transactions/${localStorage.getItem("user")}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }

  function addnewtransaction(ev) {
    ev.preventDefault();
    if (!name || !description || !datetime) {
      handleError("Please fill in all the fields.");
    } else {
      const url = "https://tracker-money-api.vercel.app/transaction";
      const price = name.split(" ")[0];
      fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          user: localStorage.getItem("user"),
          price,
          name: name.substring(price.length + 1),
          description,
          datetime,
        }),
      }).then((response) => {
        response.json().then((json) => {
          setName("");
          setDatetime("");
          setDescription("");
          setTransactions([...transactions, json]);
        });
      });
    }
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];

  const navigate = useNavigate();

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="container">
      <button onClick={handleLogout} className="glow-on-hover">
          Logout
        </button>
      <header>
        <h2 className="home_user">{loggedInUser}</h2>
        <h2>
          ${balance}
          <span>.{fraction}</span>
        </h2>
      </header>
      <main>
        <form onSubmit={addnewtransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder={"+200 new Samsung TV"}
            />
            <input
              type="datetime-local"
              value={datetime}
              onChange={(ev) => setDatetime(ev.target.value)}
            />
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder={"Description"}
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 &&
            transactions.map((transaction) => (
              <div key={transaction._id} className="transaction">
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className={
                      "price " + (transaction.price < 0 ? "red" : "green")
                    }
                  >
                    {transaction.price}
                  </div>
                  <div className="datetime">2024-7-8 23:26</div>
                  <MdDeleteForever
                    className="delete-icon"
                    onClick={() => deleteTransaction(transaction._id)}
                  />
                </div>
              </div>
            ))}
        </div>
        
      </main>
      <ToastContainer />
    </div>
  );
}

export default Home;
