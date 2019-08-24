//데이터 모델(스키마) 정의
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const postSchema = new Schema({
    title : {
        type : String, 
        reqired : true,
        default : "무제"
    },
    content : String,
    author : String
});

module.exports = mongoose.model("posts", postSchema);