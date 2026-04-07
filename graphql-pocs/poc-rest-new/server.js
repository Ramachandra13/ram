const mongoose = require("mongoose");
const {Sequelize, DataTypes} = require("sequelize");

// Require express
const express = require("express");
// Initialize express
const app = express();
const PORT = 9000;
// parse JSON
app.use(express.json());
// parse URL encoded data
app.use(express.urlencoded({ extended: true }));

//Mongo connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true
}).then( () =>{
    console.log("MongoDB connected...");
})

const userSchema = new mongoose.Schema({
    name: {
            type: String
    },
    age: {
        type: String
    },
});

const User = mongoose.model('User', userSchema);

const users = [{
    id: 1,
        name: "Jane",
        age: "22",
    },
    {
        id: 2,
        name: "Doe",
        age: "31",
    }];

app.post("/create/user", (req, res) => { 
    const newUser = new User({
        name: req.name,
        age: req.age,
    });
    newUser.save();
    res.status(200).json({
        newUser
     });    
});

app.get('/allusers', ( req, res) => {
    console.log(" Inside Users .."+ res);
    try {
        console.log(" res ::: "+ res.data);
        const usrs = User.find()
        console.log(" usrs ::: "+ usrs);
        const resp = res.jsom(usrs);
        console.log(" resp ::: "+ resp.data);
         //res.status(200).json({
            
          //});
        } catch (error) {
            res.status(500).json({
            message: "Failed to retrieve all users",
        });
        }
});

app.get('/getuser', ( req, res) => {
    console.log(" Inside Users .."+ res);
    try {
        const usrs = User.findById(req)
        const resp = res.jsom(usrs);
        console.log(" resp ::: "+ res.data);
         //res.status(200).json({
            
          //});
        } catch (error) {
            res.status(500).json({
            message: "Failed to retrieve all users",
        });
        }
});

app.post("/create", (req, res) => {
    // Check if request body is empty
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
        message: "Request body cannot be empty",
     });
    }
    // Use object destructuring to get name and age
    const { name, age } = req.body;
    if (!name || !age) {
        res.status(400).json({
        message: "Ensure you sent both name and age",
    });
    }
    const newUser = {
        id: users.length + 1,
        name,
        age,
    };
    try {
        users.push(newUser);
        res.status(201).json({
        message: "Successfully created a new user",
    });
    } catch (error) {
        res.status(500).json({
        message: "Failed to create user",
      });
    }
    });

app.get('/users', (req, res) => {
        console.log(" Inside Users ..");
        try {
            res.status(200).json({
                users
             });
            } catch (error) {
                res.status(500).json({
                message: "Failed to retrieve all users",
            });
            }
    });


app.get('/user/:userID', (req, res) => {
    // Returns a user by ID
    });


app.put('/user/:userID', (req, res) => {
    // Update a user by ID
    });   

// create a server
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});