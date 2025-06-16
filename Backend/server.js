
// // Description: This is the backend server for the Truck Tracking application.
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const sql = require("mssql");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());
// app.use(bodyParser.json());

// // SQL Server configuration
// const dbConfig = {
//   user: "sa",
//   password: "1234",
//   server: "localhost", // or 'LAPTOP-AID7B66K\\SQLEXPRESS'
//   database: "Truck_Tracking",
//   port: 1433,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
// };

// // Use a global connection pool
// let pool;
// async function getPool() {
//   if (pool) return pool;
//   pool = await sql.connect(dbConfig);
//   return pool;
// }

// // 🔐 Login API
// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;
//   console.log("Login attempt:", username, password);

//   try {
//     const pool = await getPool();
//     const result = await pool
//       .request()
//       .input("username", sql.NVarChar, username)
//       .input("password", sql.NVarChar, password)
//       .query(
//         "SELECT * FROM Users WHERE Username = @username AND Password = @password"
//       );

//     if (result.recordset.length > 0) {
//       res.json({ success: true, message: "Login successful" });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (err) {
//     console.error("SQL error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // 🌱 Plant Master API
// app.post("/api/plantmaster", async (req, res) => {
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } =
//     req.body;

//   if (!plantName) {
//     return res.status(400).json({ message: "PlantName is required" });
//   }

//   try {
//     const pool = await sql.connect(dbConfig);
//     await pool
//       .request()
//       .input("PlantName", sql.VarChar(200), plantName)
//       .input("PlantAddress", sql.VarChar(sql.MAX), plantAddress || "")
//       .input("ContactPerson", sql.VarChar(200), contactPerson || "")
//       .input("MobileNo", sql.VarChar(50), mobileNo || "")
//       .input("Remarks", sql.VarChar(sql.MAX), remarks || "").query(`
//         INSERT INTO PlantMaster (PlantName, PlantAddress, ContactPerson, MobileNo, Remarks)
//         VALUES (@PlantName, @PlantAddress, @ContactPerson, @MobileNo, @Remarks)
//       `);

//     res.status(200).json({ message: "Plant details submitted successfully." });
//   } catch (error) {
//     console.error("Insert error:", error);
//     res.status(500).json({ message: "Error inserting plant details" });
//   }
// });



// // 🔹 GET all plants (for dropdown)
// app.get('/api/plants', async (req, res) => {
//   try {
//     await sql.connect(dbConfig);
//     const result = await sql.query('SELECT PlantID, PlantName FROM PlantMaster');
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error fetching plants:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 GET plant by name (for search )

// app.get('/api/plantmaster/:plantName', async (req, res) => {
//   const plantName = req.params.plantName?.trim().toLowerCase(); // Normalize input
//   try {
//     await sql.connect(dbConfig);
//     const request = new sql.Request();
//     request.input('plantName', sql.VarChar, plantName);
//     const result = await request.query(`
//       SELECT TOP 1 *
//       FROM PlantMaster
//       WHERE LOWER(LTRIM(RTRIM(PlantName))) = @plantName
//     `);

//     if (result.recordset.length > 0) {
//       res.json(result.recordset[0]);
//     } else {
//       res.status(404).json({ error: 'Plant not found' });
//     }
//   } catch (err) {
//     console.error('Error fetching plant by name:', err);
//     res.status(500).send('Server error');
//   }
// });


// // 🔹 POST a new plant
// app.post('/api/plantmaster', async (req, res) => {
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
//   try {
//     await sql.connect(dbConfig);
//     const request = new sql.Request();
//     request.input('PlantName', sql.VarChar, plantName);
//     request.input('PlantAddress', sql.VarChar, plantAddress);
//     request.input('ContactPerson', sql.VarChar, contactPerson);
//     request.input('MobileNo', sql.VarChar, mobileNo);
//     request.input('Remarks', sql.VarChar, remarks);
//     await request.query(`
//       INSERT INTO PlantMaster (PlantName, PlantAddress, ContactPerson, MobileNo, Remarks)
//       VALUES (@PlantName, @PlantAddress, @ContactPerson, @MobileNo, @Remarks)
//     `);
//     res.sendStatus(201);
//   } catch (err) {
//     console.error('Error saving plant:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 PUT to update existing plant
// app.put('/api/plantmaster/update/:id', async (req, res) => {
//   const plantId = req.params.id;
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;

//   try {
//     await sql.connect(dbConfig);
//     const request = new sql.Request();
//     request.input('PlantID', sql.Int, plantId);
//     request.input('PlantName', sql.VarChar, plantName);
//     request.input('PlantAddress', sql.VarChar, plantAddress);
//     request.input('ContactPerson', sql.VarChar, contactPerson);
//     request.input('MobileNo', sql.VarChar, mobileNo);
//     request.input('Remarks', sql.VarChar, remarks);

//     await request.query(`
//       UPDATE PlantMaster
//       SET PlantName = @PlantName,
//           PlantAddress = @PlantAddress,
//           ContactPerson = @ContactPerson,
//           MobileNo = @MobileNo,
//           Remarks = @Remarks
//       WHERE PlantID = @PlantID
//     `);
//     res.sendStatus(200);
//   } catch (err) {
//     console.error('Error updating plant:', err);
//     res.status(500).send('Server error');
//   }
// });


// // 🔹 DELETE a plant

// app.get("/api/plants", async (req, res) => {
//   try {
//     const pool = await getPool();
//     const result = await pool
//       .request()
//       .query("SELECT PlantName FROM PlantMaster");
//     const plantNames = result.recordset.map((row) => row.PlantName);
//     res.json(plantNames);
//   } catch (error) {
//     console.error("Error fetching plants:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Truck Transaction API
// app.post("/api/truck-transaction", async (req, res) => {
//   const { formData, tableData } = req.body;

//   try {
//     const pool = await getPool();
//     const transaction = new sql.Transaction(pool);
//     await transaction.begin();

