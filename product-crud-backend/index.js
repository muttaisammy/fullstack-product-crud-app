const mysql = require("mysql");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const express = require("express");
const fs = require("fs");
require('dotenv').config()
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass",
  database: "PRODUCTS",
});

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(req.body, "in");
    cb(null, `${req.body.productId}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname ,'uploads')));


app.post("/thumbnailUpload", upload.single("productThumbnail"), (req, res) => {
  try {
    console.log(req.file) ;
    return res.json({ data: req.file.filename });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/products", (req, res) => {
    const q = "select * from product";
    db.query(q, (err, data) => {
      if (err) {
        res.send(err)
      }else {
        res.json({ data });
      }

    });
  });
  app.post("/products", (req, res) => {
    const q = `insert into product(productID, productTitle, productDescription, productPrice, availableQuantity, productThumbnail)
      values(?)`;
    const values = [...Object.values(req.body)];
    db.query(q, [values], (err, data) => {
      if (err) return res.json({ error: err.sqlMessage });
      if(data.affectedRows == 1) {
        res.send('Data inserted successfully')
      }
    });
  });
  
  app.get("/products/:productId", (req, res) => {
    const id = req.params.productId;
    const q = "SELECT * FROM product where productId=?";
    db.query(q, [id], (err, data) => {
      if(err) {
        console.log(err)
      }else {
        if(data.length > 0) {
          res.json(data)
        }
        res.json({message: 'No data found!'})
      
      }
    });
  });
  
  app.put("/products/:productId", (req, res) => {
    const id = req.params.productId;
    const data = req.body;
    if (data.productPrice) data.productPrice = Number.parseInt(data.productPrice);
    if (data.availableQuantity)
      data.availableQuantity = Number.parseInt(data.availableQuantity);
    const q =
      "update product set " +
      Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(",") +
      " where productId='" +
      id +
      "'";
    db.query(q, [...Object.values(data)], (err, out) => {
      console.log(err, out);
      if (err) return res.json({ error: err.message });
      else {
        return res.json({ data: out });
      }
    });
  });
  
  app.delete("/products/:productId", (req, res) => {
    const id = req.params.productId;
    console.log("deleting " + id, req.body);
    const { productThumbnail } = req.body;
    console.log(req.body);
    const q = `DELETE FROM product WHERE productId= ?`;
    db.query(q, [id], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});

app.listen(3000, () => {
  console.log(`server runnning PORT 3000`)
  db.connect((err) => {
    if(err) throw err;

    console.log('Database connected')
  })
})