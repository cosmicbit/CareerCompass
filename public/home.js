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
document.addEventListener('DOMContentLoaded', showCounselors);

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
                    <button class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Book Session</button>
                    <button class="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50" onClick="showProfile('${counselor.name}','${counselor.field}','${counselor.contact}','${counselor.experience}', '${counselor.specialization}', '${counselor.languages}')" >Profile</button>
                </div>  
            </div>
        `).join(""); // Convert array to HTML string and insert it
    } catch (error) {
        console.error("Error fetching counselors:", error);
        container.innerHTML = "<p class='text-red-600'>Failed to load counselors. Please try again later.</p>";
    }
}

async function showProfile(name, field, contact, experience, specialization, languages) {
    console.log(name)
    document.getElementById('counselors-grid').classList.add('hidden');
    document.getElementById('counselor-profile').classList.remove('hidden');
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
    const container = document.getElementById('career-details');
    switch(career){
        case "Engineering":container.innerHTML=`
        <div class="engineering-courses">
    <h1>Engineering Courses in India</h1>
    <p>Engineering is one of the most popular career choices in India, offering a variety of disciplines at undergraduate and postgraduate levels. The field includes core branches like Mechanical, Civil, and Electrical Engineering, as well as modern specializations like Artificial Intelligence and Data Science.</p>
    
    <h2>B.Tech/B.E. (Bachelor of Technology/Bachelor of Engineering)</h2>
    <p><strong>Duration:</strong> 4 years</p>
    <p><strong>Eligibility:</strong> 10+2 with Physics, Chemistry, and Mathematics (PCM)</p>
    <h3>Entrance Exams:</h3>
    <ul>
        <li><strong>National Level:</strong> JEE Main, JEE Advanced</li>
        <li><strong>State-Level:</strong> MHT-CET, KCET, WBJEE, AP EAMCET, TS EAMCET, etc.</li>
        <li><strong>Private Universities:</strong> BITSAT (BITS Pilani), VITEEE (VIT Vellore), SRMJEEE (SRM University)</li>
    </ul>
    
    <h3>Top Colleges:</h3>
    <ul>
        <li><strong>IITs:</strong> IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur, etc.</li>
        <li><strong>NITs:</strong> NIT Trichy, NIT Surathkal, NIT Warangal, etc.</li>
        <li><strong>Other Top Institutes:</strong> BITS Pilani, IIIT Hyderabad, VIT Vellore, DTU Delhi</li>
    </ul>
    
    <h2>Major Specializations in B.Tech/B.E.:</h2>
    <ul>
        <li><strong>Computer Science and Engineering (CSE)</strong></li>
        <li><strong>Mechanical Engineering</strong></li>
        <li><strong>Civil Engineering</strong></li>
        <li><strong>Electrical Engineering</strong></li>
        <li><strong>Electronics and Communication Engineering (ECE)</strong></li>
        <li><strong>Information Technology (IT)</strong></li>
        <li><strong>Artificial Intelligence and Data Science</strong></li>
        <li><strong>Aeronautical/Aerospace Engineering</strong></li>
        <li><strong>Biotechnology Engineering</strong></li>
        <li><strong>Chemical Engineering</strong></li>
        <li><strong>Petroleum Engineering</strong></li>
        <li><strong>Robotics and Automation Engineering</strong></li>
    </ul>
    
    <h2>M.Tech/M.E. (Master of Technology/Master of Engineering)</h2>
    <p><strong>Duration:</strong> 2 years</p>
    <p><strong>Eligibility:</strong> B.Tech/B.E. in a relevant field</p>
    <h3>Entrance Exams:</h3>
    <ul>
        <li>GATE (Graduate Aptitude Test in Engineering)</li>
        <li>University-Specific Exams: VITMEE, SRMJEEE-PG</li>
    </ul>
    
    <h3>Top Colleges:</h3>
    <ul>
        <li>IITs, NITs, IIITs</li>
        <li>Indian Institute of Science (IISc), Bangalore</li>
        <li>ISRO-affiliated institutes for Aerospace & Space Engineering</li>
    </ul>
    
    <h2>Diploma in Engineering (Polytechnic)</h2>
    <p><strong>Duration:</strong> 3 years</p>
    <p><strong>Eligibility:</strong> 10th pass (or 12th pass for lateral entry)</p>
    <h3>Entrance Exams:</h3>
    <ul>
        <li>State polytechnic entrance exams like JEECUP, AP POLYCET, TS POLYCET</li>
    </ul>
    
    <h3>Top Colleges:</h3>
    <ul>
        <li>Government Polytechnic Colleges in each state</li>
        <li>MSU Baroda</li>
        <li>Jadavpur University</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>Engineering in India offers a vast array of specializations with excellent career prospects. Admission to top colleges is primarily through JEE Main, JEE Advanced, and state-level entrance exams. With the rise of AI, data science, and automation, engineering remains one of the most dynamic and evolving fields for students.</p>