//     // Insert into TruckTransactionMaster
//     const insertMain = await transaction
//       .request()
//       .input("TruckNo", sql.VarChar, formData.truckNo)
//       .input("TransactionDate", sql.Date, formData.transactionDate)
//       .input("CityName", sql.VarChar, formData.cityName)
//       .input("Transporter", sql.VarChar, formData.transporter)
//       .input("AmountPerTon", sql.Decimal(10, 2), formData.amountPerTon)
//       .input("TruckWeight", sql.Decimal(10, 2), formData.truckWeight)
//       .input("DeliverPoint", sql.VarChar, formData.deliverPoint)
//       .input("Remarks", sql.VarChar, formData.remarks).query(`
//         INSERT INTO TruckTransactionMaster
//         (TruckNo, TransactionDate, CityName, Transporter, AmountPerTon, TruckWeight, DeliverPoint, Remarks, CreatedAt)
//         OUTPUT INSERTED.TransactionID
//         VALUES (@TruckNo, @TransactionDate, @CityName, @Transporter, @AmountPerTon, @TruckWeight, @DeliverPoint, @Remarks, GETDATE())
//       `);

//     const transactionId = insertMain.recordset[0].TransactionID;

//     // Insert into TruckTransactionDetails
//     for (const row of tableData) {
//       const plantResult = await transaction
//         .request()
//         .input("PlantName", sql.VarChar, row.plantName)
//         .query(`SELECT PlantId FROM PlantMaster WHERE PlantName = @PlantName`);

//       const plantId = plantResult.recordset[0]?.PlantId;

//       if (!plantId) {
//         throw new Error(`Plant not found: ${row.plantName}`);
//       }

//       await transaction
//         .request()
//         .input("TransactionID", sql.Int, transactionId)
//         .input("PlantId", sql.Int, plantId)
//         .input("LoadingSlipNo", sql.VarChar, row.loadingSlipNo)
//         .input("Qty", sql.Decimal(10, 2), row.qty)
//         .input("Priority", sql.VarChar, row.priority)
//         .input("Remarks", sql.VarChar, row.remarks || "")
//         .input("Freight", sql.VarChar, row.freight).query(`
//           INSERT INTO TruckTransactionDetails
//           (TransactionID, PlantId, LoadingSlipNo, Qty, Priority, Remarks, Freight)
//           VALUES (@TransactionID, @PlantId, @LoadingSlipNo, @Qty, @Priority, @Remarks, @Freight)
//         `);
//     }

//     await transaction.commit();
//     res.json({ success: true });
//   } catch (error) {
//     console.error("Transaction failed:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // 🚚 Fetch Truck Numbers API
// app.get("/api/trucks", async (req, res) => {
//   const { plantName } = req.query;
//   try {
//     const pool = await getPool();

//     const result = await pool.request().input("plantName", plantName).query(`
//    SELECT DISTINCT m.TruckNo
// FROM PlantMaster p
// JOIN TruckTransactionDetails d ON p.PlantID = d.PlantId
// JOIN TruckTransactionMaster m ON d.TransactionId = m.TransactionID
// WHERE p.PlantName = @plantName
//   AND d.CheckInStatus = 0
//   AND m.Completed = 0

//   `);

//     res.json(result.recordset);
//   } catch (error) {
//     console.error("Error fetching truck numbers:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Update Truck Status API

// app.post("/api/update-truck-status", async (req, res) => {
//   const { truckNo, plantName, type } = req.body;

//   try {
//     const pool = await getPool();

//     // 1. Get TransactionID
//     const transactionResult = await pool
//       .request()
//       .input("truckNo", sql.VarChar, truckNo).query(`
//         SELECT TOP 1 TransactionID 
//         FROM TruckTransactionMaster 
//         WHERE TruckNo = @truckNo AND Completed = 0
//         ORDER BY TransactionID DESC
//       `);

//     if (transactionResult.recordset.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "❌ Truck not found or already completed" });
//     }

//     const transactionId = transactionResult.recordset[0].TransactionID;

//     // 2. Get PlantId
//     const plantResult = await pool
//       .request()
//       .input("plantName", sql.VarChar, plantName).query(`
//         SELECT TOP 1 PlantId 
//         FROM PlantMaster 
//         WHERE PlantName = @plantName
//       `);

//     if (plantResult.recordset.length === 0) {
//       return res.status(404).json({ message: "❌ Plant not found" });
//     }

//     const plantId = plantResult.recordset[0].PlantId;

//     // 3. Get current status
//     const statusResult = await pool
//       .request()
//       .input("PlantId", sql.Int, plantId)
//       .input("TransactionID", sql.Int, transactionId).query(`
//         SELECT CheckInStatus, CheckOutStatus
//         FROM TruckTransactionDetails
//         WHERE PlantId = @PlantId AND TransactionID = @TransactionID
//       `);

//     if (statusResult.recordset.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "❌ Truck detail not found for this plant" });
//     }

//     const status = statusResult.recordset[0];

//     // 4. Update check-in or check-out
//     if (type === "Check In" && status.CheckInStatus === 0) {
//       await pool
//         .request()
//         .input("PlantId", sql.Int, plantId)
//         .input("TransactionID", sql.Int, transactionId).query(`
//           UPDATE TruckTransactionDetails
//           SET CheckInStatus = 1
//           WHERE PlantId = @PlantId AND TransactionID = @TransactionID
//         `);
//     }

//     if (type === "Check Out") {
//       if (status.CheckInStatus === 0) {
//         return res
//           .status(400)
//           .json({ message: "❌ Please Check In first before Check Out" });
//       }

//       if (status.CheckOutStatus === 0) {
//         await pool
//           .request()
//           .input("PlantId", sql.Int, plantId)
//           .input("TransactionID", sql.Int, transactionId).query(`
//         UPDATE TruckTransactionDetails
//         SET CheckOutStatus = 1
//         WHERE PlantId = @PlantId AND TransactionID = @TransactionID
//       `);
//       }
//     }

