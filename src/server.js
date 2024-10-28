const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'web_trang_thong_tin'
});

db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
  } else {
    console.log('Đã kết nối thành công với MySQL');
  }
});

app.get('/api/posts', (req, res) => {
  const query = 'SELECT * FROM bai-viet';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      res.status(500).send('Lỗi truy vấn cơ sở dữ liệu');
    } else {
      res.json(results);
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${PORT}`);
});