</div>
        `;
        break;
        case "Medical": container.innerHTML=`
        <div class="medical-courses">
    <h2>Medical Courses in India</h2>

    <div class="course">
        <h3>MBBS (Bachelor of Medicine, Bachelor of Surgery)</h3>
        <p><strong>Duration:</strong> 5.5 years (including 1-year internship)</p>
        <p><strong>Eligibility:</strong> 10+2 with Physics, Chemistry, and Biology (PCB)</p>
        <p><strong>Entrance Exam:</strong> NEET-UG</p>
        <p><strong>Top Colleges:</strong> AIIMS Delhi, CMC Vellore, MAMC Delhi, AFMC Pune, KMC Manipal</p>
    </div>

    <div class="course">
        <h3>BDS (Bachelor of Dental Surgery)</h3>
        <p><strong>Duration:</strong> 5 years (including 1-year internship)</p>
        <p><strong>Eligibility:</strong> 10+2 with PCB</p>
        <p><strong>Entrance Exam:</strong> NEET-UG</p>
        <p><strong>Top Colleges:</strong> Maulana Azad Institute of Dental Sciences, Manipal College of Dental Sciences, Govt. Dental College Mumbai</p>
    </div>

    <div class="course">
        <h3>BAMS (Bachelor of Ayurvedic Medicine and Surgery)</h3>
        <p><strong>Duration:</strong> 5.5 years (including 1-year internship)</p>
        <p><strong>Eligibility:</strong> 10+2 with PCB</p>
        <p><strong>Entrance Exam:</strong> NEET-UG</p>
        <p><strong>Top Colleges:</strong> National Institute of Ayurveda Jaipur, BHU Varanasi, Govt. Ayurveda College Kerala</p>
    </div>

    <div class="course">
        <h3>BHMS (Bachelor of Homeopathic Medicine and Surgery)</h3>
        <p><strong>Duration:</strong> 5.5 years (including 1-year internship)</p>
        <p><strong>Eligibility:</strong> 10+2 with PCB</p>
        <p><strong>Entrance Exam:</strong> NEET-UG</p>
        <p><strong>Top Colleges:</strong> National Institute of Homeopathy Kolkata, Bharati Vidyapeeth Pune, Nehru Homeopathic Medical College Delhi</p>
    </div>

    <div class="course">
        <h3>BPT (Bachelor of Physiotherapy)</h3>
        <p><strong>Duration:</strong> 4.5 years (including a 6-month internship)</p>
        <p><strong>Eligibility:</strong> 10+2 with PCB</p>
        <p><strong>Entrance Exam:</strong> Varies by college</p>
        <p><strong>Top Colleges:</strong> CMC Vellore, Manipal College of Health Professions, Sri Ramachandra Institute Chennai</p>
    </div>

    <div class="course">
        <h3>B.Pharm (Bachelor of Pharmacy)</h3>
        <p><strong>Duration:</strong> 4 years</p>
        <p><strong>Eligibility:</strong> 10+2 with PCB/PCM</p>
        <p><strong>Entrance Exam:</strong> GPAT, MHT-CET, WBJEE-PHARMA</p>
        <p><strong>Top Colleges:</strong> Jamia Hamdard Delhi, ICT Mumbai, NIPER Mohali</p>
    </div>

    <div class="course">
        <h3>B.Sc Nursing</h3>
        <p><strong>Duration:</strong> 4 years</p>
        <p><strong>Eligibility:</strong> 10+2 with PCB</p>
        <p><strong>Entrance Exam:</strong> AIIMS Nursing, JIPMER Nursing</p>
        <p><strong>Top Colleges:</strong> AIIMS Delhi, CMC Vellore, AFMC Pune</p>
    </div>

    <h3>Postgraduate Medical Courses</h3>
    <ul>
        <li>MD/MS (Doctor of Medicine/Master of Surgery) – NEET-PG required</li>
        <li>MDS (Master of Dental Surgery) – NEET MDS required</li>
        <li>M.Pharm (Master of Pharmacy) – GPAT required</li>
        <li>MPT (Master of Physiotherapy) – Institute-specific exams</li>
    </ul>