//     // 5. Recheck updated status
//     // 6. Check if all plants for this transaction are checked-in and checked-out
//     const allStatusResult = await pool
//       .request()
//       .input("TransactionID", sql.Int, transactionId).query(`
//     SELECT COUNT(*) AS TotalPlants,
//            SUM(CASE WHEN CheckInStatus = 1 THEN 1 ELSE 0 END) AS CheckedIn,
//            SUM(CASE WHEN CheckOutStatus = 1 THEN 1 ELSE 0 END) AS CheckedOut
//     FROM TruckTransactionDetails
//     WHERE TransactionID = @TransactionID
//   `);

//     const statusCheck = allStatusResult.recordset[0];

//     if (
//       statusCheck.TotalPlants === statusCheck.CheckedIn &&
//       statusCheck.TotalPlants === statusCheck.CheckedOut
//     ) {
//       // All plants completed
//       await pool.request().input("TransactionID", sql.Int, transactionId)
//         .query(`
//       UPDATE TruckTransactionMaster
//       SET Completed = 1
//       WHERE TransactionID = @TransactionID
//     `);

//       return res.json({
//         message: "✅ All plants processed. Truck process completed.",
//       });
//     }

//     // 7. Return success for one action
//     return res.json({ message: `✅ ${type} successful` });
//   } catch (error) {
//     console.error("Status update error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Fetch Checked-in Trucks API
// app.get("/api/checked-in-trucks", async (req, res) => {
//   const { plantName } = req.query;
//   try {
//     const pool = await getPool();

//     const result = await pool
//       .request()
//       .input("plantName", sql.VarChar, plantName).query(`
//         SELECT DISTINCT m.TruckNo
//         FROM PlantMaster p
//         JOIN TruckTransactionDetails d ON p.PlantID = d.PlantID
//         JOIN TruckTransactionMaster m ON d.TransactionID = m.TransactionID
//         WHERE p.PlantName = @plantName
//           AND d.CheckInStatus = 1
//           AND d.CheckOutStatus = 0
//       `);

//     res.json(result.recordset);
//   } catch (error) {
//     console.error("Error fetching truck numbers:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// app.get('/api/fetch-remarks', async (req, res) => {
//   const { plantName, truckNo } = req.query;

//   try {
//     const pool = await getPool();

//     // Step 1: Get PlantID
//     const plantResult = await pool.request()
//       .input('plantName', sql.VarChar, plantName)
//       .query('SELECT PlantID FROM PlantMaster WHERE PlantName = @plantName');
    
//     if (plantResult.recordset.length === 0) {
//       return res.status(404).json({ message: 'Plant not found' });
//     }
//     const plantId = plantResult.recordset[0].PlantID;

//     // Step 2: Get TransactionID
//     const txnResult = await pool.request()
//       .input('truckNo', sql.VarChar, truckNo)
//       .query('SELECT TransactionID FROM TruckTransactionMaster WHERE TruckNo = @truckNo');
    
//     if (txnResult.recordset.length === 0) {
//       return res.status(404).json({ message: 'Transaction not found' });
//     }
//     const transactionId = txnResult.recordset[0].TransactionID;

//     // Step 3: Fetch Remarks
//     const remarksResult = await pool.request()
//       .input('plantId', sql.Int, plantId)
//       .input('transactionId', sql.Int, transactionId)
//       .query(`
//         SELECT Remarks 
//         FROM TruckTransactionDetails 
//         WHERE PlantID = @plantId AND TransactionID = @transactionId
//       `);

//     if (remarksResult.recordset.length === 0) {
//       return res.status(404).json({ message: 'Remarks not found' });
//     }

//     const remarks = remarksResult.recordset[0].Remarks;
//     res.json({ remarks });

//   } catch (error) {
//     console.error('Error fetching remarks:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // 🚀 Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });



// // Description: This is the backend server for the Truck Tracking application.
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { Pool } = require("pg");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());
// app.use(bodyParser.json());

// // PostgreSQL configuration
// const dbConfig = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST || process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
//   ssl: { rejectUnauthorized: false }
// };
// const pool = new Pool(dbConfig);

// // 🔐 Login API
// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query(
//       "SELECT * FROM Users WHERE Username = $1 AND Password = $2",
//       [username, password]
//     );
//     if (result.rows.length > 0) {
//       res.json({ success: true, message: "Login successful" });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (err) {
//     console.error("SQL error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // 🌱 Plant Master API
// app.post("/api/plantmaster", async (req, res) => {
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
//   if (!plantName) {
//     return res.status(400).json({ message: "PlantName is required" });
//   }
//   try {
//     await pool.query(
//       `INSERT INTO PlantMaster (PlantName, PlantAddress, ContactPerson, MobileNo, Remarks)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [plantName, plantAddress || "", contactPerson || "", mobileNo || "", remarks || ""]
//     );
//     res.status(200).json({ message: "Plant details submitted successfully." });
//   } catch (error) {
//     console.error("Insert error:", error);
//     res.status(500).json({ message: "Error inserting plant details" });
//   }
// });

