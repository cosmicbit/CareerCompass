// Check if user is admin
document.addEventListener('DOMContentLoaded', function() {
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (isAdmin !== 'true') {
        // Redirect to login page if not admin
        window.location.href = 'index.html';
        return;
    }
    
    // Load data
    loadQuestions();
    loadCounselors();
    loadFeedback();
});

function showSection(sectionId) {
    // Update active button
    document.querySelectorAll('.sidebar-menu button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.sidebar-menu button[onclick*="${sectionId}"]`).classList.add('active');
    
    // Show selected section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function logout() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Aptitude Test Functions
async function addQuestion() {
    const questionText = document.getElementById('questionText').value;
    const optionA = document.getElementById('optionA').value;
    const optionB = document.getElementById('optionB').value;
    const optionC = document.getElementById('optionC').value;
    const optionD = document.getElementById('optionD').value;
    const correctAnswer = document.getElementById('correctAnswer').value;
    const category = document.getElementById('category').value;
    
    if (!questionText || !optionA || !optionB || !optionC || !optionD) {
        alert('Please fill in all fields');
        return;
    }
    
    const question = {
        category: category,
        question: questionText,
        options: [
            optionA, optionB,optionC, optionD
        ],
        answer: correctAnswer
        
    };
    try {
        const response = await fetch("/test/addQuestion", {  // Corrected endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                category: category,
                question: questionText,
                options: {
                    A: optionA,
                    B: optionB,
                    C: optionC,
                    D: optionD
                },
                answer: correctAnswer
            })  // Corrected JSON format
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Question Addition Success:", data);
        alert(data.message || "Question added successfully!");
    } catch (error) {
        console.error("Error adding Question:", error);
        alert("Addition of Question failed. Try again.");
    }
    
    // Reset form
    document.getElementById('questionForm').reset();
    
    // Reload questions
    loadQuestions();
}

async function deleteQuestion(id) {
    console.log(id)
    if (confirm('Are you sure you want to delete this question?')) {
        try {
            const response = await fetch(`/test/deleteQuestion/${id}`, {
                method: "DELETE"
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const data = await response.json();
            console.log("Deleted:", data);
            loadQuestions();
        } catch (error) {
            console.error("Error deleting question:", error);
        }
        
    }
}

async function loadQuestions() {
    try {
        const response = await fetch('/test/getQuestions');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const questions = await response.json();
        console.log("Questions:", questions);
        const questionsList = document.getElementById('questionsList');
    
        questionsList.innerHTML = '';
        
        if (questions.length === 0) {
            questionsList.innerHTML = '<p>No questions added yet.</p>';
            return;
        }
        
        questions.forEach(question => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div class="item-content">
                    <h3>${question.question}</h3>
                    <p><strong>Category:</strong> ${question.category}</p>
                    <p><strong>A:</strong> ${question.options.A}</p>
                    <p><strong>B:</strong> ${question.options.B}</p>
                    <p><strong>C:</strong> ${question.options.C}</p>
                    <p><strong>D:</strong> ${question.options.D}</p>
                    <p><strong>Correct Answer:</strong> ${question.answer}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteQuestion('${question._id}')">Delete</button>
                </div>
            `;
            questionsList.appendChild(item);
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
    
}

// Counselors Functions
function addCounselor() {
    const name = document.getElementById('counselorName').value;
    const email = document.getElementById('counselorEmail').value;
    const specialty = document.getElementById('counselorSpecialty').value;
    const bio = document.getElementById('counselorBio').value;
    
    if (!name || !email || !specialty || !bio) {
        alert('Please fill in all fields');
        return;
    }
    
    const counselor = {
        id: Date.now(),
        name,
        email,
        specialty,
        bio
    };
    
    const counselors = JSON.parse(localStorage.getItem('counselors') || '[]');
    counselors.push(counselor);
    localStorage.setItem('counselors', JSON.stringify(counselors));
    
    // Reset form
    document.getElementById('counselorForm').reset();
    
    // Reload counselors
    loadCounselors();
}

function deleteCounselor(id) {
    if (confirm('Are you sure you want to delete this counselor?')) {
        const counselors = JSON.parse(localStorage.getItem('counselors') || '[]');
        const updatedCounselors = counselors.filter(c => c.id !== id);
        localStorage.setItem('counselors', JSON.stringify(updatedCounselors));
        loadCounselors();
    }
}

function loadCounselors() {
    const counselors = JSON.parse(localStorage.getItem('counselors') || '[]');
    const counselorsList = document.getElementById('counselorsList');
    
    counselorsList.innerHTML = '';
    
    if (counselors.length === 0) {
        counselorsList.innerHTML = '<p>No counselors added yet.</p>';
        return;
    }
    
    counselors.forEach(counselor => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-content">
                <h3>${counselor.name}</h3>
                <p><strong>Email:</strong> ${counselor.email}</p>
                <p><strong>Specialty:</strong> ${counselor.specialty}</p>
                <p><strong>Bio:</strong> ${counselor.bio}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteCounselor(${counselor.id})">Delete</button>
            </div>
        `;
        counselorsList.appendChild(item);
    });
}

// Feedback Functions
function loadFeedback() {
    const feedbacks = JSON.parse(localStorage.getItem('feedback') || '[]');
    const feedbackList = document.getElementById('feedbackList');
    
    feedbackList.innerHTML = '';
    
    if (feedbacks.length === 0) {
        feedbackList.innerHTML = '<p>No feedback received yet.</p>';
        return;
    }
    
    feedbacks.forEach(feedback => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-content">
                <h3>From: ${feedback.name || 'Anonymous'}</h3>
                <p><strong>Email:</strong> ${feedback.email || 'Not provided'}</p>
                <p><strong>Date:</strong> ${new Date(feedback.timestamp).toLocaleString()}</p>
                <p><strong>Message:</strong> ${feedback.message}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteFeedback(${feedback.id})">Delete</button>
            </div>
        `;
        feedbackList.appendChild(item);
    });
}

function deleteFeedback(id) {
    if (confirm('Are you sure you want to delete this feedback?')) {
        const feedbacks = JSON.parse(localStorage.getItem('feedback') || '[]');
        const updatedFeedbacks = feedbacks.filter(f => f.id !== id);
        localStorage.setItem('feedback', JSON.stringify(updatedFeedbacks));
        loadFeedback();
    }
}