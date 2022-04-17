const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/post');
const { errorHandle, successHandle } = require('./config/index');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
.connect(DB)
.then(() => console.log('資料庫連接成功'))
.catch((err) => { console.error(err) });

const requestListener = async(req, res)=>{
  let body = '';
  req.on('data', chunk=>{
      body+=chunk;
  })
  
  if(req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find();
    successHandle(res, posts);
  }else if(req.url === '/posts' && req.method === 'POST') {
    req.on('end', async() => {
      try {
        const data = JSON.parse(body);
        if(data.content !== undefined) {
          const newPost = await Post.create({
            name: data.name,
            content: data.content,
            image: data.image
          })
          successHandle(res, newPost);
        }else {
          errorHandle(res, '未正確填寫欄位!');
        }
      }catch(err) {
        errorHandle(res, err);
      }
    })
  }else if(req.url === '/posts/' && req.method === 'PATCH'){
    const id = req.url.split('/').pop();
    const data = JSON.parse(body);
    const post = await Post.findByIdAndUpdate(id, data, { new: true });
    successHandle(res, post);
  }else if(req.url === '/posts/' && req.method === 'DELETE'){
    const id = req.url.split('/').pop();
    await Post.findByIdAndDelete(id);
    successHandle(res, null);
  }else if (req.url == '/posts' && req.method == 'DELETE') {
    await Post.deleteMany({});
    successHandle(res, []);
  }else if (req.method === 'OPTIONS') {
    successHandle(res, {});
  }
  else {
    errorHandle(res, '無此網站路由', 404);
  }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);