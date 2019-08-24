const express = require('express');

//body-parser : 데이터가 form 방식일 때 파싱을 하기 위한 미들웨어
const bodyParser = require('body-parser');

//mongoose : ode - mongoDB간 미들웨어(ODM : object-document mapping)
const mongoose = require('mongoose');
//유저가 만든 모듈 임포트 시에는 상대경로로 작성
const Post = require('./schema/post');

const app = express();

//스키마 생성 체크
/* if(Post){
    console.log('스키마 생성 성공');
}else{
    console.log('스키마 생성 실패');
}; */

//then()을 이용한 promise 패턴으로 연결 여부 확인 
mongoose.connect('mongodb+srv://yongfire38:phj1143915!@cluster0-gylqx.mongodb.net/test?retryWrites=true&w=majority', 
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

//루트 get 요청일 때의 응답
//서버 띄우고 http://localhost:3000 하면 Hello World라 뜰 것
app.get('/', (req, res) => {
    res.send('Hello World');
});

// posts get방식 요청일 때는 json으로 응답
//서버 띄우고 http://localhost:3000/posts 하면 json data가 뜰 것
//경로에 따라 다른 서비스를 제공 하는 것을 라우팅이라고 함

//restful api의 표준은 json
//json은 자바스크립트 객체 타입의 표현과 동일하기 때문에 데이터 컨버전이 필요 없음

//자바에서 데이터를 json타입으로 변환하여 다룰 때 애 좀 먹었던 것을 기억할 것임(데이터 타입 안 맞아서 나는 에러)

//restful api의 url 작성 가이드라인에 따라 get 방식이면 전체 보기
app.get('/posts', (req, res) => {
    //get 방식의 url에 쿼리스트링이 붙어있으면 그걸 받음
    const pageNumber = req.query.page;

    console.log('페이지 번호는 : '+pageNumber);

    Post.find(/* {author : "park 3호기"}, */(err, posts) => {
        //console.log(posts);
        res.json(posts);
    });
});

//restful api의 url 작성 가이드라인에 따라 get 방식+특정아이디이면 상세 보기
//url 바인드해서 받는 거랑 requset의 param 받는 법 주목
app.get('/posts/:id', (req, res) => {
    // :id에 해당하는 글 번호를 몽고디비에서 조회해서 내용을 보내준다(json)
    res.send(req.params.id + '번 글을 요청하셨네요.');
});

//글 등록 : url은 동일하지만 post 방식으로 : restful 가이드라인..
app.post('/posts', (req, res) => {
    //글 데이터가 클라이이언트로부터 올라오면 그 데이터를 몽고디비에 저장
    //저장하고 나면 잘 저장됐다라고 응답

    const post = req.body;
    //클라이언트의 요청 글 데이터로 스키마를 만들고
    const postModel = new Post(post);
    //만든 스키마를 저장
    postModel.save();

    res.json('글 등록 완료!');

    /* 
    데이터가 form 방식(x-www-form-urlencoded)일 때
    const title = req.body['title'];
    const content = req.body['content'];
    const author = req.body['author'];

    console.log(req.body);
    res.send(title + ' : '+ content + ' : '+ author); */

});

//글 수정 : url은 동일하지만 put 방식으로 : restful 가이드라인..
//전체 수정과의 차이는 id 들어가냐 마냐
app.put('/posts/:id', (req, res) => {
    res.send('글 수정 완료요.');
});

//글 삭제 : url은 동일하지만 delete 방식으로 : restful 가이드라인..
//전체 삭제와의 차이는 id 들어가냐 마냐
app.delete('/posts/:id', (req, res) => {
    res.send(req.params.id + '번 글을 삭제 요청하셨네요.');
});

//마지막까지 매칭되는 응답이 없을 경우(상단에 작성한 url과 전부 다르면)
app.use('*',(req, res) => {
    res.send('잘못된 URL요청입니다.');
})


//3000번 포트를 통해 서버를 올리고 나면 콜백 함수 실행
//익명함수는 화살표 함수로 바꿀 수 있음
app.listen(3000, () => {
    console.log('server ready on port 3000!!');
});