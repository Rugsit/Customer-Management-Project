const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const process = require("process");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '172.26.240.1',
  user: 'root',
  password: '', 
  database: 'company',
});

db.connect((err) => {
if (err) {
  console.log(err);
} else {
  console.log("Connect database success");
}
});

app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customer ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

app.post("/customers", (req, res) => {
  let data = req.body;
  db.query(`INSERT INTO customer (first_name, last_name, date_of_birth, phone, email, ban) VALUES ("${data.first_name}", "${data.last_name}", "${data.date_of_birth}", "${data.phone}", "${data.email}", "${data.ban}")`, (err, result) => {
      if (err) {
        res.status(400).send();
        console.log(err);
      } else {
        res.send(result);
      }
    })
})

app.put("/customers/:id", (req, res) => {
  let id = req.params.id;
  let data = req.body;
  db.query(`UPDATE customer SET first_name="${data.first_name}", last_name="${data.last_name}", date_of_birth="${data.date_of_birth}", phone="${data.phone}", email="${data.email}", ban="${data.ban}" WHERE id = ${id};`, (err, result) => {
    if (err) {
      res.status(400).send();
    } else {
      db.query("SELECT * FROM customer ORDER BY id DESC", (err, resultALlList) => {
        if (err) {
          res.status(500).send();
        } else {
          res.send(resultALlList);
        }
      })
    }
  })
})

app.delete("/customers/:id", (req, res) => {
  db.query(`DELETE FROM customer WHERE id = ${req.params.id}`, (err, result) => {
    if (err) {
      res.status(404).send()
    } else {
      res.send(result);
    }
  })
})

app.use("/", (res) => {
  res.send("Server is running...");
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("Server is running on port 3000");
})