</div>

        `;
        break;
        case "Commerce":container.innerHTML=`
        <div class="commerce-courses">
    <h1>Commerce and Management Courses in India</h1>
    <p>Commerce and Management courses in India offer diverse career opportunities in finance, accounting, business administration, marketing, and entrepreneurship. These courses are available at undergraduate, postgraduate, and diploma levels.</p>
    
    <h2>1. Undergraduate Courses (UG)</h2>
    
    <h3>1.1 B.Com (Bachelor of Commerce)</h3>
    <p><strong>Duration:</strong> 3 years</p>
    <p><strong>Eligibility:</strong> 10+2 with Commerce or any stream</p>
    <p><strong>Entrance Exams:</strong> Merit-based or entrance exams like CUET, IPU CET</p>
    
    <h4>Specializations:</h4>
    <ul>
        <li>Accounting and Finance</li>
        <li>Banking and Insurance</li>
        <li>Taxation</li>
        <li>Economics</li>
    </ul>
    
    <h4>Top Colleges:</h4>
    <ul>
        <li>Shri Ram College of Commerce (SRCC), Delhi</li>
        <li>Hindu College, Delhi</li>
        <li>St. Xavier's College, Mumbai</li>
        <li>Loyola College, Chennai</li>
    </ul>
    
    <h3>1.2 B.Com (Hons.)</h3>
    <p><strong>Focus Areas:</strong> In-depth study of finance, accounting, taxation, and business law</p>
    <p><strong>Entrance Exams:</strong> DUET, CUET, Christ University Entrance Test</p>
    
    <h3>1.3 BBA (Bachelor of Business Administration)</h3>
    <p><strong>Duration:</strong> 3 years</p>
    <p><strong>Eligibility:</strong> 10+2 in any stream</p>
    
    <h4>Entrance Exams:</h4>
    <ul>
        <li>DU JAT (Delhi University)</li>
        <li>NPAT (NMIMS)</li>
        <li>IPMAT (IIM Indore & Rohtak)</li>
        <li>SET (Symbiosis)</li>
    </ul>
    
    <h4>Specializations:</h4>
    <ul>
        <li>Marketing</li>
        <li>Human Resource Management</li>
        <li>Finance</li>
        <li>International Business</li>
    </ul>
    
    <h4>Top Colleges:</h4>
    <ul>
        <li>IIM Indore (IPM Program)</li>
        <li>Shaheed Sukhdev College of Business Studies, Delhi</li>
        <li>NMIMS Mumbai</li>
        <li>Christ University, Bangalore</li>
    </ul>
    
    <h2>2. Postgraduate Courses (PG)</h2>
    <h3>2.1 M.Com (Master of Commerce)</h3>
    <p><strong>Duration:</strong> 2 years</p>
    <p><strong>Eligibility:</strong> B.Com or equivalent degree</p>
    
    <h4>Top Colleges:</h4>
    <ul>
        <li>Delhi School of Economics (DSE), DU</li>
        <li>St. Xavier's College, Kolkata</li>
        <li>Loyola College, Chennai</li>
    </ul>
    
    <h3>2.2 MBA (Master of Business Administration)</h3>
    <p><strong>Duration:</strong> 2 years</p>
    <p><strong>Eligibility:</strong> Bachelor's degree in any discipline</p>
    
    <h4>Entrance Exams:</h4>
    <ul>
        <li>CAT, XAT, NMAT, SNAP, MAT, CMAT, GMAT</li>
    </ul>
    
    <h4>Top Colleges:</h4>
    <ul>
        <li>IIMs (Ahmedabad, Bangalore, Calcutta)</li>
        <li>XLRI Jamshedpur</li>
        <li>FMS Delhi</li>
        <li>ISB Hyderabad</li>
    </ul>
    
    <h2>3. Professional Courses</h2>
    <h3>3.1 CA (Chartered Accountancy)</h3>
    <p><strong>Conducted By:</strong> ICAI</p>
    <h4>Levels:</h4>
    <ul>
        <li>CA Foundation (After 12th)</li>
        <li>CA Intermediate</li>
        <li>CA Final</li>
    </ul>
    
    <h3>3.2 CS (Company Secretary)</h3>
    <p><strong>Conducted By:</strong> ICSI</p>
    <h4>Levels:</h4>
    <ul>
        <li>CSEET (After 12th)</li>
        <li>CS Executive</li>
        <li>CS Professional</li>
    </ul>
    
    <h2>4. Diploma & Certificate Courses</h2>
    <ul>
        <li>Diploma in Banking and Finance</li>
        <li>Diploma in Digital Marketing</li>
        <li>Certificate in Financial Accounting</li>
        <li>Certificate in Entrepreneurship & Business Development</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>Commerce and Management courses in India provide a strong foundation in finance, business, marketing, and economics. Top institutions like IIMs, SRCC, NMIMS, and XLRI offer excellent career prospects in the corporate world.</p>