// // 🔹 GET all plants (for dropdown)
// app.get('/api/plants', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT PlantID, PlantName FROM PlantMaster');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching plants:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 GET plant by name (for search)
// app.get('/api/plantmaster/:plantName', async (req, res) => {
//   const plantName = req.params.plantName?.trim().toLowerCase();
//   try {
//     const result = await pool.query(
//       `SELECT * FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = $1 LIMIT 1`,
//       [plantName]
//     );
//     if (result.rows.length > 0) {
//       res.json(result.rows[0]);
//     } else {
//       res.status(404).json({ error: 'Plant not found' });
//     }
//   } catch (err) {
//     console.error('Error fetching plant by name:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 POST a new plant (duplicate, but kept for compatibility)
// app.post('/api/plantmaster', async (req, res) => {
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
//   try {
//     await pool.query(
//       `INSERT INTO PlantMaster (PlantName, PlantAddress, ContactPerson, MobileNo, Remarks)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [plantName, plantAddress, contactPerson, mobileNo, remarks]
//     );
//     res.sendStatus(201);
//   } catch (err) {
//     console.error('Error saving plant:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 PUT to update existing plant
// app.put('/api/plantmaster/update/:id', async (req, res) => {
//   const plantId = req.params.id;
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
//   try {
//     await pool.query(
//       `UPDATE PlantMaster
//        SET PlantName = $1, PlantAddress = $2, ContactPerson = $3, MobileNo = $4, Remarks = $5
//        WHERE PlantID = $6`,
//       [plantName, plantAddress, contactPerson, mobileNo, remarks, plantId]
//     );
//     res.sendStatus(200);
//   } catch (err) {
//     console.error('Error updating plant:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 GET all plant names (for dropdown)
// app.get("/api/plants", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT PlantName FROM PlantMaster");
//     const plantNames = result.rows.map((row) => row.plantname || row.PlantName);
//     res.json(plantNames);
//   } catch (error) {
//     console.error("Error fetching plants:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Truck Transaction API
// app.post("/api/truck-transaction", async (req, res) => {
//   const { formData, tableData } = req.body;
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//     // Insert into TruckTransactionMaster
//     const insertMain = await client.query(
//       `INSERT INTO TruckTransactionMaster
//         (TruckNo, TransactionDate, CityName, Transporter, AmountPerTon, TruckWeight, DeliverPoint, Remarks, CreatedAt)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
//         RETURNING TransactionID`,
//       [
//         formData.truckNo,
//         formData.transactionDate,
//         formData.cityName,
//         formData.transporter,
//         formData.amountPerTon,
//         formData.truckWeight,
//         formData.deliverPoint,
//         formData.remarks
//       ]
//     );
//     const transactionId = insertMain.rows[0].transactionid || insertMain.rows[0].transactionid;

//     // Insert into TruckTransactionDetails
//     for (const row of tableData) {
//       const plantResult = await client.query(
//         `SELECT PlantId FROM PlantMaster WHERE PlantName = $1 LIMIT 1`,
//         [row.plantName]
//       );
//       const plantId = plantResult.rows[0]?.plantid || plantResult.rows[0]?.plantid;
//       if (!plantId) {
//         throw new Error(`Plant not found: ${row.plantName}`);
//       }
//       await client.query(
//         `INSERT INTO TruckTransactionDetails
//           (TransactionID, PlantId, LoadingSlipNo, Qty, Priority, Remarks, Freight)
//           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//         [
//           transactionId,
//           plantId,
//           row.loadingSlipNo,
//           row.qty,
//           row.priority,
//           row.remarks || "",
//           row.freight
//         ]
//       );
//     }
//     await client.query('COMMIT');
//     res.json({ success: true });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error("Transaction failed:", error);
//     res.status(500).json({ success: false, error: error.message });
//   } finally {
//     client.release();
//   }
// });

// // 🚚 Fetch Truck Numbers API
// app.get("/api/trucks", async (req, res) => {
//   const { plantName } = req.query;
//   try {
//     const result = await pool.query(
//       `SELECT DISTINCT m.TruckNo
//        FROM PlantMaster p
//        JOIN TruckTransactionDetails d ON p.PlantID = d.PlantId
//        JOIN TruckTransactionMaster m ON d.TransactionId = m.TransactionID
//        WHERE p.PlantName = $1
//          AND d.CheckInStatus = 0
//          AND m.Completed = 0`,
//       [plantName]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching truck numbers:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Update Truck Status API
// app.post("/api/update-truck-status", async (req, res) => {
//   const { truckNo, plantName, type } = req.body;
//   const client = await pool.connect();
//   try {
//     // 1. Get TransactionID
//     const transactionResult = await client.query(
//       `SELECT TransactionID
//        FROM TruckTransactionMaster
//        WHERE TruckNo = $1 AND Completed = 0
//        ORDER BY TransactionID DESC
//        LIMIT 1`,
//       [truckNo]
//     );
//     if (transactionResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Truck not found or already completed" });
//     }
//     const transactionId = transactionResult.rows[0].transactionid;

//     // 2. Get PlantId
//     const plantResult = await client.query(
//       `SELECT PlantId FROM PlantMaster WHERE PlantName = $1 LIMIT 1`,
//       [plantName]
//     );
//     if (plantResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Plant not found" });
//     }
//     const plantId = plantResult.rows[0].plantid;

//     // 3. Get current status
//     const statusResult = await client.query(
//       `SELECT CheckInStatus, CheckOutStatus
//        FROM TruckTransactionDetails
//        WHERE PlantId = $1 AND TransactionID = $2`,
//       [plantId, transactionId]
//     );
//     if (statusResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Truck detail not found for this plant" });
//     }
//     const status = statusResult.rows[0];

//     // 4. Update check-in or check-out
//     if (type === "Check In" && status.checkinstatus === 0) {
//       await client.query(
//         `UPDATE TruckTransactionDetails
//          SET CheckInStatus = 1
//          WHERE PlantId = $1 AND TransactionID = $2`,
//         [plantId, transactionId]
//       );
//     }
//     if (type === "Check Out") {
//       if (status.checkinstatus === 0) {
//         return res.status(400).json({ message: "❌ Please Check In first before Check Out" });
//       }
//       if (status.checkoutstatus === 0) {
//         await client.query(
//           `UPDATE TruckTransactionDetails
//            SET CheckOutStatus = 1
//            WHERE PlantId = $1 AND TransactionID = $2`,
//           [plantId, transactionId]
//         );
//       }
//     }

