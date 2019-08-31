const express = require('express');

//body-parser : 데이터가 form 방식일 때 파싱을 하기 위한 미들웨어
const bodyParser = require('body-parser');

//mongoose : ode - mongoDB간 미들웨어(ODM : object-document mapping)
const mongoose = require('mongoose');
//유저가 만든 모듈 임포트 시에는 상대경로로 작성
const Post = require('./schema/post');

//로그 확인
const logger = require('morgan');

//라우터 설정 js파일 임포트
const indexRouter = require('./routers/index');
const postsRouter = require('./routers/posts');

require('dotenv').config();

const app = express();

//로그 확인 미들웨어 사용
app.use(logger('dev'));

//스키마 생성 체크
/* if(Post){
    console.log('스키마 생성 성공');
}else{
    console.log('스키마 생성 실패');
}; */

//then()을 이용한 promise 패턴으로 연결 여부 확인 
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-gylqx.mongodb.net/test?retryWrites=true&w=majority`, 
                {useNewUrlParser: true}
 ).then(()=>{
    console.log('mongoDB 연결이 정상적으로 처리되었습니다.');
 }, err => {
    //화살표 함수에서 파라미터가 하나뿐이면 괄호 생략 가능 
    console.log('mongoDB 연결 실패.');
 });

const db = mongoose.connection;

//body-parser 사용시 옵션은 이렇게 준다
//데이터가 form 방식(x-www-form-urlencoded)일 때 파싱
//객체 안에 있는 객체도 파싱할 건지 말건지 결정하는 옵션
app.use(bodyParser.urlencoded({ extended: false }));

//데이터가 json 방식일 때 파싱
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/posts', postsRouter);

//마지막까지 매칭되는 응답이 없을 경우(상단에 작성한 url과 전부 다르면)
app.use('*',(req, res) => {
    res.send('잘못된 URL요청입니다.');
})

//3000번 포트를 통해 서버를 올리고 나면 콜백 함수 실행
//익명함수는 화살표 함수로 바꿀 수 있음
app.listen(3000, () => {
    console.log('server ready on port 3000!!');
});