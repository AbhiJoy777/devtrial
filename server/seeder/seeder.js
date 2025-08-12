const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Import models
const Question = require('../models/Question.js');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const questions = JSON.parse(
    fs.readFileSync(`${__dirname}/questions.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
    try {
        await Question.deleteMany(); // Clear existing questions
        await Question.create(questions);
        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Destroy data from DB
const destroyData = async () => {
    try {
        await Question.deleteMany();
        console.log('❌ Data Destroyed Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    destroyData();
} else {
    console.log('Please add an option: -i to import, -d to destroy');
    process.exit();
}