//     // 5. Recheck updated status
//     // 6. Check if all plants for this transaction are checked-in and checked-out
//     const allStatusResult = await client.query(
//       `SELECT COUNT(*) AS totalplants,
//               SUM(CASE WHEN CheckInStatus = 1 THEN 1 ELSE 0 END) AS checkedin,
//               SUM(CASE WHEN CheckOutStatus = 1 THEN 1 ELSE 0 END) AS checkedout
//          FROM TruckTransactionDetails
//          WHERE TransactionID = $1`,
//       [transactionId]
//     );
//     const statusCheck = allStatusResult.rows[0];
//     if (
//       Number(statusCheck.totalplants) === Number(statusCheck.checkedin) &&
//       Number(statusCheck.totalplants) === Number(statusCheck.checkedout)
//     ) {
//       // All plants completed
//       await client.query(
//         `UPDATE TruckTransactionMaster
//          SET Completed = 1
//          WHERE TransactionID = $1`,
//         [transactionId]
//       );
//       return res.json({
//         message: "✅ All plants processed. Truck process completed.",
//       });
//     }
//     // 7. Return success for one action
//     return res.json({ message: `✅ ${type} successful` });
//   } catch (error) {
//     console.error("Status update error:", error);
//     res.status(500).json({ error: "Server error" });
//   } finally {
//     client.release();
//   }
// });

// // 🚚 Fetch Checked-in Trucks API
// app.get("/api/checked-in-trucks", async (req, res) => {
//   const { plantName } = req.query;
//   try {
//     const result = await pool.query(
//       `SELECT DISTINCT m.TruckNo
//        FROM PlantMaster p
//        JOIN TruckTransactionDetails d ON p.PlantID = d.PlantID
//        JOIN TruckTransactionMaster m ON d.TransactionID = m.TransactionID
//        WHERE p.PlantName = $1
//          AND d.CheckInStatus = 1
//          AND d.CheckOutStatus = 0`,
//       [plantName]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching truck numbers:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Fetch Remarks API
// app.get('/api/fetch-remarks', async (req, res) => {
//   const { plantName, truckNo } = req.query;
//   try {
//     // Step 1: Get PlantID
//     const plantResult = await pool.query(
//       'SELECT PlantID FROM PlantMaster WHERE PlantName = $1 LIMIT 1',
//       [plantName]
//     );
//     if (plantResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Plant not found' });
//     }
//     const plantId = plantResult.rows[0].plantid || plantResult.rows[0].plantid;

//     // Step 2: Get TransactionID
//     const txnResult = await pool.query(
//       'SELECT TransactionID FROM TruckTransactionMaster WHERE TruckNo = $1 LIMIT 1',
//       [truckNo]
//     );
//     if (txnResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Transaction not found' });
//     }
//     const transactionId = txnResult.rows[0].transactionid;

//     // Step 3: Fetch Remarks
//     const remarksResult = await pool.query(
//       `SELECT Remarks 
//        FROM TruckTransactionDetails 
//        WHERE PlantID = $1 AND TransactionID = $2 LIMIT 1`,
//       [plantId, transactionId]
//     );
//     if (remarksResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Remarks not found' });
//     }
//     const remarks = remarksResult.rows[0].remarks;
//     res.json({ remarks });
//   } catch (error) {
//     console.error('Error fetching remarks:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // 🚀 Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });





// // Description: This is the backend server for the Truck Tracking application.
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { Pool } = require("pg");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());
// app.use(bodyParser.json());

// // PostgreSQL configuration
// // Prefer DATABASE_URL if available, else use individual vars
// const dbConfig = process.env.DATABASE_URL
//   ? {
//       connectionString: process.env.DATABASE_URL,
//       ssl: { rejectUnauthorized: false },
//     }
//   : {
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       host: process.env.DB_HOST || process.env.DB_SERVER,
//       database: process.env.DB_DATABASE,
//       port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
//       ssl: { rejectUnauthorized: false },
//     };

// const pool = new Pool(dbConfig);

// // 🔐 Login API
// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query(
//       "SELECT * FROM Users WHERE Username = $1 AND Password = $2",
//       [username, password]
//     );
//     if (result.rows.length > 0) {
//       res.json({ success: true, message: "Login successful" });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (err) {
//     console.error("SQL error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // 🌱 Plant Master API
// app.post("/api/plantmaster", async (req, res) => {
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
//   if (!plantName) {
//     return res.status(400).json({ message: "PlantName is required" });
//   }
//   try {
//     await pool.query(
//       `INSERT INTO PlantMaster (PlantName, PlantAddress, ContactPerson, MobileNo, Remarks)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [plantName, plantAddress || "", contactPerson || "", mobileNo || "", remarks || ""]
//     );
//     res.status(200).json({ message: "Plant details submitted successfully." });
//   } catch (error) {
//     console.error("Insert error:", error);
//     res.status(500).json({ message: "Error inserting plant details" });
//   }
// });

// // 🔹 GET all plants (for dropdown)
// app.get('/api/plants', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT PlantID, PlantName FROM PlantMaster');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching plants:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 GET plant by name (for search)
// app.get('/api/plantmaster/:plantName', async (req, res) => {
//   const plantName = req.params.plantName?.trim().toLowerCase();
//   try {
//     const result = await pool.query(
//       `SELECT * FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = $1 LIMIT 1`,
//       [plantName]
//     );
//     if (result.rows.length > 0) {
//       res.json(result.rows[0]);
//     } else {
//       res.status(404).json({ error: 'Plant not found' });
//     }
//   } catch (err) {
//     console.error('Error fetching plant by name:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🔹 PUT to update existing plant
// app.put('/api/plantmaster/update/:id', async (req, res) => {
//   const plantId = req.params.id;
//   const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
//   try {
//     await pool.query(
//       `UPDATE PlantMaster
//        SET PlantName = $1, PlantAddress = $2, ContactPerson = $3, MobileNo = $4, Remarks = $5
//        WHERE PlantID = $6`,
//       [plantName, plantAddress, contactPerson, mobileNo, remarks, plantId]
//     );
//     res.sendStatus(200);
//   } catch (err) {
//     console.error('Error updating plant:', err);
//     res.status(500).send('Server error');
//   }
// });

