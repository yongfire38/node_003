const express = require('express');
const router = express.Router();

// posts get방식 요청일 때는 json으로 응답
//서버 띄우고 http://localhost:3000/posts 하면 json data가 뜰 것
//경로에 따라 다른 서비스를 제공 하는 것을 라우팅이라고 함

//restful api의 표준은 json
//json은 자바스크립트 객체 타입의 표현과 동일하기 때문에 데이터 컨버전이 필요 없음

//자바에서 데이터를 json타입으로 변환하여 다룰 때 애 좀 먹었던 것을 기억할 것임(데이터 타입 안 맞아서 나는 에러)

//restful api의 url 작성 가이드라인에 따라 get 방식이면 전체 보기
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
    // :id에 해당하는 글 번호를 몽고디비에서 조회해서 내용을 보내준다(json)
    res.send(req.params.id + '번 글을 요청하셨네요.');
});

//글 등록 : url은 동일하지만 post 방식으로 : restful 가이드라인..
router.post('/', async (req, res) => {
    //글 데이터가 클라이이언트로부터 올라오면 그 데이터를 몽고디비에 저장
    //저장하고 나면 잘 저장됐다라고 응답

    const post = req.body;
    //클라이언트의 요청 글 데이터로 스키마를 만들고
    const postModel = new Post(post);
    //만든 스키마를 저장. promise 패턴으로 확인
    /* postModel.save().then(() => {       
        res.send('글 등록 완료! promise 패턴 ok');
    }); */

    //async await 패턴(함수 선언시 async 붙이고 비동기 처리할 부분에는 await라고 선언)
    try{
        const saved = await postModel.save();
        res.json(saved);
    }catch(err){
        res.json(err);
    }
    


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
router.put('/:id', (req, res) => {
    res.send('글 수정 완료요.');
});

//글 삭제 : url은 동일하지만 delete 방식으로 : restful 가이드라인..
//전체 삭제와의 차이는 id 들어가냐 마냐
router.delete('/:id', (req, res) => {
    res.send(req.params.id + '번 글을 삭제 요청하셨네요.');
});

module.exports = router;