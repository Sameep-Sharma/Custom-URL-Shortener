const express = require("express");
const { connectToMongoDb} = require('./connections')
const app = express();
const PORT = 8001;
const cookieParser = require('cookie-parser')
const URL = require('./models/url')
const path = require('path')

const {restrictToLoggedin,checkAuth} = require('./middleware/auth')

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
.then(()=>{
  console.log("DATA BASE CONNECTED");
    
});

app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.use(express.json());

app.get('/test',async (req,res) => {
  const allUrls  = await URL.find({});
  return res.render("home",{
    urls:allUrls,
    name:"Sameep"
  })
})

const urlRoute = require('./routes/url')
const staticRoute = require("./routes/staticRouter")
const userRoute = require('./routes/user')

app.use(express.urlencoded({extended:false}));//taaki form data bhi accept kare
app.use(cookieParser())



app.use('/url',restrictToLoggedin,urlRoute);

app.use("/user",userRoute);

app.use("/",checkAuth,staticRoute)





app.get('/url/:shortId',async (req,res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
    shortId
    },
    { 
      $push: {
      visitHistory: {
        timestamp : Date.now(),
      }
  },
  }
);
res.redirect(entry.redirectURL)
});


app.listen(PORT,() =>{
  console.log(`Server Started ${PORT}`);
  
});