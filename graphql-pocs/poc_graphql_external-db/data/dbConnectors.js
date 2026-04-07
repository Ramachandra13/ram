import mongoose, { mongo } from "mongoose";
import { Sequelize, DataTypes } from "sequelize";
import _ from 'lodash'
import casual from "casual";


//Mongo connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true
}).then( () =>{
    console.log("MongoDB connected...");
})



const customerSchema = new mongoose.Schema({
    name: {
            type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    region: {
        type: String
    }
});

const Customer = mongoose.model('xyz', customerSchema);

// const sequalize = new Sequelize('sqlite::memory:');

// const Categories = sequalize.define('categories', {
//     category: DataTypes.STRING,
//     description: DataTypes.STRING,
// });

// Categories.sync({ force:true}).then(() => {
//     _.times(5, (i) => {
//         Categories.create({
//             category: casual.word,
//             description: casual.sentence
//         });
//     });
// });

export { Customer };
// export { Customer, Categories};

