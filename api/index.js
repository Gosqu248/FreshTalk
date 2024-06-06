const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const localStategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 8000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require('jsonwebtoken');

// Connect to MongoDB

mongoose.connect(
    "mongodb+srv://gosqu:gosqu248@messengercluster.zx9sz9j.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(`Error connection with MongoDB: ${err}`);
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});  

const User = require("./models/user");
const Message = require("./models/message");


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

  User.findById(loggedInUserId)
    .then((user) => {
      User.find({ _id: { $ne: loggedInUserId, $nin: user.friends } })
        .then((users) => {
          res.status(200).json(users);
        })
        .catch((err) => {
          console.log("Error retrieving users", err);
          res.status(500).json({ message: "Error retrieving users" });
        });
    })
    .catch((err) => {
      console.log("Error retrieving logged in user", err);
      res.status(500).json({ message: "Error retrieving logged in user" });
    });
});


  //endpoint to send friend request
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

  app.get("/sent-friend-request/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Assuming User is your Mongoose model for users
      const user = await User.findById(userId)
        .populate("sentFriendRequests", "name")
        .lean();
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const sentFriendRequests = user.sentFriendRequests;
  
      res.json(sentFriendRequests);
    } catch (error) {
      console.log("Error retrieving sent friend requests", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// endpoint to show all friends
app.get("/friend-request/:userId", async (req, res) => {  
    try {
      const {userId} = req.params;

      //fetch the user document based on the User id
      const user = await User.findById(userId)
      .populate("friendRequests", "name email image")
      .lean();


    const friendRequests = user.friendRequests;

    res.json(friendRequests);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// endpoint to accept friend request
app.post("/friend-request/accept", async (req, res) => {
    try {
      const { senderId, recepientId } = req.body;

      const sender = await User.findById(senderId);
      const recepient = await User.findById(recepientId);

      sender.friends.push(recepientId);
      recepient.friends.push(senderId);

      recepient.friendRequests = recepient.friendRequests.filter(
        (friendReq) => friendReq.toString() !== senderId.toString()
      );

      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (sentFriendReq) => sentFriendReq.toString() !== recepientId.toString()
      );

      await sender.save();
      await recepient.save();
  
      res.status(200).json({ message: "Friend Request accepted successfully" });
    } catch (error) {
      console.log("Error accepting friend request: ", error);
      res.sendStatus(500);
    }
});

// enpoint to get friends
app.get("/accepted-friends/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId).populate("friends", "name email image")

      const friends = user.friends;
      res.json(friends);
    } catch (error) {
      console.log("Error retrieving friends: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//endpoint to post Messages and store it in the backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    let imageUrl = (messageType === "image" || messageType === "audio") ? req.file.path : null;
    if (imageUrl) {
      imageUrl = imageUrl.replace(/\\/g, "/");
    }


    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: imageUrl,
    });

    await newMessage.save();
    console.log(newMessage);
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use('/files', express.static(path.join(__dirname, 'files/')));

///endpoint to get the userDetails to design the chat Room header
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to fetch the messages between two users in the chatRoom
app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to delete messages

app.delete("/deleteMessages", async (req, res) => {
  try {
    const { messageId } = req.body;

    const deletedMessages = await Message.deleteMany({ _id: { $in: messageId } });

    if(!deletedMessages) {
      return res.status(404).json({message: "Message not found"});
    }

    res.json({message: "Message deleted successfully"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//endpoint to update the user image or password
app.put("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { image, oldPassword, newPassword} = req.body;

    const user = await User.findById(userId);

    if (image) {
      user.image = image;
    }

    if (newPassword && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (isMatch) {
              const hashedPassword = await bcrypt.hash(newPassword, 10);
              user.password = hashedPassword;
              res.status(200).json({message: 'Changed password successful'});
            } else {
              return res.status(401).json({ message: 'Invalid credentials' });
            }
    }

    await user.save();

    console.log(user);
    console.log("User updated successfully");

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//endpoint to delete the user
app.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    } 

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


