document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active', 'border-blue-600', 'text-blue-600'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active', 'border-blue-600', 'text-blue-600');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            showCounselors();
        });
    });
    
    // Handle feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('success-message');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Here you would normally process the form data
            // Get form values
            const rating = document.querySelector('input[name="rating"]:checked');
            const helpfulFeatures = [...document.querySelectorAll('input[name="helpfulFeatures"]:checked')].map(f => f.value);
            const heardFrom = document.querySelector('select').value;
            const feedbackText = document.querySelector('textarea').value.trim();
            const useful = document.querySelector('input[name="useful"]:checked');

            // Validation: Ensure rating and feedback are provided
            if (!rating) {
                alert("Please provide a rating.");
                return;
            }

            // Construct feedback data (for demonstration, this logs it to the console)
            const feedbackData = {
                rating: rating.value,
                helpfulFeatures: helpfulFeatures,
                heardFrom: heardFrom,
                feedback: feedbackText,
                useful: useful ? useful.value : null
            };
            console.log(feedbackData);
            try {
                const response = await fetch("/feedback/addFeedback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(feedbackData)
                });
        
                const result = await response.json();
        
                if (response.ok) {
                    console.log("Feedback Submitted:", feedbackData);
                    // For now, just show the success message
                    successMessage.classList.remove('hidden');
                    feedbackForm.reset();
                    
                    // Hide success message after 3 seconds
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 3000);
                } else {
                    alert(result.message || "Something went wrong.");
                }
            } catch (error) {
                console.error("Error submitting feedback:", error);
                alert("Error submitting feedback. Please try again.");
            }
            
        });
    }
    document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("token"); // Remove token
        window.location.href = "/index.html"; // Redirect to login page
    });

    
});
// document.addEventListener('DOMContentLoaded', showCounselors);

async function startTest(){
    console.log("Hello");
    document.getElementById('test-intro').classList.add('hidden');
    document.getElementById('test-questions').classList.remove('hidden');
    fetch('/test/getQuestions')
        .then(response => response.json())
        .then(data => {
           const container = document.getElementById('question-container');
           container.innerHTML = ''; // Clear any previous content

           // Dynamically create question elements
           data.forEach((question, index) => {
             const questionDiv = document.createElement('div');
             questionDiv.className = "mb-4 p-4 border rounded";
             questionDiv.setAttribute('data-question-id', question._id);
             questionDiv.innerHTML = `
                <p class="mb-2 font-semibold">${index + 1}. ${question.question}</p>
                <div>
                  <label><input type="radio" name="${question._id}" value="A"> ${question.options.A}</label><br>
                  <label><input type="radio" name="${question._id}" value="B"> ${question.options.B}</label><br>
                  <label><input type="radio" name="${question._id}" value="C"> ${question.options.C}</label><br>
                  <label><input type="radio" name="${question._id}" value="D"> ${question.options.D}</label>
                </div>
             `;
             container.appendChild(questionDiv);
           });
        })
        .catch(err => console.error('Error loading questions:', err));
}
async function submitTest() {
    const answers = [];
    const questionDivs = document.querySelectorAll('#question-container > div');
    let allAnswered = true;

    questionDivs.forEach(div => {
        const questionId = div.getAttribute('data-question-id');
        const selectedOption = div.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            answers.push({
                questionId: questionId,
                answer: selectedOption.value
            });
        } else {
            allAnswered = false;
        }
    });

    if (!allAnswered) {
        alert("Please answer all questions before submitting the test.");
        return;
    }

    const name = prompt("Please enter your name:");

    try {
        const response = await fetch('/test/submit-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, answers })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        alert("Your recommended career is: " + data.recommendedCareer);
        startTest();
        // Optionally, redirect or update UI with detailed results.
    } catch (error) {
        console.error('Error submitting test:', error);
        alert("There was an error submitting your test. Please try again.");
    }
}

