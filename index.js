const express = require('express');
const mysql = require('mysql2');
const redis = require('redis');
const config = require('./config');

const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createConnection(config.mysql);

db.connect(err => {
  if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
  }
  console.log('MySQL에 연결되었습니다.');
});

// Redis 클라이언트 초기화 및 연결 설정
const redisClient = redis.createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`
});

redisClient.on('error', (err) => {
  console.error('Redis 연결 오류:', err);
});

redisClient.connect().then(() => {
  console.log('Redis에 연결되었습니다.');

  // 데이터 조회 API
  app.get('/data/:id', async (req, res) => {
    const { id } = req.params;

    try {
      // Redis에서 데이터 조회
      const data = await redisClient.get(id);
      
      if (data) {
        // Redis에 데이터가 있으면 반환
        res.send(JSON.parse(data));
      } else {
        // Redis에 데이터가 없으면 MySQL에서 조회
        db.query('SELECT * FROM your_table WHERE id = ?', [id], (err, results) => {
          if (err) {
            console.error('MySQL 조회 오류:', err);
            res.status(500).send('서버 오류');
            return;
          }

          if (results.length > 0) {
            const result = results[0];

            // Redis에 데이터 저장 (캐싱)
            redisClient.setEx(id, 3600, JSON.stringify(result));

            // 데이터 반환
            res.send(result);
          } else {
            res.status(404).send('데이터를 찾을 수 없습니다.');
          }
        });
      }
    } catch (err) {
      console.error('Redis 조회 오류:', err);
      res.status(500).send('서버 오류');
    }
  });

  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
  });
}).catch((err) => {
  console.error('Redis 연결 오류:', err);
});