const express = require('express');
const router = express.Router();

//루트 get 요청일 때의 응답
//서버 띄우고 http://localhost:3000 하면 Hello World라 뜰 것
router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;