</div>
        `;
        break;


        case "Arts": container.innerHTML = `
        <div class="container">
        <h1>Arts and Humanities Courses in India</h1>
        <p>Arts and Humanities courses in India offer a broad range of subjects in literature, history, philosophy, sociology, political science, psychology, journalism, and fine arts. These courses provide diverse career opportunities in academia, media, civil services, law, social work, and creative fields.</p>

        <div class="section">
            <h2>1. Undergraduate Courses (UG)</h2>
            <div class="subsection">
                <h3>1.1 BA (Bachelor of Arts)</h3>
                <p><strong>Duration:</strong> 3 years</p>
                <p><strong>Eligibility:</strong> 10+2 in any stream</p>
                <p><strong>Entrance Exams:</strong> CUET, DUET, JNUEE</p>
                <p><strong>Specializations:</strong></p>
                <ul>
                    <li>History</li>
                    <li>Political Science</li>
                    <li>Sociology</li>
                    <li>Psychology</li>
                    <li>Economics</li>
                    <li>English Literature</li>
                </ul>
                <p><strong>Top Colleges:</strong></p>
                <ul class="institutes">
                    <li>Delhi University (Hindu College, Miranda House, Lady Shri Ram College)</li>
                    <li>JNU, Delhi</li>
                    <li>St. Xavier’s College, Mumbai</li>
                    <li>Presidency University, Kolkata</li>
                </ul>
            </div>
            <div class="subsection">
                <h3>1.2 BA (Hons.)</h3>
                <p><strong>Focus Areas:</strong> In-depth study of a specific subject</p>
                <p><strong>Top Colleges:</strong> SRCC, LSR, Christ University</p>
            </div>
            <div class="subsection">
                <h3>1.3 BFA (Bachelor of Fine Arts)</h3>
                <p><strong>Duration:</strong> 4 years</p>
                <p><strong>Eligibility:</strong> 10+2 (Some institutes require an aptitude test)</p>
                <p><strong>Specializations:</strong> Painting, Sculpture, Animation, Graphic Design</p>
                <p><strong>Top Colleges:</strong></p>
                <ul class="institutes">
                    <li>JJ School of Arts, Mumbai</li>
                    <li>Banaras Hindu University (BHU)</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2>2. Postgraduate Courses (PG)</h2>
            <div class="subsection">
                <h3>2.1 MA (Master of Arts)</h3>
                <p><strong>Duration:</strong> 2 years</p>
                <p><strong>Entrance Exams:</strong> CUET-PG, JNUEE, DUET</p>
                <p><strong>Top Colleges:</strong></p>
                <ul class="institutes">
                    <li>Delhi University</li>
                    <li>JNU</li>
                    <li>Tata Institute of Social Sciences</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2>3. Diploma & Certificate Courses</h2>
            <ul>
                <li>Diploma in Creative Writing</li>
                <li>Diploma in Photography</li>
                <li>Certificate in Event Management</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>Conclusion</h2>
            <p>Arts and Humanities courses in India offer diverse career opportunities in academia, media, law, fine arts, and social work. Top universities like DU, JNU, TISS, and IIMC provide excellent education in these fields.</p>
        </div>
    </div>
        `;
        break;


        case "Design":container.innerHTML = `
        <div class="container">
        <h1>Design and Architecture Courses in India</h1>
        <p>Design and Architecture courses in India offer diverse career opportunities in interior design, fashion design, industrial design, animation, urban planning, and architecture. These courses provide a combination of creativity, technical knowledge, and practical application.</p>

        <div class="section">
            <h2>1. Architecture Courses</h2>
            <div class="subsection">
                <h3>1.1 Bachelor of Architecture (B.Arch)</h3>
                <p><strong>Duration:</strong> 5 years</p>
                <p><strong>Eligibility:</strong> 10+2 with PCM</p>
                <p><strong>Entrance Exams:</strong> NATA, JEE Main Paper 2</p>
                <p><strong>Top Colleges:</strong></p>
                <ul class="institutes">
                    <li>School of Planning and Architecture (SPA), Delhi</li>
                    <li>IIT Kharagpur, IIT Roorkee</li>
                    <li>Sir J.J. College of Architecture, Mumbai</li>
                    <li>CEPT University, Ahmedabad</li>
                </ul>
            </div>
            <div class="subsection">
                <h3>1.2 Master of Architecture (M.Arch)</h3>
                <p><strong>Duration:</strong> 2 years</p>
                <p><strong>Eligibility:</strong> B.Arch degree</p>
                <p><strong>Entrance Exams:</strong> GATE, CEED</p>
            </div>
        </div>
        
        <div class="section">
            <h2>2. Design Courses</h2>
            <div class="subsection">
                <h3>2.1 Bachelor of Design (B.Des)</h3>
                <p><strong>Duration:</strong> 4 years</p>
                <p><strong>Eligibility:</strong> 10+2 in any stream</p>
                <p><strong>Entrance Exams:</strong> UCEED, NID DAT, NIFT Entrance Exam</p>
                <p><strong>Specializations:</strong></p>
                <ul>
                    <li>Industrial Design</li>
                    <li>Graphic Design</li>
                    <li>Interior Design</li>
                    <li>Textile Design</li>
                </ul>
            </div>
            <div class="subsection">
                <h3>2.2 Master of Design (M.Des)</h3>
                <p><strong>Duration:</strong> 2 years</p>
                <p><strong>Eligibility:</strong> B.Des or equivalent degree</p>
                <p><strong>Entrance Exams:</strong> CEED, NID DAT PG, NIFT PG</p>
                <p><strong>Top Colleges:</strong></p>
                <ul class="institutes">
                    <li>NID Ahmedabad</li>
                    <li>IIT Bombay (IDC School of Design)</li>
                    <li>Srishti Institute of Art, Bangalore</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2>3. Diploma & Certificate Courses</h2>
            <ul>
                <li>Diploma in Interior Design – 1 year</li>
                <li>Certificate in Animation & Multimedia – 6 months to 1 year</li>
                <li>Diploma in Fashion Design – 1 year</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>Conclusion</h2>
            <p>Design and Architecture courses in India offer excellent career prospects in creative and technical fields. Top institutes like IITs, NID, NIFT, SPA, and CEPT provide industry-relevant education, preparing students for careers in architecture, fashion, interior design, and digital arts.</p>
        </div>
    </div>
        `;
        break;


        case "Hotel": container.innerHTML = `
        <div>
        <h1>Hotel Management and Tourism Courses in India</h1>