// // 🚚 Truck Transaction API
// app.post("/api/truck-transaction", async (req, res) => {
//   const { formData, tableData } = req.body;
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//     // Insert into TruckTransactionMaster
//     const insertMain = await client.query(
//       `INSERT INTO TruckTransactionMaster
//         (TruckNo, TransactionDate, CityName, Transporter, AmountPerTon, TruckWeight, DeliverPoint, Remarks, CreatedAt)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
//         RETURNING TransactionID`,
//       [
//         formData.truckNo,
//         formData.transactionDate,
//         formData.cityName,
//         formData.transporter,
//         formData.amountPerTon,
//         formData.truckWeight,
//         formData.deliverPoint,
//         formData.remarks
//       ]
//     );
//     const transactionId = insertMain.rows[0].transactionid;

//     // Insert into TruckTransactionDetails
//     for (const row of tableData) {
//       const plantResult = await client.query(
//         `SELECT PlantId FROM PlantMaster WHERE PlantName = $1 LIMIT 1`,
//         [row.plantName]
//       );
//       const plantId = plantResult.rows[0]?.plantid;
//       if (!plantId) {
//         throw new Error(`Plant not found: ${row.plantName}`);
//       }
//       await client.query(
//         `INSERT INTO TruckTransactionDetails
//           (TransactionID, PlantId, LoadingSlipNo, Qty, Priority, Remarks, Freight)
//           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//         [
//           transactionId,
//           plantId,
//           row.loadingSlipNo,
//           row.qty,
//           row.priority,
//           row.remarks || "",
//           row.freight
//         ]
//       );
//     }
//     await client.query('COMMIT');
//     res.json({ success: true });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error("Transaction failed:", error);
//     res.status(500).json({ success: false, error: error.message });
//   } finally {
//     client.release();
//   }
// });

// // 🚚 Fetch Truck Numbers API
// app.get("/api/trucks", async (req, res) => {
//   const { plantName } = req.query;
//   try {
//     const result = await pool.query(
//       `SELECT DISTINCT m.TruckNo
//        FROM PlantMaster p
//        JOIN TruckTransactionDetails d ON p.PlantID = d.PlantId
//        JOIN TruckTransactionMaster m ON d.TransactionId = m.TransactionID
//        WHERE p.PlantName = $1
//          AND d.CheckInStatus = 0
//          AND m.Completed = 0`,
//       [plantName]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching truck numbers:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Update Truck Status API
// app.post("/api/update-truck-status", async (req, res) => {
//   const { truckNo, plantName, type } = req.body;
//   const client = await pool.connect();
//   try {
//     // 1. Get TransactionID
//     const transactionResult = await client.query(
//       `SELECT TransactionID
//        FROM TruckTransactionMaster
//        WHERE TruckNo = $1 AND Completed = 0
//        ORDER BY TransactionID DESC
//        LIMIT 1`,
//       [truckNo]
//     );
//     if (transactionResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Truck not found or already completed" });
//     }
//     const transactionId = transactionResult.rows[0].transactionid;

//     // 2. Get PlantId
//     const plantResult = await client.query(
//       `SELECT PlantId FROM PlantMaster WHERE PlantName = $1 LIMIT 1`,
//       [plantName]
//     );
//     if (plantResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Plant not found" });
//     }
//     const plantId = plantResult.rows[0].plantid;

//     // 3. Get current status
//     const statusResult = await client.query(
//       `SELECT CheckInStatus, CheckOutStatus
//        FROM TruckTransactionDetails
//        WHERE PlantId = $1 AND TransactionID = $2`,
//       [plantId, transactionId]
//     );
//     if (statusResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Truck detail not found for this plant" });
//     }
//     const status = statusResult.rows[0];

//     // 4. Update check-in or check-out
//     if (type === "Check In" && status.checkinstatus === 0) {
//       await client.query(
//         `UPDATE TruckTransactionDetails
//          SET CheckInStatus = 1
//          WHERE PlantId = $1 AND TransactionID = $2`,
//         [plantId, transactionId]
//       );
//     }
//     if (type === "Check Out") {
//       if (status.checkinstatus === 0) {
//         return res.status(400).json({ message: "❌ Please Check In first before Check Out" });
//       }
//       if (status.checkoutstatus === 0) {
//         await client.query(
//           `UPDATE TruckTransactionDetails
//            SET CheckOutStatus = 1
//            WHERE PlantId = $1 AND TransactionID = $2`,
//           [plantId, transactionId]
//         );
//       }
//     }

//     // 5. Recheck updated status
//     // 6. Check if all plants for this transaction are checked-in and checked-out
//     const allStatusResult = await client.query(
//       `SELECT COUNT(*) AS totalplants,
//               SUM(CASE WHEN CheckInStatus = 1 THEN 1 ELSE 0 END) AS checkedin,
//               SUM(CASE WHEN CheckOutStatus = 1 THEN 1 ELSE 0 END) AS checkedout
//          FROM TruckTransactionDetails
//          WHERE TransactionID = $1`,
//       [transactionId]
//     );
//     const statusCheck = allStatusResult.rows[0];
//     if (
//       Number(statusCheck.totalplants) === Number(statusCheck.checkedin) &&
//       Number(statusCheck.totalplants) === Number(statusCheck.checkedout)
//     ) {
//       // All plants completed
//       await client.query(
//         `UPDATE TruckTransactionMaster
//          SET Completed = 1
//          WHERE TransactionID = $1`,
//         [transactionId]
//       );
//       return res.json({
//         message: "✅ All plants processed. Truck process completed.",
//       });
//     }
//     // 7. Return success for one action
//     return res.json({ message: `✅ ${type} successful` });
//   } catch (error) {
//     console.error("Status update error:", error);
//     res.status(500).json({ error: "Server error" });
//   } finally {
//     client.release();
//   }
// });

