const mongoose = require('mongoose');
const User = require('./../models/User');
const MealEvent = require('./../models/MealEvent');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  useUnifiedTopology: true,
})
.then(() => insertFirst())
.catch(err => console.log(err));


function insertFirst() {
  const pr1 = User.create({
    name: 'Drop' ,
    email: 'Drop' ,
    password: 'Drop' ,
    address: {
      street: 'Drop' ,
      zipcode: 'Drop' ,
      houseNumber: 'Drop' ,
      city: 'Drop' 
  },
    description: 'Drop' ,
    profileImg: 'Drop' ,
    score: 2 ,
    hostedEvents: [],
    attendedEvents: [],
    reviews: 'Drop' ,
    requests: 'pending'
  });

  const pr2 = MealEvent.create({
    eventName: 'Drop' ,
    cuisine: 'Drop',
    dish: 'Drop' ,
    date: Date.now(),
    host: mongoose.Types.ObjectId("5dd2b9e73c21cf0df04e2c46"),
    guest: [],
    eventDescription:'Drop' ,
    numberAttend: 2 ,
    costScore: 3
  });


  Promise.all([pr1,pr2])
  .then( () => {
    dropCollections();
  })
  .catch( (err) => console.log(err));

}

function dropCollections(){
const dropPromise1 = User.collection.drop();
const dropPromise2 = MealEvent.collection.drop();

Promise.all([dropPromise1, dropPromise2])
    .then(() => {
      console.log('Collections dropped successfully');

      populateDatabase();
    })
    .catch(err => console.log(err));

}

function populateDatabase(){

const users = [
  {
    name: 'Julia Roberts' ,
      email: 'test@test.com' ,
      password: 'test123' ,
      address: {
        street: 'Flowers Street' ,
        zipcode: '08962' ,
        houseNumber: '123' ,
        city: 'Barcelona' 
    },
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate' ,
      profileImg: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80' ,
      score: 2 ,
      hostedEvents: [],
      attendedEvents: [],
      reviews: ['lorem ipsum'] ,
      requests: 'pending'

    },
    {
      name: 'Bob' ,
        email: 'test@test.com' ,
        password: 'test123' ,
        address: {
          street: 'Flowers Street' ,
          zipcode: '08962' ,
          houseNumber: '123' ,
          city: 'Barcelona' 
      },
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate' ,
        profileImg: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80' ,
        score: 2 ,
        hostedEvents: [],
        attendedEvents: [],
        reviews: ['lorem ipsum'] ,
        requests: 'pending'
  
      }
  ]

  const mealEvents = [
    {
      "eventName": "Entroflex",
      "cuisine": "Quility",
      "date": Date.now(),
      "dish": "Quonk",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e08776c6a58d31d9d57e",
      "guest": [],
      "eventDescription": "Medmex",
      "numberAttend": 12,
      "costScore": 30
    },
    {
      "eventName": "Xleen",
      "cuisine": "Comvene",
      "date": Date.now(),
      "dish": "Lovepad",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e0872719e12d0da6f44d",
      "guest": [],
      "eventDescription": "Comveyer",
      "numberAttend": 39,
      "costScore": 37
    },
    {
      "eventName": "Songlines",
      "cuisine": "Bugsall",
      "date": Date.now(),
      "dish": "Codact",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e087d0f6f591af506e5f",
      "guest": [],
      "eventDescription": "Zillidium",
      "numberAttend": 20,
      "costScore": 28
    },
    {
      "eventName": "Gronk",
      "cuisine": "Eventix",
      "date": Date.now(),
      "dish": "Isosure",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e087005eaefb45a29b07",
      "guest": [],
      "eventDescription": "Flumbo",
      "numberAttend": 13,
      "costScore": 20
    },
    {
      "eventName": "Overfork",
      "cuisine": "Maineland",
      "date": Date.now(),
      "dish": "Oronoko",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e087935ed84880840677",
      "guest": [],
      "eventDescription": "Verton",
      "numberAttend": 9,
      "costScore": 27
    },
    {
      "eventName": "Geekular",
      "cuisine": "Geekfarm",
      "date": Date.now(),
      "dish": "Boink",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e087d4da6c73000dfb39",
      "guest": [],
      "eventDescription": "Bytrex",
      "numberAttend": 38,
      "costScore": 36
    },
    {
      "eventName": "Ovation",
      "cuisine": "Comcur",
      "date": Date.now(),
      "dish": "Iplax",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e087b85c8d113f20cb8c",
      "guest": [],
      "eventDescription": "Poochies",
      "numberAttend": 34,
      "costScore": 28
    },
    {
      "eventName": "Callflex",
      "cuisine": "Premiant",
      "date": Date.now(),
      "dish": "Xyqag",
      "eventImg": "http://placehold.it/32x32",
      "host": "5dd7e08775dbf7cb0438ced1",
      "guest": [],
      "eventDescription": "Ecratic",
      "numberAttend": 31,
      "costScore": 32
    }
  ]



  const usersPromise = User.create(users);
  const eventsPromise = MealEvent.create(mealEvents);


  Promise.all([usersPromise, eventsPromise])
    .then( (insertedData) => {
      console.log('USERS', insertedData[0]);
      console.log('EVENTS', insertedData[1]);

      const users = insertedData[0];
      const events = insertedData[1];

      events.map((event) => {
        const num = Math.floor(Math.random() * (users.length));
        const id = users[num]._id;
        console.log('RANDOM ID', id);
        return MealEvent.updateOne({ _id: event._id}, {$set: { host: "ObjectId(`${id}`)" }})
      })
    })
    .catch( (err) => console.log(err));
}