import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [activeTab, setActiveTab] = useState("sales-orders");

  const fetchData = async () => {
    let endpoint = "";
    if (activeTab === "sales-orders") {
      endpoint = "/api/sales-orders";
    }

    if (activeTab === "deliveries") {
      endpoint = "/api/deliveries";
    }
    if (activeTab === "invoices") {
      endpoint = "/api/invoices";
    }

    try {
      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        params: { page, limit, search, filterBy, filterValue },
      });
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  const fetchAttachments = async (id, type) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/attachments",
        {
          params: { id, type },
        }
      );
      setAttachments(response.data.data);
    } catch (err) {
      console.error("Error fetching attachments:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search, filterBy, filterValue, activeTab]);

  return (
    <div className="module-data-container">
      <div className="module-data-section-container">
        <div className="section-data">
          <h1>SAP Sales Data</h1>
          <div className="sales-modules">
            <button onClick={() => setActiveTab("sales-orders")}>
              Sales Orders
            </button>
            <button onClick={() => setActiveTab("deliveries")}>
              Deliveries
            </button>
            <button onClick={() => setActiveTab("invoices")}>Invoices</button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select onChange={(e) => setFilterBy(e.target.value)}>
              <option value="">Filter By</option>
              <option value="KUNNR">Customer</option>
            </select>
            <input
              type="text"
              placeholder="Filter Value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <button onClick={fetchData}>Apply</button>
          </div>
          <table>
            <thead>
              <tr>
                {activeTab === "sales-orders" && (
                  <>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </>
                )}
                {activeTab === "deliveries" && (
                  <>
                    <th>Delivery ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </>
                )}
                {activeTab === "invoices" && (
                  <>
                    <th>Invoice ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.VBELN}>
                  {activeTab === "sales-orders" && (
                    <>
                      <td>{item.VBELN}</td>
                      <td>{item.KUNNR}</td>
                      <td>{item.AUART}</td>
                      <td>{item.MATNR}</td>
                      <td>{item.MENGE}</td>
                      <td>
                        <button
                          onClick={() => fetchAttachments(item.VBELN, "ORDER")}
                        >
                          View Attachments
                        </button>
                      </td>
                    </>
                  )}
                  {activeTab === "deliveries" && (
                    <>
                      <td>{item.VBELN}</td>
                      <td>{item.KUNNR}</td>
                      <td>{item.WADAT}</td>
                      <td>{item.MATNR}</td>
                      <td>{item.LFIMG}</td>
                      <td>
                        <button
                          onClick={() =>
                            fetchAttachments(item.VBELN, "DELIVERY")
                          }
                        >
                          View Attachments
                        </button>
                      </td>
                    </>
                  )}
                  {activeTab === "invoices" && (
                    <>
                      <td>{item.VBELN}</td>
                      <td>{item.KUNNR}</td>
                      <td>{item.FKDAT}</td>
                      <td>{item.MATNR}</td>
                      <td>{item.FKIMG}</td>
                      <td>
                        <button
                          onClick={() =>
                            fetchAttachments(item.VBELN, "INVOICE")
                          }
                        >
                          View Attachments
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span> Page {page} </span>
            <button onClick={() => setPage(page + 1)}>Next</button>
          </div>
          {attachments.length > 0 && (
            <div>
              <h2>Attachments</h2>
              <ul>
                {attachments.map((att) => (
                  <li key={att.ATTACHMENT_ID}>
                    <a
                      href={att.FILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {att.FILE_NAME}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
