const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

router.post('/addQuestion', async (req, res) => {
    console.log("Add Question endpoint hit");  // Debug log
    try {
        const { category, question, options, answer} = req.body;
        if (!category || !question || !options || !answer) {
            return res.status(400).json({ error: "category, question, options and answer required" });
        }
        const newQuestion = new Question({ category, question, options, answer })
        
        await newQuestion.save();

        console.log("Question added:", newQuestion);
        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        console.error("Error addding Question:", error);
        res.status(500).json({ error: 'Error adding Question' });
    }
});

router.get('/getQuestions', async (req, res) => {
    console.log("Get Question endpoint hit");
    try {
        const questions = await Question.find(); // Fetch all records
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteQuestion/:id', async (req, res) => {
    console.log("Delete Question endpoint hit");
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question deleted successfully", deletedQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Define career mapping weights
const careerMapping = {
    "Engineering": {
      "verbal": 0.05,
      "logical": 0.15,
      "quantitative": 0.4,
      "technical": 0.4
    },
    "Medical Sciences": {
      "verbal": 0.35,
      "logical": 0.2,
      "quantitative": 0.35,
      "technical": 0.1
    },
    "Commerce & Management": {
      "verbal": 0.3,
      "logical": 0.3,
      "quantitative": 0.3,
      "technical": 0.1
    },
    "Arts & Humanities": {
      "verbal": 0.5,
      "logical": 0.2,
      "quantitative": 0.2,
      "technical": 0.1
    },
    "Design & Architecture": {
      "verbal": 0.3,
      "logical": 0.2,
      "quantitative": 0.1,
      "technical": 0.4
    },
    "Hotel Management & Tourism": {
      "verbal": 0.4,
      "logical": 0.3,
      "quantitative": 0.2,
      "technical": 0.1
    },
    "Law": {
      "verbal": 0.45,
      "logical": 0.35,
      "quantitative": 0.1,
      "technical": 0.1
    },
    "Agriculture & Environmental Science": {
      "verbal": 0.15,
      "logical": 0.15,
      "quantitative": 0.4,
      "technical": 0.3
    },
    "Aviation & Aerospace": {
      "verbal": 0.1,
      "logical": 0.2,
      "quantitative": 0.35,
      "technical": 0.35
    }
  };
// Function to compute the recommended career based on candidate scores
function computeCareer(scores) {
    let bestCareer = null;
    let highestScore = -Infinity;
    
    for (const career in careerMapping) {
      const weights = careerMapping[career];
      const weightedScore = (weights.verbal * scores.verbal) +
                            (weights.logical * scores.logical) +
                            (weights.quantitative * scores.quantitative) +
                            (weights.technical * scores.technical);
      
      if (weightedScore > highestScore) {
        highestScore = weightedScore;
        bestCareer = career;
      }
    }
    return bestCareer;
}

// Endpoint to submit candidate answers
router.post('/submit-test', async (req, res) => {
    console.log("Submit test endpoint hit");
    try {
      const { name, answers } = req.body;
      console.log("Candidate Name:", name);
      console.log("Answers:", answers);
      // Expected answers format: [{ questionId: '...', answer: 'A' }, ...]
      if (!name || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Name and answers array are required.' });
      }
  
      // Extract all question IDs from the candidate's answers
      const questionIds = answers.map(a => a.questionId);
  
      // Retrieve all the corresponding questions from MongoDB
      const questions = await Question.find({ _id: { $in: questionIds } });
      const questionMap = {};
      questions.forEach(q => {
        questionMap[q._id] = q;
      });
  
      // Initialize score counts per category
      const scoreCounts = {
        verbal: { correct: 0, total: 0 },
        logical: { correct: 0, total: 0 },
        quantitative: { correct: 0, total: 0 },
        technical: { correct: 0, total: 0 }
      };
  
      // Process each candidate answer
      answers.forEach(item => {
        const question = questionMap[item.questionId];
        if (question) {
          const category = question.category;
          // Increment total questions count for this category
          scoreCounts[category].total++;
          // Increment correct count if candidate's answer matches the stored correct answer
          if (item.answer === question.answer) {
            scoreCounts[category].correct++;
          }
        }
      });
  
      // Convert raw scores to percentages for each category
      const percentages = {};
      for (const cat in scoreCounts) {
        const { correct, total } = scoreCounts[cat];
        percentages[cat] = total ? (correct / total) * 100 : 0;
      }
  
      // Apply weighted career mapping logic
      let bestCareer = null;
      let highestScore = -Infinity;
      for (const career in careerMapping) {
        const weights = careerMapping[career];
        const weightedScore =
          (weights.verbal * percentages.verbal) +
          (weights.logical * percentages.logical) +
          (weights.quantitative * percentages.quantitative) +
          (weights.technical * percentages.technical);
  
        if (weightedScore > highestScore) {
          highestScore = weightedScore;
          bestCareer = career;
        }
      }
  
      // Optionally, store the candidate's result in the database here
      
      // Return the computed scores and recommended career
      res.json({
        message: 'Test processed successfully.',
        name,
        scores: percentages,
        recommendedCareer: bestCareer
      });
    } catch (error) {
      console.error('Error processing test submission:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;