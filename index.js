const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId; 


const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kgr12.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookingsCollection = client.db("phoneRepairStore").collection("bookings");
  const reviewsCollection = client.db("phoneRepairStore").collection("reviews");
  const servicesCollection = client.db("phoneRepairStore").collection("services");
  const adminCollection = client.db("phoneRepairStore").collection("admin");

  

  app.get("/bookings", (req, res) => {
    // console.log(req.query.email);

    bookingsCollection.find({email: req.query.email}).toArray((err, items) => {
      res.send(items)
    })
  })



  app.get("/allBookings", (req, res) => {
    bookingsCollection.find().toArray((err, items) => {
      res.send(items)
    })
  })


  app.get("/allBookings/:id", (req, res) => {
    bookingsCollection.find({_id:ObjectId(req.params.id)}).toArray((err, documents) => {
      res.send(documents[0])
    })
  })

 

  app.post("/addBookings", (req, res) => {
    const newBookings = req.body; 
    bookingsCollection.insertOne(newBookings)
    .then((result) => {
      res.send(result.insertedCount > 0); 
    })
  })



  

  app.get(`/bookings/:id`, (req, res) => { 
    const id = req.params.id;
  bookingsCollection.find({_id:ObjectId(req.params.id)}).toArray((err, items) => {
    res.send(items[0])
  });
});

  app.patch("/update/:id", (req, res) => {
    console.log(req.body.status);
    bookingsCollection.updateOne({_id:ObjectId(req.params.id)}, 
      {
        $set: {status: req.body.status}
      })
      .then(result => {
        console.log(result)
      })
  })






  app.get("/reviews", (req, res) => {
    reviewsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    console.log("add new review", newReview);
    reviewsCollection.insertOne(newReview).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    servicesCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });




  app.get(`/services/:id`, (req, res) => { 
      const id = req.params.id;
    servicesCollection.find({_id:ObjectId(req.params.id)}).toArray((err, items) => {
      res.send(items[0])
    });
  });

  app.post("/addService", (req, res) => {
    const newService = req.body;
    console.log("add new service", newService);
    servicesCollection.insertOne(newService).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete('/delete/:id', (req, res) => {
    servicesCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(  result => {
      console.log(result);
    })
  })


  app.post("/newAdmin", (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });


  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({email : email})
      .toArray((err, admins) => {
        res.send(admins.length > 0)
      })
  });
  



});




app.listen(process.env.PORT || port);