// // 🚚 Fetch Checked-in Trucks API
// app.get("/api/checked-in-trucks", async (req, res) => {
//   const { plantName } = req.query;
//   try {
//     const result = await pool.query(
//       `SELECT DISTINCT m.TruckNo
//        FROM PlantMaster p
//        JOIN TruckTransactionDetails d ON p.PlantID = d.PlantID
//        JOIN TruckTransactionMaster m ON d.TransactionID = m.TransactionID
//        WHERE p.PlantName = $1
//          AND d.CheckInStatus = 1
//          AND d.CheckOutStatus = 0`,
//       [plantName]
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching truck numbers:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // 🚚 Fetch Remarks API
// app.get('/api/fetch-remarks', async (req, res) => {
//   const { plantName, truckNo } = req.query;
//   try {
//     // Step 1: Get PlantID
//     const plantResult = await pool.query(
//       'SELECT PlantID FROM PlantMaster WHERE PlantName = $1 LIMIT 1',
//       [plantName]
//     );
//     if (plantResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Plant not found' });
//     }
//     const plantId = plantResult.rows[0].plantid;

//     // Step 2: Get TransactionID
//     const txnResult = await pool.query(
//       'SELECT TransactionID FROM TruckTransactionMaster WHERE TruckNo = $1 LIMIT 1',
//       [truckNo]
//     );
//     if (txnResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Transaction not found' });
//     }
//     const transactionId = txnResult.rows[0].transactionid;

//     // Step 3: Fetch Remarks
//     const remarksResult = await pool.query(
//       `SELECT Remarks 
//        FROM TruckTransactionDetails 
//        WHERE PlantID = $1 AND TransactionID = $2 LIMIT 1`,
//       [plantId, transactionId]
//     );
//     if (remarksResult.rows.length === 0) {
//       return res.status(404).json({ message: 'Remarks not found' });
//     }
//     const remarks = remarksResult.rows[0].remarks;
//     res.json({ remarks });
//   } catch (error) {
//     console.error('Error fetching remarks:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // 🚀 Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });



///////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL configuration
const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      ssl: { rejectUnauthorized: false },
    };

const pool = new Pool(dbConfig);

// 🔐 Login API
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM Users WHERE LOWER(Username) = LOWER($1) AND Password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🌱 Plant Master API
app.post("/api/plantmaster", async (req, res) => {
  const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
  if (!plantName) {
    return res.status(400).json({ message: "PlantName is required" });
  }
  try {
    await pool.query(
      `INSERT INTO PlantMaster (PlantName, PlantAddress, ContactPerson, MobileNo, Remarks)
       VALUES ($1, $2, $3, $4, $5)`,
      [plantName, plantAddress || "", contactPerson || "", mobileNo || "", remarks || ""]
    );
    res.status(200).json({ message: "Plant details submitted successfully." });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ message: "Error inserting plant details" });
  }
});

// 🔹 GET all plants (for dropdown)
app.get('/api/plants', async (req, res) => {
  try {
    const result = await pool.query('SELECT PlantID, PlantName FROM PlantMaster');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching plants:', err);
    res.status(500).send('Server error');
  }
});

// 🔹 GET plant by name (for search) - CASE INSENSITIVE
app.get('/api/plantmaster/:plantName', async (req, res) => {
  const plantName = req.params.plantName?.trim();
  try {
    const result = await pool.query(
      `SELECT * FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = LOWER(TRIM($1)) LIMIT 1`,
      [plantName]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Plant not found' });
    }
  } catch (err) {
    console.error('Error fetching plant by name:', err);
    res.status(500).send('Server error');
  }
});