<p>Hotel Management and Tourism courses in India provide career opportunities in hospitality, event management, travel & tourism, and food & beverage industries. These courses focus on practical skills, customer service, and business management.</p>

<h2>1. Undergraduate Courses (UG)</h2>

<h3>1.1 Bachelor of Hotel Management (BHM)</h3>
<ul>
    <li><strong>Duration:</strong> 3–4 years</li>
    <li><strong>Eligibility:</strong> 10+2 in any stream</li>
    <li><strong>Entrance Exams:</strong> NCHM JEE, AIMA UGAT BHM, IPU CET</li>
    <li><strong>Top Colleges:</strong> IHM Delhi, IHM Mumbai, WGSHA Manipal</li>
</ul>

<h3>1.2 B.Sc in Hospitality and Hotel Administration (B.Sc HHA)</h3>
<ul>
    <li><strong>Duration:</strong> 3 years</li>
    <li><strong>Eligibility:</strong> 10+2 in any stream</li>
    <li><strong>Entrance Exam:</strong> NCHM JEE</li>
    <li><strong>Top Colleges:</strong> IHM Institutes, BHU</li>
</ul>

<h2>2. Postgraduate Courses (PG)</h2>

<h3>2.1 Master of Hotel Management (MHM)</h3>
<ul>
    <li><strong>Duration:</strong> 2 years</li>
    <li><strong>Eligibility:</strong> Bachelor's in Hotel Management</li>
    <li><strong>Entrance Exam:</strong> PUTHAT, NCHMCT PG</li>
    <li><strong>Top Colleges:</strong> IHM Institutes, Christ University</li>
</ul>

<h3>2.2 MBA in Hospitality and Tourism Management</h3>
<ul>
    <li><strong>Duration:</strong> 2 years</li>
    <li><strong>Eligibility:</strong> Bachelor's degree in any discipline</li>
    <li><strong>Entrance Exams:</strong> CAT, MAT, XAT, CMAT</li>
    <li><strong>Top Colleges:</strong> IIM Bangalore, IITTM</li>
</ul>

