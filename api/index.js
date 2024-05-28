const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const localStategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


const app = express();
const port = 8000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require('jsonwebtoken');

// Connect to MongoDB

mongoose.connect(
    "mongodb+srv://gosqu:gosqu248@messengercluster.zx9sz9j.mongodb.net/"

).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(`Error connection with MongoDB: ${err}`);
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});  

const User = require("./models/user");
//const Message = require("./models/message");

// endpoint for registering a new user
app.post('/register', async (req, res) => {
    const {name, email, password, image} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        image,
    });  

    newUser.save().then(() => {
        res.status(200).json({message: 'User created successfully'});
    }).catch((err) => {
        res.status(500).json({message: 'Error creating user', err});
    });
});

//endpoint for logging in
app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    User.findOne({email}).then(async (user) => {
        if (!user) {
             res.status(404).json({message: 'User not found'});

        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({id: user._id}, 'secret', {expiresIn: '1h'});
                res.status(200).json({message: 'Login successful', token});

            } else {
                res.status(401).json({message: 'Invalid credentials'});
            }
        }


    }).catch((err) => {
        res.status(500).json({message: 'Error logging in', err});
    });
});

//endpoint to access all the users except the user who is logged in

app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;
  
    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.log("Error retrieving users", err);
        res.status(500).json({ message: "Error retrieving users" });
      });
  });


  //endpoint to send a request to a user
  app.post("/friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;
  
    try {
      //update the recepient's friendRequestsArray!
      await User.findByIdAndUpdate(selectedUserId, {
        $addToSet: { friendRequests: currentUserId },
      });
  
      //update the sender's sentFriendRequests array
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { sentFriendRequests: selectedUserId },
      });
  
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  });

// endpoint to cancel a friend request
app.post("/cancel-friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;
  
    try {
      // update the recipient's friendRequestsArray!
      await User.findByIdAndUpdate(selectedUserId, {
        $pull: { friendRequests: currentUserId },
      });
  
      // update the sender's sentFriendRequests array
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { sentFriendRequests: selectedUserId },
      });
  
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  });
  