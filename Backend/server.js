// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'Soham2709', // Replace with your MySQL password
  database: 'SALES_DATA', // Replace with your database name
  // waitForConnections: true, // Wait for free connections in pool
  // connectionLimit: 10,      // Set a connection limit
  // queueLimit: 0
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Fetch user data from MySQL
app.get('/users', (req, res) => {
  const sqlQuery = 'SELECT CUSTOMER_NAME, INVOICE_NO,CAST(INVOICE_DATE AS CHAR) AS INVOICE_DATE, INVOICE_QTY, INVOICE_PRICE FROM INVOICE;'; // Adjust this query for your table structure
  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.get('/users/total', (req, res) => {
  const sqlQuery = `
    SELECT COUNT(DISTINCT CUSTOMER_NAME) AS TOTAL_CUSTOMERS
    FROM INVOICE;
  `;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result); // Send the total customers as a response
  });
});

// Fetch top customer by week
app.get('/sales/week', (req, res) => {
  const sqlQuery = `
    SELECT CUSTOMER_NAME, 
           SUM(INVOICE_QTY * INVOICE_PRICE) AS TOTAL_AMOUNT, 
           YEARWEEK(INVOICE_DATE, 1) AS WEEK
    FROM INVOICE
    WHERE YEARWEEK(INVOICE_DATE, 1) = YEARWEEK(CURDATE(), 1)
    GROUP BY CUSTOMER_NAME, YEARWEEK(INVOICE_DATE, 1)
    ORDER BY TOTAL_AMOUNT DESC
    LIMIT 5;
  `;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.get('/sales/last-week', (req, res) => {
  const sqlQuery = `
    SELECT CUSTOMER_NAME, 
           SUM(INVOICE_QTY * INVOICE_PRICE) AS TOTAL_AMOUNT, 
           YEARWEEK(INVOICE_DATE, 1) AS WEEK
    FROM INVOICE
    WHERE YEARWEEK(INVOICE_DATE, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
    GROUP BY CUSTOMER_NAME, YEARWEEK(INVOICE_DATE, 1)
    ORDER BY TOTAL_AMOUNT DESC
    LIMIT 5;
  `;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});



// Fetch top customer by month
app.get('/sales/month', (req, res) => {
  const sqlQuery = `
    SELECT CUSTOMER_NAME, 
           SUM(INVOICE_QTY * INVOICE_PRICE) AS TOTAL_AMOUNT, 
           DATE_FORMAT(INVOICE_DATE, '%Y-%m') AS MONTH
    FROM INVOICE
    WHERE YEAR(INVOICE_DATE) = YEAR(CURDATE()) 
      AND MONTH(INVOICE_DATE) = MONTH(CURDATE())
    GROUP BY CUSTOMER_NAME, DATE_FORMAT(INVOICE_DATE, '%Y-%m')
    ORDER BY TOTAL_AMOUNT DESC
    LIMIT 5;
  `;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

app.get('/sales/last-month', (req, res) => {
  const sqlQuery = `
    SELECT CUSTOMER_NAME, 
           SUM(INVOICE_QTY * INVOICE_PRICE) AS TOTAL_AMOUNT, 
           DATE_FORMAT(INVOICE_DATE, '%Y-%m') AS MONTH
    FROM INVOICE
    WHERE DATE_FORMAT(INVOICE_DATE, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
    GROUP BY CUSTOMER_NAME, MONTH
    ORDER BY TOTAL_AMOUNT DESC
    LIMIT 5;
  `;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Fetch top customer by year
// app.get('/sales/year', (req, res) => {
//   const sqlQuery = `
//     SELECT CUSTOMER_NAME, SUM(INVOICE_QTY * INVOICE_PRICE) AS TOTAL_AMOUNT, YEAR(INVOICE_DATE) AS YEAR
//     FROM INVOICE
//     GROUP BY CUSTOMER_NAME, YEAR(INVOICE_DATE)
//     ORDER BY TOTAL_AMOUNT DESC
//     LIMIT 5;
//   `;
//   db.query(sqlQuery, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(result);
//   });
// });
// app.get('/sales/last-year', (req, res) => {
//   const sqlQuery = `
//     SELECT CUSTOMER_NAME, 
//            SUM(INVOICE_QTY * INVOICE_PRICE) AS TOTAL_AMOUNT, 
//            YEAR(INVOICE_DATE) AS YEAR
//     FROM INVOICE
//     WHERE YEAR(INVOICE_DATE) = YEAR(CURDATE() - INTERVAL 1 YEAR)
//     GROUP BY CUSTOMER_NAME, YEAR
//     ORDER BY TOTAL_AMOUNT DESC
//     LIMIT 5;
//   `;

//   db.query(sqlQuery, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(result);
//   });
// });


// app.get('/sales/custom-range', (req, res) => {
//   const { startDate, endDate } = req.query;

//   const sqlQuery = `
//     SELECT CUSTOMER_NAME, 
//            SUM(INVOICE_QTY * INVOICE_PRICE) AS TOTAL_AMOUNT
//     FROM INVOICE
//     WHERE INVOICE_DATE BETWEEN ? AND ?
//     GROUP BY CUSTOMER_NAME
//     ORDER BY TOTAL_AMOUNT DESC
//     LIMIT 5;
//   `;

//   db.query(sqlQuery, [startDate, endDate], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(result);
//   });
// });

// app.get('/sales/monthly-total', (req, res) => {
//   const year = req.query.year || new Date().getFullYear(); // Default to the current year

//   const query = `
//       SELECT 
//     MONTH(INVOICE_DATE) AS Month,
//     SUM(INVOICE_QTY * INVOICE_PRICE) AS TotalSales
// FROM 
//     INVOICE
// WHERE 
//     INVOICE_DATE >= '2024-01-01' AND INVOICE_DATE < '2024-12-12'  -- Filter for the entire year
// GROUP BY 
//     MONTH(INVOICE_DATE)
// ORDER BY 
//     Month;

//   `;

//   db.query(query, [year], (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }

//     res.json(results);
//   });
// });

// Assuming `db` is your MySQL connection instance
app.get('/sales/spc-data', (req, res) => {
  const query = `
    SELECT Parameter_Id, Reading, 
           \`Actual Diameter\` AS Value, 
           \`Upper Control Limit\` AS UpperControl,
           \`Lower Control Limit\` AS LowerControl,
           \`Mean Diameter\` AS Mean,
           \`Lower MAX\` AS LowerMAX,
           \`Upper MAX\`AS UpperMAX
         
    FROM SPC_Data
  `;

  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send("Error fetching SPC data");
      return;
    }

    // Group data by Parameter_Id
    const groupedData = results.reduce((acc, row) => {
      if (!acc[row.Parameter_Id]) {
        acc[row.Parameter_Id] = [];
      }
      acc[row.Parameter_Id].push({
        name: row.Reading,
        Value: parseFloat(row.Value),
        UpperControl: parseFloat(row.UpperControl),
        LowerControl: parseFloat(row.LowerControl),
        Mean: parseFloat(row.Mean),
        LowerMAX: parseFloat(row.LowerMAX),
        UpperMAX: parseFloat(row.UpperMAX),
        // LowerLimit: parseFloat(row.LowerSpecLimit),
        // UpperLimit: parseFloat(row.UpperSpecLimit)
      });
      return acc;
    }, {});

    res.json(groupedData);
  });
});






app.get('/sales/parameters', (req, res) => {
  const query = `SELECT  Parameter_Id, Parameter_Name FROM SPC_Parameter;`;
  db.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Error fetching parameter IDs' });
    }
    res.json(rows.map(row => row.Parameter_Id));
  });
});