<h2>3. Diploma & Certificate Courses</h2>
<ul>
    <li>Diploma in Hotel Management – 1–2 years</li>
    <li>Diploma in Food & Beverage Services – 1 year</li>
    <li>Certificate in Event Management – 6 months</li>
</ul>

<h2>Conclusion</h2>
<p>Hotel Management and Tourism courses in India provide excellent career opportunities in hospitality, food & beverage, travel, and event management. Top institutes like IHMs, IITTM, and Christ University offer specialized training with strong industry placements.</p>

        </div>
        `;
        break;


        case "Law": container.innerHTML =`
        <div>
        <h1>Law Courses in India</h1>

<p>Law courses in India offer career opportunities in advocacy, corporate law, judiciary, legal consultancy, and public administration. These courses focus on legal principles, case studies, and courtroom practices.</p>

<h2>1. Undergraduate Law Courses (UG)</h2>

<h3>1.1 Bachelor of Laws (LLB)</h3>
<ul>
    <li><strong>Duration:</strong> 3 years</li>
    <li><strong>Eligibility:</strong> Bachelor's degree in any stream</li>
    <li><strong>Entrance Exams:</strong> DU LLB, CUET PG (BHU), MH CET Law</li>
    <li><strong>Top Colleges:</strong> Faculty of Law (DU), BHU, GLC Mumbai</li>
</ul>

<h3>1.2 Integrated Law Courses (After 12th)</h3>
<ul>
    <li><strong>Duration:</strong> 5 years</li>
    <li><strong>Eligibility:</strong> 10+2 in any stream</li>
    <li><strong>Courses:</strong> BA LLB, BBA LLB, B.Com LLB, B.Sc LLB</li>
    <li><strong>Entrance Exams:</strong> CLAT, AILET, LSAT India, SLAT</li>
    <li><strong>Top Colleges:</strong> NLUs (NLSIU, NALSAR, NUJS), JGLS, SLS Pune</li>
</ul>

<h2>2. Postgraduate Law Courses (PG)</h2>

<h3>2.1 Master of Laws (LLM)</h3>
<ul>
    <li><strong>Duration:</strong> 1 or 2 years</li>
    <li><strong>Eligibility:</strong> LLB degree</li>
    <li><strong>Entrance Exams:</strong> CLAT PG, AILET PG, DU LLM</li>
    <li><strong>Specializations:</strong> Corporate Law, Criminal Law, Constitutional Law, Human Rights Law</li>
    <li><strong>Top Colleges:</strong> NLSIU Bangalore, NALSAR Hyderabad, DU</li>
</ul>

<h3>2.2 MBA in Business Law</h3>
<ul>
    <li><strong>Duration:</strong> 2 years</li>
    <li><strong>Eligibility:</strong> Bachelor's degree in any field</li>
    <li><strong>Top Colleges:</strong> NLU Jodhpur, IIM Ahmedabad</li>
</ul>

<h2>3. Diploma & Certificate Law Courses</h2>
<ul>
    <li>Diploma in Cyber Law – 1 year (NALSAR, Asian School of Cyber Laws)</li>
    <li>Diploma in Corporate Law – 1 year (NUJS Kolkata, ILS Pune)</li>
    <li>Certificate in Intellectual Property Law – 6 months (WIPO-India, NLU Delhi)</li>
</ul>

<h2>4. Doctoral Law Courses</h2>

<h3>4.1 PhD in Law</h3>
<ul>
    <li><strong>Duration:</strong> 3–5 years</li>
    <li><strong>Eligibility:</strong> LLM degree</li>
    <li><strong>Top Institutes:</strong> NLSIU Bangalore, JNU, NLU Delhi</li>
</ul>

<h2>Conclusion</h2>
<p>Law courses in India provide excellent career opportunities in litigation, corporate law, and judiciary. Top law colleges like NLUs, DU, and JGLS offer world-class legal education and placements in top firms and government sectors.</p>

        </div>
        `;
        break;


        case "Agriculture": container.innerHTML=`
        <div>
        <h1>Agriculture and Environmental Science Courses in India</h1>

<p>Agriculture and Environmental Science courses in India offer career opportunities in farming, agribusiness, food technology, forestry, ecology, climate science, and environmental management. These courses focus on sustainable development, conservation, and scientific advancements.</p>

<h2>1. Agriculture Courses in India</h2>

<h3>1.1 Undergraduate Agriculture Courses (UG)</h3>

