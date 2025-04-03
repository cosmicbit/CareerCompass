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
        });
    });
    
    // Handle feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('success-message');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally process the form data
            // For now, just show the success message
            successMessage.classList.remove('hidden');
            feedbackForm.reset();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 3000);
        });
    }
    document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("token"); // Remove token
        window.location.href = "/index.html"; // Redirect to login page
    });

    
});

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
