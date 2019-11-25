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
    name: 'Drop',
    email: 'Drop',
    password: 'Drop',
    address: {
      street: 'Drop',
      zipcode: 'Drop',
      houseNumber: 'Drop',
      city: 'Drop'
    },
    description: 'Drop',
    profileImg: 'Drop',
    score: 2,
    hostedEvents: [],
    attendedEvents: [],
    reviews: 'Drop',
    requests: 'pending'
  });

  const pr2 = MealEvent.create({
    eventName: 'Drop',
    cuisine: 'Drop',
    dish: 'Drop',
    date: "2019-12-12T19:00",
    host: mongoose.Types.ObjectId("5dd2b9e73c21cf0df04e2c46"),
    guest: [],
    eventDescription: 'Drop',
    numberAttend: 2,
    costScore: 3
  });


  Promise.all([pr1, pr2])
    .then(() => {
      dropCollections();
    })
    .catch((err) => console.log(err));

}

function dropCollections() {
  const dropPromise1 = User.collection.drop();
  const dropPromise2 = MealEvent.collection.drop();

  Promise.all([dropPromise1, dropPromise2])
    .then(() => {
      console.log('Collections dropped successfully');

      populateDatabase();
    })
    .catch(err => console.log(err));

}

function populateDatabase() {

  const users = [{
      name: 'Julia Scarlett',
      email: 'julia@scarlett.com',
      password: 'Julia123!',
      address: {
        street: 'Flowers Street',
        zipcode: '08013',
        houseNumber: '123',
        city: 'Barcelona'
      },
      description: 'Engeneer looking for make new friends and meet the people next door',
      profileImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'

    },
    {
      name: 'Bob Bullin',
      email: 'bob@bullin.com',
      password: 'Bob123!',
      address: {
        street: 'Principal Street',
        zipcode: '08013',
        houseNumber: '345',
        city: 'Barcelona'
      },
      description: 'I love to meet people and share new adventures. I love sports and eat!',
      profileImg: 'https://images.unsplash.com/photo-1506919258185-6078bba55d2a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=515&q=80',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'

    },

    {
      name: 'Ana Martinez',
      email: 'ana@martinez.com',
      password: 'Ana123!',
      address: {
        street: 'Roses Street',
        zipcode: '08018',
        houseNumber: '345',
        city: 'Barcelona'
      },
      description: 'I am a veterinary looking for meet my neighbours and enjoy the life',
      profileImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'

    },

    {
      name: 'Laura Dee',
      email: 'laura@dee.com',
      password: 'Laura123!',
      address: {
        street: 'Main Street',
        zipcode: '08013',
        houseNumber: '345',
        city: 'Barcelona'
      },
      description: 'I am a student looking for share experiences. I love to meet people and share new adventures.',
      profileImg: 'https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'

    },
    {
      name: 'Suzy Willys',
      email: 'suzy@willys.com',
      password: 'Suzy123!',
      address: {
        street: 'Road Street',
        zipcode: '08013',
        houseNumber: '789',
        city: 'Barcelona'
      },
      description: 'A woman enjoying the life. Arts is a must in my life. Love pets and people!',
      profileImg: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'

    },
    {
      name: 'Lucy Miller',
      email: 'lucy@miller.com',
      password: 'Lucy123!',
      address: {
        street: 'Avenue street',
        zipcode: '08013',
        houseNumber: '789',
        city: 'Barcelona'
      },
      description: 'I love to meet people and share new adventures. I love sports and eat!',
      profileImg: 'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'

    },
    {
      name: 'Paul Lupp',
      email: 'paul@lupp.com',
      password: 'Paul123!',
      address: {
        street: 'Principal Street',
        zipcode: '08013',
        houseNumber: '345',
        city: 'Barcelona'
      },
      description: 'I love to meet people and share new adventures. I love sports and eat!',
      profileImg: 'https://images.unsplash.com/photo-1505503693641-1926193e8d57?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'

    },
    {
      name: 'Bobby Sullivann',
      email: 'bobby@sullivan.com',
      password: 'Bobby123!',
      address: {
        street: 'Most Street',
        zipcode: '08013',
        houseNumber: '389',
        city: 'Barcelona'
      },
      description: 'I love to meet people and share new adventures. I love sports and eat!',
      profileImg: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'
    },

    {
      name: 'David Foster',
      email: 'david@foster.com',
      password: 'David123!',
      address: {
        street: 'Principal Street',
        zipcode: '08013',
        houseNumber: '345',
        city: 'Barcelona'
      },
      description: 'A nice day that loves to play guitar. Looking people to share my love for sports and eat!',
      profileImg: 'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'
    },

    {
      name: 'Dan Gost',
      email: 'dan@gost.com',
      password: 'Dan123!',
      address: {
        street: 'Fort Street',
        zipcode: '08023',
        houseNumber: '123',
        city: 'Madrid'
      },
      description: 'I am a quimic engeneer looking to meet people and share my passion for books and pets',
      profileImg: 'https://images.unsplash.com/photo-1482235225574-c37692835cf3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      score: 2,
      hostedEvents: [],
      attendedEvents: [],
      reviews: [],
      requests: 'pending'
    }

  ]

  // const mealEvents = [{
  //     "eventName": "Paella Dinner",
  //     "cuisine": "Spanish",
  //     "date": "2019-12-12T19:00",
  //     "dish": "Paella",
  //     "eventImg": "https://images.unsplash.com/photo-1512058466835-da4d54fb0ee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e08776c6a58d31d9d57e",
  //     "guest": [],
  //     "eventDescription": "We don´t want to just offer a well-prepared meal. We want this day to be an unforgettable night. For this, in addition to the dishes, we offer a soundtrack.",
  //     "numberAttend": 2,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "Homemade food for new friends",
  //     "cuisine": "International",
  //     "date": "2019-12-12T19:00",
  //     "dish": "Pasta and pesto",
  //     "eventImg": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e0872719e12d0da6f44d",
  //     "guest": [],
  //     "eventDescription": "Enjoy a welcome cocktail, five courses of signature dishes and desserts from Pacific City eateries, each paired with a whiskey tasting.",
  //     "numberAttend": 3,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "Quesadillas with love",
  //     "cuisine": "Mexican",
  //     "date": "2019-22-12T20:00",
  //     "dish": "Quesadilla",
  //     "eventImg": "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e087d0f6f591af506e5f",
  //     "guest": [],
  //     "eventDescription": "Nothing makes me happier than creating memorable meals and then sharing with friends; both old and new. Join my wife and I as we share our home and travel stories with you while serving several courses of classic French cuisine with a modern twist",
  //     "numberAttend": 2,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "Greek lunch time",
  //     "cuisine": "Greek",
  //     "date": "2019-22-12T20:00",
  //     "dish": "Traditional greek salad",
  //     "eventImg": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e087005eaefb45a29b07",
  //     "guest": [],
  //     "eventDescription": "Me and my lovely husband Teo moved in 2002 to Chicago and we love this city. I am German and Teo is Romanian and we cook mostly European food.",
  //     "numberAttend": 3,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "Pasta and Wine for a relax night",
  //     "cuisine": "Italian",
  //     "date": "2019-15-12T22:00",
  //     "dish": "Pasta",
  //     "eventImg": "https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e087935ed84880840677",
  //     "guest": [],
  //     "eventDescription": "The ORGASMIC breakfast is everything you ve always wanted on a Sunday brunch / Breakfast.",
  //     "numberAttend": 9,
  //     "costScore": 27
  //   },
  //   {
  //     "eventName": "Amazing meatballs lunch time",
  //     "cuisine": "Italian",
  //     "date": "2019-16-12T14:00",
  //     "dish": "Meatballs",
  //     "eventImg": "https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=609",
  //     "host": "5dd7e087935ed84880840667",
  //     "guest": [],
  //     "eventDescription": "Join us for the ultimate Libyan brunch experience. We will serve a wide selection of Libyan dishes and top it off the meal with some green mint tea. Guests will have the option of dining on a table or a cushioned area on the floor.",
  //     "numberAttend": 8,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "Homemade and warm Soup",
  //     "cuisine": "Traditional",
  //     "date": "2019-12-12T14:00",
  //     "dish": "Vegetable Soup",
  //     "eventImg": "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e087b85c8d113f20cb8c",
  //     "guest": [],
  //     "eventDescription": "Eggs poached, scrambled or cooked sunny side up in a spicy tomato /onion/ cilantro/parsley/garlic sauce. A non-spicy version will be available upon request.",
  //     "numberAttend": 4,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "Green and delicious dinner",
  //     "cuisine": "American",
  //     "date": "2019-12-28T18:00",
  //     "dish": "Green salad",
  //     "eventImg": "https://images.unsplash.com/photo-1484980972926-edee96e0960d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e08775dbf7cb0438ced1",
  //     "guest": [],
  //     "eventDescription": "You will be spoiled with a variety of vegan breakfast treats like waffles, delicious vegan spreads, bread from the best bakery in town, endless fresh fruit and veggies from the market and of course gooooood coffee and fresh juices!",
  //     "numberAttend": 1,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "Familiar barbecue lunch",
  //     "cuisine": "Argentin",
  //     "date": "2019-12-28T18:00",
  //     "dish": "Barbecue",
  //     "eventImg": "https://images.unsplash.com/photo-1508615263227-c5d58c1e5821?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e08775dbf7cb0438ced1",
  //     "guest": [],
  //     "eventDescription": "A whole day of eating and maybe a little stroll over the flea market around the corner to walk some of the waffles off afterwards =)",
  //     "numberAttend": 3,
  //     "costScore": 10
  //   },
  //   {
  //     "eventName": "American Burguer night",
  //     "cuisine": "American",
  //     "date": "2019-12-25T22:00",
  //     "dish": "Barbecue",
  //     "eventImg": "https://images.unsplash.com/photo-1521305916504-4a1121188589?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
  //     "host": "5dd7e08775dbf7cb0438ced1",
  //     "guest": [],
  //     "eventDescription": "A whole day of eating and maybe a little stroll over the flea market around the corner to walk some of the waffles off afterwards =)",
  //     "numberAttend": 3,
  //     "costScore": 10
  //   }

  // ]



  const usersPromise = User.create(users);
  const eventsPromise = MealEvent.create(mealEvents);


  Promise.all([usersPromise, eventsPromise])
    .then((insertedData) => {
      console.log('USERS', insertedData[0]);
      console.log('EVENTS', insertedData[1]);

      const users = insertedData[0];
      const events = insertedData[1];

      events.map((event) => {
        const num = Math.floor(Math.random() * (users.length));
        const id = users[num]._id;
        // console.log('RANDOM ID', id);
        // console.log('EVENT ID', event._id);
        // MealEvent.find({ _id: event._id}).then((res) => {
        //   console.log(res);

        MealEvent.findByIdAndUpdate(event._id, {
          $set: {
            host: id
          }
        }, {
          new: true
        })
      })
    })
    .catch((err) => console.log(err));
}