async function showCounselors() {
    const container = document.getElementById("counselors-grid");
    document.getElementById('bookingSection').classList.add('hidden');
    document.getElementById('counselors-grid').classList.remove('hidden');
    document.getElementById('counselor-profile').classList.add('hidden');


    try {
        const response = await fetch("/counselor/getCounselors"); // Adjust URL if hosted remotely
        const counselors = await response.json();

        container.innerHTML = counselors.map(counselor => `
            <div class="card bg-white rounded-lg shadow p-6 text-center">
                <h3 class="text-xl font-bold mb-2">${counselor.name}</h3>
                <p class="text-blue-600 font-medium mb-4">${counselor.field}</p>
                <div class="space-y-2 text-gray-600 text-left">
                    <p><strong>Contact:</strong> ${counselor.contact}</p>
                    <p><strong>Experience:</strong> ${counselor.experience}</p>
                    <p><strong>Specialization:</strong> ${counselor.specialization}</p>
                    <p><strong>Languages:</strong> ${counselor.languages}</p>
                </div>
                <div class="flex gap-2 mt-4">
                    <button class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick="loadAvailableSlots('${counselor._id}')">Book Session</button>
                    <button class="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50" onClick="showProfile('${counselor.name}','${counselor.field}','${counselor.contact}','${counselor.experience}', '${counselor.specialization}', '${counselor.languages}')" >Profile</button>
                </div>  
            </div>
        `).join(""); // Convert array to HTML string and insert it
    } catch (error) {
        console.error("Error fetching counselors:", error);
        container.innerHTML = "<p class='text-red-600'>Failed to load counselors. Please try again later.</p>";
    }
}
async function loadAvailableSlots(counselorId) {
    document.getElementById('counselors-grid').classList.add('hidden');
    document.getElementById('bookingSection').classList.remove('hidden');
    document.getElementById('counselor-profile').classList.add('hidden');

    try {
        const response = await fetch(`/slot/getAvailable/${counselorId}`);
        const slots = await response.json();

        const slotsList = document.getElementById("availableSlots");
        slotsList.innerHTML = ""; // Clear previous slots

        if (slots.length === 0) {
            slotsList.innerHTML = "<p>No slots available</p>";
            return;
        }

        slots.forEach(slot => {
            const startDateTime = new Date(slot.startTime);
            const formattedDate = startDateTime.toLocaleDateString();
            const formattedTime = startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const slotDiv = document.createElement("div");
            slotDiv.classList.add("slot-item");
            slotDiv.className = "mb-4 p-4 border rounded";
            slotDiv.innerHTML = `
                <p>${formattedDate} at ${formattedTime}</p>
                <button onclick="bookSlot('${slot._id}', '${slot.counselor}', '')" class="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium mt-4 hover:bg-green-700 transition duration-300">Book</button>
            `;
            slotsList.appendChild(slotDiv);
        });

    } catch (error) {
        console.error("Error loading slots:", error);
    }
}

// Book a slot
async function bookSlot(slotId, counselorId, notes = "") {
    const userId = localStorage.getItem("userId"); // Get user ID from localStorage
    if (!userId) {
        alert("You must be logged in to book a session.");
        return;
    }

    try {
        const response = await fetch("/booking/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                counselorId,
                slotId,
                notes,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Booking failed.");
        }

        alert("Booking confirmed!");
        console.log("Booking success:", data);
        loadAvailableSlots(counselorId);
    } catch (error) {
        console.error("Error booking slot:", error);
        alert(error.message || "Booking failed. Try again.");
    }
}



async function showProfile(name, field, contact, experience, specialization, languages) {
    console.log(name)
    document.getElementById('counselors-grid').classList.add('hidden');
    document.getElementById('counselor-profile').classList.remove('hidden');
    document.getElementById('bookingSection').classList.add('hidden');
    const container = document.getElementById("counselor-profile");

    container.innerHTML = `
        <div class="p-6">
            <h2 class="text-2xl font-bold mb-4">${name}</h2>
    
            <!-- Initial information screen -->
            <div id="test-intro" class="mb-6">
                <p class="text-gray-600 mb-4">${field}</p>
        
                <div class="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 class="font-semibold text-blue-700 mb-2">Additional Information:</h3>
                    <ul class="list-disc pl-5 text-gray-700 space-y-2">
                        <li>Contact: ${contact}</li>
                        <li>Experience: ${experience}</li>
                        <li>Specialization: ${specialization}</li>
                        <li>Languages: ${languages}</li>
                    </ul>
                </div>
            </div>
        </div> 
    `; // Convert array to HTML string and insert it
   
    
}

function showCareer(career){
    document.getElementById('careers-grid').classList.add('hidden');
    document.getElementById('careers-more').classList.add('hidden');

    document.getElementById('career-details').classList.remove('hidden');

    switch(career){
        case "Engineering": document.getElementById('career-engineering').classList.remove('hidden');
        break;
        case "Medical":document.getElementById('career-medical').classList.remove('hidden') ;
        break;
        case "Commerce":document.getElementById('career-commerce').classList.remove('hidden');
        break;


        case "Arts": document.getElementById('career-arts').classList.remove('hidden');
        break;


        case "Design":document.getElementById('career-design').classList.remove('hidden');
        break;


        case "Hotel":document.getElementById('career-hotel').classList.remove('hidden') ;
        break;


        case "Law": document.getElementById('career-law').classList.remove('hidden');
        break;


        case "Agriculture":document.getElementById('career-agriculture').classList.remove('hidden');
        break;


        case "Aviation":document.getElementById('career-aviation').classList.remove('hidden');
    }
}
