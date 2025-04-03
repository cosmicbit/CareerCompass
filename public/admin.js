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
async function addCounselor() {
    print("hello");
    const name = document.getElementById('counselorName').value;
    const field = document.getElementById('counselorField').value;
    const contact = document.getElementById('counselorContact').value;
    const experience = document.getElementById('counselorExperience').value;
    const specialization = document.getElementById('counselorSpecialization').value;
    const languages = document.getElementById('counselorLanguages').value;
    
    if (!name || !field ) {
        alert('Please fill in all fields');
        return;
    }
    
    const counselor = {
        name,
        field,
        contact,
        experience,
        specialization,
        languages
    };
    
    try {
        const response = await fetch("/counselor/addCounselor", {  // Corrected endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(counselor)  // Corrected JSON format
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Counselor Addition Success:", data);
        alert(data.message || "Counselor added successfully!");
    } catch (error) {
        console.error("Error adding Counselor:", error);
        alert("Addition of Counselor failed. Try again.");
    }
    
    // Reset form
    document.getElementById('counselorForm').reset();
    
    // Reload counselors
    loadCounselors();
}

async function deleteCounselor(id) {
    console.log(id)
    if (confirm('Are you sure you want to delete this counselor?')) {
        try {
            const response = await fetch(`/counselor/deleteCounselors/${id}`, {
                method: "DELETE"
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const data = await response.json();
            console.log("Deleted:", data);
            loadCounselors();
        } catch (error) {
            console.error("Error deleting question:", error);
        }
        
    }
}

async function loadCounselors() {
    try {
        const response = await fetch('/counselor/getCounselors');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const counselors = await response.json();
        console.log("counselors:", counselors);
        const counselorsList = document.getElementById('counselorsList');
    
        counselorsList.innerHTML = '';
        
        if (counselors.length === 0) {
            counselorsList.innerHTML = '<p>No questions added yet.</p>';
            return;
        }
        
        counselors.forEach(counselor => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div class="item-content">
                    <h3>${counselor.name}</h3>
                    <p><strong>Field:</strong> ${counselor.field}</p>
                    <p><strong>Specialization:</strong> ${counselor.specialization}</p>
                    <p><strong>Languages:</strong> ${counselor.languages}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteCounselor('${counselor._id}')">Delete</button>
                </div>
            `;
            counselorsList.appendChild(item);
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
    
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