<h4>1.1.1 B.Sc Agriculture</h4>
<ul>
    <li><strong>Duration:</strong> 4 years</li>
    <li><strong>Eligibility:</strong> 10+2 with PCM/PCB/Agriculture</li>
    <li><strong>Entrance Exams:</strong> ICAR AIEEA UG, KEAM, EAMCET, KCET</li>
    <li><strong>Top Colleges:</strong> IARI Delhi, TNAU, PAU</li>
</ul>

<h4>1.1.2 B.Tech in Agricultural Engineering</h4>
<ul>
    <li><strong>Duration:</strong> 4 years</li>
    <li><strong>Eligibility:</strong> 10+2 with PCM</li>
    <li><strong>Entrance Exams:</strong> JEE Main, ICAR AIEEA UG</li>
    <li><strong>Top Colleges:</strong> IIT Kharagpur, G.B. Pant University</li>
</ul>

<h4>1.1.3 Other UG Courses</h4>
<ul>
    <li>B.Sc Horticulture – Fruits, vegetables, floriculture</li>
    <li>B.Sc Forestry – Forest conservation & management</li>
    <li>B.Sc Dairy Technology – Milk production & processing</li>
</ul>

<h3>1.2 Postgraduate Agriculture Courses (PG)</h3>

<h4>1.2.1 M.Sc Agriculture</h4>
<ul>
    <li><strong>Duration:</strong> 2 years</li>
    <li><strong>Eligibility:</strong> B.Sc Agriculture or related degree</li>
    <li><strong>Entrance Exams:</strong> ICAR AIEEA PG, CUET PG</li>
    <li><strong>Top Colleges:</strong> IARI Delhi, TNAU</li>
</ul>

<h4>1.2.2 M.Tech in Agricultural Engineering</h4>
<ul>
    <li><strong>Duration:</strong> 2 years</li>
    <li><strong>Eligibility:</strong> B.Tech in Agricultural Engineering</li>
    <li><strong>Entrance Exams:</strong> GATE, ICAR AIEEA PG</li>
</ul>

<h3>1.3 Diploma & Certificate Courses in Agriculture</h3>
<ul>
    <li>Diploma in Agriculture – 2 years</li>
    <li>Certificate in Organic Farming – 6 months</li>
    <li>Diploma in Dairy Technology – 1 year</li>
</ul>

<h2>2. Environmental Science Courses in India</h2>

<h3>2.1 Undergraduate Environmental Science Courses (UG)</h3>

<h4>2.1.1 B.Sc Environmental Science</h4>
<ul>
    <li><strong>Duration:</strong> 3 years</li>
    <li><strong>Eligibility:</strong> 10+2 with PCM/PCB</li>
    <li><strong>Top Colleges:</strong> JNU, Fergusson College</li>
</ul>

<h4>2.1.2 B.Tech in Environmental Engineering</h4>
<ul>
    <li><strong>Duration:</strong> 4 years</li>
    <li><strong>Eligibility:</strong> 10+2 with PCM</li>
    <li><strong>Entrance Exams:</strong> JEE Main, State-level exams</li>
    <li><strong>Top Colleges:</strong> IIT Delhi, IIT Kharagpur, NIT Trichy</li>
</ul>

<h3>2.2 Postgraduate Environmental Science Courses (PG)</h3>

<h4>2.2.1 M.Sc Environmental Science</h4>
<ul>
    <li><strong>Duration:</strong> 2 years</li>
    <li><strong>Eligibility:</strong> B.Sc Environmental Science or related field</li>
    <li><strong>Entrance Exams:</strong> CUET PG, JNUEE</li>
    <li><strong>Top Colleges:</strong> JNU, BHU</li>
</ul>

<h4>2.2.2 M.Tech in Environmental Engineering</h4>
<ul>
    <li><strong>Duration:</strong> 2 years</li>
    <li><strong>Eligibility:</strong> B.Tech in Environmental Engineering</li>
    <li><strong>Entrance Exams:</strong> GATE</li>
    <li><strong>Top Colleges:</strong> IIT Bombay, IIT Madras</li>
</ul>

<h3>2.3 Diploma & Certificate Courses in Environmental Science</h3>
<ul>
    <li>Diploma in Environmental Management – 1 year</li>
    <li>Certificate in Climate Change & Sustainable Development – 6 months</li>
</ul>

<h2>3. Doctoral Courses in Agriculture & Environmental Science</h2>
<ul>
    <li>PhD in Agriculture – 3–5 years (IARI, ICAR Institutes)</li>
    <li>PhD in Environmental Science – 3–5 years (IITs, JNU)</li>
</ul>