// 🔹 PUT to update existing plant
app.put('/api/plantmaster/update/:id', async (req, res) => {
  const plantId = req.params.id;
  const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
  try {
    await pool.query(
      `UPDATE PlantMaster
       SET PlantName = $1, PlantAddress = $2, ContactPerson = $3, MobileNo = $4, Remarks = $5
       WHERE PlantID = $6`,
      [plantName, plantAddress, contactPerson, mobileNo, remarks, plantId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating plant:', err);
    res.status(500).send('Server error');
  }
});

// 🚚 Truck Transaction API
app.post("/api/truck-transaction", async (req, res) => {
  const { formData, tableData } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Insert into TruckTransactionMaster
    const insertMain = await client.query(
      `INSERT INTO TruckTransactionMaster
        (TruckNo, TransactionDate, CityName, Transporter, AmountPerTon, TruckWeight, DeliverPoint, Remarks, CreatedAt)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING TransactionID`,
      [
        formData.truckNo,
        formData.transactionDate,
        formData.cityName,
        formData.transporter,
        formData.amountPerTon,
        formData.truckWeight,
        formData.deliverPoint,
        formData.remarks
      ]
    );
    const transactionId = insertMain.rows[0].transactionid;

    // Insert into TruckTransactionDetails
    for (const row of tableData) {
      const plantResult = await client.query(
        `SELECT PlantId FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = LOWER(TRIM($1)) LIMIT 1`,
        [row.plantName]
      );
      const plantId = plantResult.rows[0]?.plantid;
      if (!plantId) {
        throw new Error(`Plant not found: ${row.plantName}`);
      }
      await client.query(
        `INSERT INTO TruckTransactionDetails
          (TransactionID, PlantId, LoadingSlipNo, Qty, Priority, Remarks, Freight)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          transactionId,
          plantId,
          row.loadingSlipNo,
          row.qty,
          row.priority,
          row.remarks || "",
          row.freight
        ]
      );
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Transaction failed:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// 🚚 Fetch Truck Numbers API (CASE INSENSITIVE)
app.get("/api/trucks", async (req, res) => {
  const { plantName } = req.query;
  try {
    const result = await pool.query(
      `SELECT DISTINCT m.TruckNo
       FROM PlantMaster p
       JOIN TruckTransactionDetails d ON p.PlantID = d.PlantId
       JOIN TruckTransactionMaster m ON d.TransactionId = m.TransactionID
       WHERE LOWER(TRIM(p.PlantName)) = LOWER(TRIM($1))
         AND d.CheckInStatus = 0
         AND m.Completed = 0`,
      [plantName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching truck numbers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🚚 Update Truck Status API (CASE INSENSITIVE)
app.post("/api/update-truck-status", async (req, res) => {
  const { truckNo, plantName, type } = req.body;
  const client = await pool.connect();
  try {
    // 1. Get TransactionID
    const transactionResult = await client.query(
      `SELECT TransactionID
       FROM TruckTransactionMaster
       WHERE TruckNo = $1 AND Completed = 0
       ORDER BY TransactionID DESC
       LIMIT 1`,
      [truckNo]
    );
    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ message: "❌ Truck not found or already completed" });
    }
    const transactionId = transactionResult.rows[0].transactionid;

    // 2. Get PlantId (CASE INSENSITIVE)
    const plantResult = await client.query(
      `SELECT PlantId FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = LOWER(TRIM($1)) LIMIT 1`,
      [plantName]
    );
    if (plantResult.rows.length === 0) {
      return res.status(404).json({ message: "❌ Plant not found" });
    }
    const plantId = plantResult.rows[0].plantid;

    // 3. Get current status
    const statusResult = await client.query(
      `SELECT CheckInStatus, CheckOutStatus
       FROM TruckTransactionDetails
       WHERE PlantId = $1 AND TransactionID = $2`,
      [plantId, transactionId]
    );
    if (statusResult.rows.length === 0) {
      return res.status(404).json({ message: "❌ Truck detail not found for this plant" });
    }
    const status = statusResult.rows[0];

    // 4. Update check-in or check-out
    if (type === "Check In" && status.checkinstatus === 0) {
      await client.query(
        `UPDATE TruckTransactionDetails
         SET CheckInStatus = 1
         WHERE PlantId = $1 AND TransactionID = $2`,
        [plantId, transactionId]
      );
    }
    if (type === "Check Out") {
      if (status.checkinstatus === 0) {
        return res.status(400).json({ message: "❌ Please Check In first before Check Out" });
      }
      if (status.checkoutstatus === 0) {
        await client.query(
          `UPDATE TruckTransactionDetails
           SET CheckOutStatus = 1
           WHERE PlantId = $1 AND TransactionID = $2`,
          [plantId, transactionId]
        );
      }
    }

    // 5. Recheck updated status
    // 6. Check if all plants for this transaction are checked-in and checked-out
    const allStatusResult = await client.query(
      `SELECT COUNT(*) AS totalplants,
              SUM(CASE WHEN CheckInStatus = 1 THEN 1 ELSE 0 END) AS checkedin,
              SUM(CASE WHEN CheckOutStatus = 1 THEN 1 ELSE 0 END) AS checkedout
         FROM TruckTransactionDetails
         WHERE TransactionID = $1`,
      [transactionId]
    );
    const statusCheck = allStatusResult.rows[0];
    if (
      Number(statusCheck.totalplants) === Number(statusCheck.checkedin) &&
      Number(statusCheck.totalplants) === Number(statusCheck.checkedout)
    ) {
      // All plants completed
      await client.query(
        `UPDATE TruckTransactionMaster
         SET Completed = 1
         WHERE TransactionID = $1`,
        [transactionId]
      );
      return res.json({
        message: "✅ All plants processed. Truck process completed.",
      });
    }
    // 7. Return success for one action
    return res.json({ message: `✅ ${type} successful` });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

// 🚚 Fetch Checked-in Trucks API (CASE INSENSITIVE)
app.get("/api/checked-in-trucks", async (req, res) => {
  const { plantName } = req.query;
  try {
    const result = await pool.query(
      `SELECT DISTINCT m.TruckNo
       FROM PlantMaster p
       JOIN TruckTransactionDetails d ON p.PlantID = d.PlantID
       JOIN TruckTransactionMaster m ON d.TransactionID = m.TransactionID
       WHERE LOWER(TRIM(p.PlantName)) = LOWER(TRIM($1))
         AND d.CheckInStatus = 1
         AND d.CheckOutStatus = 0`,
      [plantName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching truck numbers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🚚 Fetch Remarks API (CASE INSENSITIVE)
app.get('/api/fetch-remarks', async (req, res) => {
  const { plantName, truckNo } = req.query;
  try {
    // Step 1: Get PlantID
    const plantResult = await pool.query(
      'SELECT PlantID FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = LOWER(TRIM($1)) LIMIT 1',
      [plantName]
    );
    if (plantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    const plantId = plantResult.rows[0].plantid;

    // Step 2: Get TransactionID
    const txnResult = await pool.query(
      'SELECT TransactionID FROM TruckTransactionMaster WHERE TruckNo = $1 LIMIT 1',
      [truckNo]
    );
    if (txnResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    const transactionId = txnResult.rows[0].transactionid;

    // Step 3: Fetch Remarks
    const remarksResult = await pool.query(
      `SELECT Remarks 
       FROM TruckTransactionDetails 
       WHERE PlantID = $1 AND TransactionID = $2 LIMIT 1`,
      [plantId, transactionId]
    );
    if (remarksResult.rows.length === 0) {
      return res.status(404).json({ message: 'Remarks not found' });
    }
    const remarks = remarksResult.rows[0].remarks;
    res.json({ remarks });
  } catch (error) {
    console.error('Error fetching remarks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});