const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const ejs = require('ejs')

const fontmin = require('./model/fontmin')
const index = require('./routes/index')

// 设置可用字体
const fonts = [
  {font: 'SourceHanSerifCN-Medium', name: '思源宋体'},
  {font: 'PangMenZhengDao', name: '庞门正道粗书体'},
  {font: 'RuiziGongfangMeiheiGBK', name: '锐字工房云字库美黑GBK'},
  {font: 'RuiziZhenyanti', name: '锐字真言体'},
  {font: 'YousheBiaotihei', name: '优设标题黑'},
  {font: 'Zihun116', name: '字魂116号-凤鸣手书'},
  {font: 'stkaiti', name: '华文楷体'}
]

const app = express()

// 配置模板引擎
app.engine('html', ejs.__express)
app.set('view engine', 'html')
// 配置静态web目录
app.use(express.static("static"))
// 配置第三方中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', index)

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  res.header('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
  
  next();
});

app.post('/getfontmin', (request, response) => {
  const params = request.body
  const font = params.font || 'stkaiti'
  const text = params.text
  // 如果传递的font字体在后台没有就返回400
  const item = fonts.find(e => e.font === font)
  if (item) {
    // var result = await fontmin(font, text)
    // console.log(result, 'result')
    // if(result === 'done') {
    //     let back = {
    //       // url: '/fontmin/font/' + font + '.ttf',
    //       url: '/font/' + font + '.ttf',
    //       font: font
    //     }
    //     response.send(back);
    // }
    fontmin(font, text, function (e) {
      if (e === 'done') {
        console.log('done')
        // 拼接参数 返回请求
        let back = {
          // url: '/fontmin/font/' + font + '.ttf',
          url: '/font/' + font + '.ttf',
          font: font
        }
        response.send(back);
      }
    });
  } else {
    response.status(400);
    response.send('没有请求的字体文件');
  }
})

app.get('delete', (request, response) => {
  fs.unlink('static/', (err) => {})
})

app.listen(3000);