<h2>Conclusion</h2>
<p>Agriculture and Environmental Science courses in India offer excellent career opportunities in sustainable development, agribusiness, food technology, and environmental conservation. Top institutes like IARI, IITs, and JNU provide research-driven education in these fields.</p>

        </div>
        `;
        break;


        case "Aviation":container.innerHTML=`
            <div class="container">
        <h1>Aviation Courses in India</h1>
        <p>Aviation is a dynamic field that offers various career opportunities in pilot training, aircraft maintenance, air traffic control, airport management, and aviation hospitality. Aviation courses in India are available at diploma, undergraduate, postgraduate, and certification levels.</p>

        <div class="section">
            <h2>1. Pilot Training Courses</h2>
            <div class="subsection">
                <h3>1.1 Commercial Pilot License (CPL)</h3>
                <p><strong>Duration:</strong> 12–18 months</p>
                <p><strong>Eligibility:</strong></p>
                <ul>
                    <li>10+2 with Physics & Mathematics</li>
                    <li>Minimum age: 17 years</li>
                    <li>Medical fitness as per DGCA norms</li>
                </ul>
                <p><strong>Entrance Exam:</strong> DGCA Class 1 Medical Test & Institute-specific exams</p>
                <p><strong>Course Details:</strong></p>
                <ul>
                    <li>Flying training (200 hours)</li>
                    <li>Ground school (navigation, meteorology, aviation law)</li>
                </ul>
                <p><strong>Top Institutes:</strong></p>
                <ul class="institutes">
                    <li>Indira Gandhi Institute of Aeronautics, Kochi</li>
                    <li>Indira Gandhi Institute of Aerospace Engineering, Pune</li>
                    <li>Rajiv Gandhi Aviation Academy, Hyderabad</li>
                    <li>Capt. Gopi Aviation, Bangalore</li>
                </ul>
            </div>
            <div class="subsection">
                <h3>1.2 Private Pilot License (PPL)</h3>
                <p><strong>Duration:</strong> 6–12 months</p>
                <p><strong>Eligibility:</strong> Same as CPL</p>
                <p><strong>Scope:</strong> Recreational flying or as a step towards CPL</p>
            </div>
            <div class="subsection">
                <h3>1.3 Student Pilot License (SPL)</h3>
                <p><strong>Duration:</strong> 4–6 months</p>
                <p><strong>Eligibility:</strong> Entry-level license for pilot training aspirants</p>
            </div>
        </div>
        
        <div class="section">
            <h2>2. Undergraduate Aviation Courses (B.Sc, BBA, B.Tech)</h2>
            <div class="subsection">
                <h3>2.1 B.Sc. in Aviation</h3>
                <p><strong>Duration:</strong> 3 years</p>
                <p><strong>Eligibility:</strong> 10+2 with PCM</p>
                <p><strong>Subjects Covered:</strong> Air navigation, aircraft maintenance, air traffic control</p>
                <p><strong>Top Colleges:</strong></p>
                <ul class="institutes">
                    <li>Indira Gandhi Institute of Aeronautics, Chandigarh</li>
                    <li>Amity University, Noida</li>
                    <li>Mumbai University</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2>3. Diploma Courses in Aviation</h2>
            <div class="subsection">
                <h3>3.1 Diploma in Aviation</h3>
                <p><strong>Duration:</strong> 6 months to 1 year</p>
                <p><strong>Eligibility:</strong> 10+2</p>
                <p><strong>Scope:</strong> Covers airline management, ground staff operations</p>
                <p><strong>Top Institutes:</strong> Frankfinn Institute, Indira Gandhi Institute of Aeronautics</p>
            </div>
        </div>
        
        <div class="section">
            <h2>4. Postgraduate Aviation Courses (M.Sc, MBA, PG Diploma)</h2>
            <div class="subsection">
                <h3>4.1 M.Sc. in Aviation</h3>
                <p><strong>Duration:</strong> 2 years</p>
                <p><strong>Eligibility:</strong> B.Sc in Aviation or related fields</p>
                <p><strong>Subjects Covered:</strong> Aviation safety, air traffic management</p>
            </div>
        </div>
        
        <div class="section">
            <h2>5. Certificate Courses in Aviation</h2>
            <ul>
                <li>Cabin Crew Training (3–6 months)</li>
                <li>Ground Staff Training (6 months)</li>
                <li>Aviation Safety and Security Management</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>Conclusion</h2>
            <p>Aviation courses in India offer excellent career opportunities in pilot training, airport management, aircraft maintenance, and air traffic control. DGCA-approved training institutes and top universities provide world-class education in this field.</p>
        </div>
    </div>
        `;
    }
}
