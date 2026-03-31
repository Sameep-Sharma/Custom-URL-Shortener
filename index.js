const express = require("express");
const { connectToMongoDb} = require('./connections')
const app = express();
const PORT = 8001;
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const path = require('path')
const staticRoute = require("./routes/staticRouter")

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

app.use(express.urlencoded({extended:false}));//taaki form data bhi accept kare


app.use('/url',urlRoute);

app.use("/",staticRoute)

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