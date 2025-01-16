import express from "express";
import cors from "cors";
import hana from "@sap/hana-client";
import "dotenv/config.js";

const app = express();
app.use(cors());
app.use(express.json());

// SAP HANA Connection Details
const connOptions = {
  host: process.env.HOST,
  // port: process.env.PORT,
  port: 30215,
  user: process.env.USER,
  password: `${process.env.PASSWORD}#1234`,
};

// Connect to SAP HANA
const connection = hana.createConnection(connOptions);

const fetchTableData = async (query) => {
  return new Promise((resolve, reject) => {
    connection.exec(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Endpoint for Sales Orders (VBAK and VBAP)
app.get("/api/sales-orders", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filterBy = "",
    filterValue = "",
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    connection.connect(connOptions);

    let query = `SELECT VBAK.VBELN, VBAK.KUNNR, VBAK.AUART, VBAP.MATNR, VBAP.MENGE 
                 FROM VBAK 
                 JOIN VBAP ON VBAK.VBELN = VBAP.VBELN`;
    if (search) {
      query += ` WHERE VBAK.KUNNR LIKE '%${search}%' OR VBAP.MATNR LIKE '%${search}%'`;
    }
    if (filterBy && filterValue) {
      query += search
        ? ` AND ${filterBy} = '${filterValue}'`
        : ` WHERE ${filterBy} = '${filterValue}'`;
    }
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await fetchTableData(query);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.disconnect();
  }
});

// Endpoint for Sales Deliveries (LIKP and LIPS)
app.get("/api/deliveries", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filterBy = "",
    filterValue = "",
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    connection.connect(connOptions);

    let query = `SELECT LIKP.VBELN, LIKP.KUNNR, LIKP.WADAT, LIPS.MATNR, LIPS.LFIMG 
                 FROM LIKP 
                 JOIN LIPS ON LIKP.VBELN = LIPS.VBELN`;
    if (search) {
      query += ` WHERE LIKP.KUNNR LIKE '%${search}%' OR LIPS.MATNR LIKE '%${search}%'`;
    }
    if (filterBy && filterValue) {
      query += search
        ? ` AND ${filterBy} = '${filterValue}'`
        : ` WHERE ${filterBy} = '${filterValue}'`;
    }
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await fetchTableData(query);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.disconnect();
  }
});

// Endpoint for Invoices (VBRK and VBRP)
app.get("/api/invoices", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    filterBy = "",
    filterValue = "",
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    connection.connect(connOptions);

    let query = `SELECT VBRK.VBELN, VBRK.KUNNR, VBRK.FKDAT, VBRP.MATNR, VBRP.FKIMG 
                 FROM VBRK 
                 JOIN VBRP ON VBRK.VBELN = VBRP.VBELN`;
    if (search) {
      query += ` WHERE VBRK.KUNNR LIKE '%${search}%' OR VBRP.MATNR LIKE '%${search}%'`;
    }
    if (filterBy && filterValue) {
      query += search
        ? ` AND ${filterBy} = '${filterValue}'`
        : ` WHERE ${filterBy} = '${filterValue}'`;
    }
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const result = await fetchTableData(query);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.disconnect();
  }
});

// Endpoint for Attachments
app.get("/api/attachments", async (req, res) => {
  const { id, type } = req.query;

  try {
    connection.connect(connOptions);

    let query = `SELECT * FROM ATTACHMENTS WHERE ENTITY_ID = '${id}' AND ENTITY_TYPE = '${type}'`;

    const result = await fetchTableData(query);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    connection.disconnect();
  }
});

app.get("/", (req, res) => {
  console.log("Server Started");
  res.send("Started the SAP HANA");
});

const PORT = process.env.DB_PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
