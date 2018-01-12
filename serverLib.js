let registeredUsers = [{userName:'arvinds',password:"arvind singh"}];

const fs = require('fs');
const timeStamp = ()=>{
  let t = new Date();
  return `${t.toDateString()} ${t.toLocaleTimeString()}`;
}

const toS = (o)=>JSON.stringify(o,null,2);

const getHeader = function (file) {
  let fileType = file.split('.')[1];
  let headers = {
    'css': 'text/css',
    'html': 'text/html',
    'js': 'text/javascript',
    'png': 'image/png',
    'gif': 'image/gif',
    'jpg': 'image/jpg',
    'pdf': 'application/pdf'
  }
  return headers[fileType];
};

exports.serveFile = function (req, res) {
  let filePath = `public${req.url}`;
  if (req.method == 'GET' && fs.existsSync(filePath)) {
    res.setHeader("content-type",getHeader(filePath));
    res.write(fs.readFileSync(filePath));
    res.end();
  }
}

exports.logRequest = (req,res)=>{
  let text = ['----------------------------',
  `${timeStamp()}`,
  `${req.method} ${req.url}`,
  `HEADERS=> ${toS(req.headers)}`,
  `COOKIES=> ${toS(req.cookies)}`,
  `BODY=> ${toS(req.body)}`,
  ''
  ].join('\n');
  fs.appendFile('request.log',text,()=>{})
  // console.log(`${req.method} ${req.url}`);
}
exports.loginHandler = (req,res)=>{
  let user = registeredUsers.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true; Max-Age=5`);
    res.redirect('/loginPage.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home.html');
}

exports.logoutHandler = (req,res)=>{
  res.setHeader('set-cookie',[`sessionid=0; Expires=new Date(0);`,
  `logInFailed=false; Expires=new Date(0);`]);
  res.redirect('/loginPage.html');
}

exports.loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registeredUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
