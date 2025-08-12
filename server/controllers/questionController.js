const Question = require('../models/Question.js');

// @desc    Get a random question
// @route   GET /api/questions/random
const getRandomQuestion = async (req, res) => {
    try {
        // Get the count of all questions
        const count = await Question.countDocuments();
        // Generate a random number between 0 and count - 1
        const random = Math.floor(Math.random() * count);
        // Fetch one question at the random index
        const question = await Question.findOne().skip(random);
        
        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: 'No questions found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRandomQuestion };