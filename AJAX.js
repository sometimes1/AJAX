'use strict';

var http = require('http')
var fs = require('fs')
var url = require('url')

//console.log(Object.keys(http))
var port =8080;

var server = http.createServer(function(request, response){

  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method

  //从这里开始看，上面不要看
  if(method === 'GET'){
    if(path === '/'){  // 如果用户请求的是 / 路径
      var string = fs.readFileSync('./index.html')  
      response.setHeader('Content-Type', 'text/html;charset=utf-8')  
      response.end(string)   
    }else if(path === '/xxx'){   
     response.setHeader('Content-Type', 'text/html;charset=utf-8')
      response.end('Hello AJAX!')
    }else if(path === '/main.js'){  
      var string = fs.readFileSync('./main.js')
      response.setHeader('Content-Type', 'application/javascript')
      response.end(string)
    }else{  
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/html;charset=utf-8') 
      response.end('找不到对应的路径，你需要自行修改 index.js')
    }
  }else if(method === 'POST'){
    if(path === '/xxx'){
      response.setHeader('Content-Type', 'text/html;charset=utf-8') 
      readBody(request, function(body){
        let parts = body.split('&')
        let yyy = parts[0].split('=')[1]
        let zzz = parts[1].split('=')[1]
        let errors = {} 

        if(yyy.trim() === ''){
          errors['yyy'] = '用户名不能为空'
        }else if(yyy === 'fang'){
          if(zzz === ''){
            errors['zzz'] = '密码不能为空'
          }else if(zzz !== '123123'){
            errors['zzz'] = '密码错误'
          }
        }else{
          errors['yyy'] = '用户名不存在'
        }
        if(zzz === ''){
          errors['zzz'] = '密码不能为空'
        }

        if(Object.keys(errors).length > 0){
          response.statusCode = 412
          var string = JSON.stringify({errors:errors})
          response.end(string)
        }else{
          response.statusCode = 200
          response.setHeader('Content-Type', 'text/html;charset=utf-8')
			response.end('Hello fang!')
        }
      })
    }else{
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/html;charset=utf-8') 
      response.end('再见，来不及挥手')
    }
  }

  // 代码结束，下面不要看
  console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

function readBody(request, callback){
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    callback.call(null, body)
  })
}