// Endpoint to get SPC data with mean and control limits
// app.get('/sales/spc-data/mean', (req, res) => {
//     const query = `
//         SELECT
//             reading_id,
//             AVG(actual_diameter) AS mean_actual_diameter,
//             AVG(mean_diameter) AS mean_of_mean_diameter,
//             MIN(actual_diameter) AS min_actual_diameter,
//             MAX(actual_diameter) AS max_actual_diameter,
            
//             /* Calculation of Control Limits */
//             AVG(actual_diameter) - 3 * STDDEV_POP(actual_diameter) AS lower_control_limit,
//             AVG(actual_diameter) + 3 * STDDEV_POP(actual_diameter) AS upper_control_limit,
            
//             /* Spec Limits if required */
//             MIN(actual_diameter) AS spec_lower_limit,
//             MAX(actual_diameter) AS spec_upper_limit

//         FROM
//             your_table_name
//         GROUP BY
//             reading_id;
//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             res.status(500).send('Server error');
//             return;
//         }
        
//         // Send results as JSON
//         res.json(results);
//     });
// });


//crud querries

//Create a new invoice (CREATE)
app.post('/invoices/create', (req, res) => {
  const { CUSTOMER_NAME, INVOICE_NO, INVOICE_DATE, INVOICE_QTY, INVOICE_PRICE } = req.body;
  const query = 'INSERT INTO INVOICE (CUSTOMER_NAME, INVOICE_NO, INVOICE_DATE, INVOICE_QTY, INVOICE_PRICE) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [CUSTOMER_NAME, INVOICE_NO, INVOICE_DATE, INVOICE_QTY, INVOICE_PRICE], (err, result) => {
    if (err) {
      console.error('Error creating invoice:', err);
      res.status(500).send('Error creating invoice');
      return;
    }
    res.send('Invoice created successfully');
  });
});

// Read all invoices
app.get('/invoices/read', (req, res) => {
  const query = 'SELECT * FROM INVOICE';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      res.status(500).send('Error fetching invoices');
      return;
    }
    res.json(results);
  });
});

// Update an invoice
app.put('/invoices/update/:id', (req, res) => {
  const { id } = req.params;
  const { CUSTOMER_NAME, INVOICE_NO, INVOICE_DATE, INVOICE_QTY, INVOICE_PRICE } = req.body;
  const query = 'UPDATE INVOICE SET CUSTOMER_NAME = ?, INVOICE_NO = ?, INVOICE_DATE = ?, INVOICE_QTY = ?, INVOICE_PRICE = ? WHERE ID = ?';
  db.query(query, [CUSTOMER_NAME, INVOICE_NO, INVOICE_DATE, INVOICE_QTY, INVOICE_PRICE, id], (err, result) => {
    if (err) {
      console.error('Error updating invoice:', err);
      res.status(500).send('Error updating invoice');
      return;
    }
    res.send('Invoice updated successfully');
  });
});

// Delete an invoice
app.delete('/invoices/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM INVOICE WHERE ID = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting invoice:', err);
      res.status(500).send('Error deleting invoice');
      return;
    }
    res.send('Invoice deleted successfully');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
