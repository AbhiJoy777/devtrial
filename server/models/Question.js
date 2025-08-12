const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'General'],
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
    },
}, {
    timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;