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

        // Update the dropdown for slot management
        const counselorDropdown = document.getElementById("slotCounselor");
        counselorDropdown.innerHTML = "<option value=''>Select a Counselor</option>"; // Default option

        counselors.forEach(counselor => {
            const option = document.createElement("option");
            option.value = counselor._id;
            option.textContent = counselor.name;
            counselorDropdown.appendChild(option);
        });

        // Add event listener to trigger loadSlots() on selection
        counselorDropdown.addEventListener("change", function () {
            const selectedCounselorId = this.value;
            if (selectedCounselorId) {
                loadSlots(selectedCounselorId);
            }
        });

        // Update the dropdown for slot management
        const bookingcounselorDropdown = document.getElementById("filterCounselor");
        bookingcounselorDropdown.innerHTML = "<option value=''>Select a Counselor</option>"; // Default option

        counselors.forEach(counselor => {
            const option = document.createElement("option");
            option.value = counselor._id;
            option.textContent = counselor.name;
            bookingcounselorDropdown.appendChild(option);
        });

        // Add event listener to trigger loadSlots() on selection
        bookingcounselorDropdown.addEventListener("change", function () {
            const selectedCounselorId = this.value;
            if (selectedCounselorId) {
                loadBookings(selectedCounselorId);
            }
        });

    } catch (error) {
        console.error("Fetch error:", error);
    }
    
}
async function addSlot() {
    const counselorId = document.getElementById("slotCounselor").value;
    const startTime = document.getElementById("slotStartTime").value;
    const endTime = document.getElementById("slotEndTime").value;
    const sessionType = document.getElementById("sessionType").value;

    if (!counselorId || !startTime || !endTime || !sessionType) {
        alert("Please fill in all fields");
        return;
    }

    const slotData = { counselorId, startTime, endTime, sessionType };

    try {
        const response = await fetch("/slot/addSlots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slotData)
        });

        if (!response.ok) throw new Error("Failed to add slot");

        alert("Slot added successfully!");
        document.getElementById("slotForm").reset();
        loadSlots(counselorId); // Refresh slot list
    } catch (error) {
        console.error("Error adding slot:", error);
        alert("Error adding slot. Try again.");
    }
}
async function loadSlots(counselorId) {
    try {
        const response = await fetch(`/slot/getAll/${counselorId}`);
        const data = await response.json();

        const slotsList = document.getElementById("slotsList");
        slotsList.innerHTML = ""; // Clear previous slots

        if (data.slots.length === 0) {
            slotsList.innerHTML = "<p>No slots available for this counselor.</p>";
            return;
        }

        data.slots.forEach(slot => {
            const slotItem = document.createElement("div");
            slotItem.classList.add("slot-item");
            slotItem.innerHTML = `
                <p><strong>Start:</strong> ${new Date(slot.startTime).toLocaleString()}</p>
                <p><strong>End:</strong> ${new Date(slot.endTime).toLocaleString()}</p>
                <p><strong>Type:</strong> ${slot.sessionType === "virtual" ? "💻 Virtual" : "🏢 In-Person"}</p>
                <p><strong>Status:</strong> ${slot.isBooked ? "Booked" : "Available"}</p>
            `;
            slotsList.appendChild(slotItem);
        });

    } catch (error) {
        console.error("Error fetching slots:", error);
    }
}
async function loadBookings() {
    const counselorId = document.getElementById("filterCounselor").value;
    const bookingsList = document.getElementById("bookingsList");

    bookingsList.innerHTML = "<p>Loading bookings...</p>";

    try {
        const response = await fetch(`/booking/counselor/${counselorId}`);
        const bookings = await response.json();

        bookingsList.innerHTML = ""; // Clear previous data

        if (bookings.length === 0) {
            bookingsList.innerHTML = "<p>No bookings found.</p>";
            return;
        }

        bookings.forEach(booking => {
            const bookingDiv = document.createElement("div");
            bookingDiv.classList.add("booking-item");
            bookingDiv.innerHTML = `
                <p>User: ${booking.user.firstname}</p>
                <p>Slot: ${new Date(booking.slot.startTime).toLocaleString()}</p>
                <p>Status: 
                    <select onchange="updateBookingStatus('${booking._id}', this.value)">
                        <option value="confirmed" ${booking.status === "confirmed" ? "selected" : ""}>Confirmed</option>
                        <option value="completed" ${booking.status === "completed" ? "selected" : ""}>Completed</option>
                        <option value="cancelled" ${booking.status === "cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </p>
                <button onclick="cancelBooking('${booking._id}')">Cancel</button>
            `;
            bookingsList.appendChild(bookingDiv);
        });

    } catch (error) {
        console.error("Error loading bookings:", error);
        bookingsList.innerHTML = "<p>Error fetching bookings.</p>";
    }
}


async function updateBookingStatus(bookingId, newStatus) {
    try {
        const response = await fetch(`/booking/admin/update/${bookingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update status");
        }

        alert("Booking status updated successfully!");
        loadBookings(); // Refresh bookings list

    } catch (error) {
        console.error("Error updating booking status:", error);
        alert("Error updating status.");
    }
}
async function cancelBooking(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
        const response = await fetch(`/booking/admin/cancel/${bookingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to cancel booking");
        }

        alert("Booking cancelled successfully!");
        loadBookings(); // Refresh bookings list

    } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Error cancelling booking.");
    }
}

// Load bookings on page load
document.addEventListener("DOMContentLoaded", loadBookings);


// Feedback Functions
async function loadFeedback() {
    try {
        const response = await fetch("/feedback/getFeedbacks");
        if (!response.ok) {
            throw new Error("Failed to fetch feedbacks");
        }

        const feedbacks = await response.json();
        const feedbackList = document.getElementById('feedbackList');
        
        feedbackList.innerHTML = ''; // Clear previous content

        if (feedbacks.length === 0) {
            feedbackList.innerHTML = '<p>No feedback received yet.</p>';
            return;
        }

        feedbacks.forEach(feedback => {
            const item = document.createElement('div');
            item.className = 'item';
            item.innerHTML = `
                <div class="item-content">
                    <h3>Rating: ${feedback.rating} ⭐</h3>
                    <p><strong>Helpful Features:</strong> ${feedback.helpfulFeatures.length ? feedback.helpfulFeatures.join(', ') : 'None'}</p>
                    <p><strong>Heard From:</strong> ${feedback.heardFrom}</p>
                    <p><strong>Feedback:</strong> ${feedback.feedback}</p>
                    <p><strong>Useful:</strong> ${feedback.useful}</p>
                    <p><strong>Submitted At:</strong> ${new Date(feedback.submittedAt).toLocaleString()}</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="deleteFeedback('${feedback._id}')">Delete</button>
                </div>
            `;
            feedbackList.appendChild(item);
        });

    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        document.getElementById('feedbackList').innerHTML = '<p>Error loading feedbacks.</p>';
    }
}


async function deleteFeedback(id) {
    if (confirm("Are you sure you want to delete this feedback?")) {
        try {
            const response = await fetch(`feedback/deleteFeedback/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();
            console.log("Delete response:", result);

            if (response.ok) {
                loadFeedback(); // Reload list after deletion
            } else {
                alert("Error deleting feedback: " + result.message);
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    }
}
