$(document).ready(function() {
    // 1. Navbar Scroll Effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled shadow-md py-2').removeClass('py-4 shadow-sm');
        } else {
            $('.navbar').removeClass('scrolled shadow-md py-2').addClass('py-4 shadow-sm');
        }
    });

    // 2. Fetch and Render Dynamic Content
    let allNotices = [];
    let allAchievements = [];

    const loadContentData = () => {
        $.getJSON('assets/data/content.json', function(data) {
            allNotices = data.notices;
            allAchievements = data.achievements;
            renderNotices(allNotices);
            renderPrograms(data.programs);
            renderAchievements(allAchievements);
        }).fail(function() {
            console.error("Error loading content data.");
        });
    };
    loadContentData();

    // Rendering Helpers
    const renderNotices = (notices) => {
        const $gridContainer = $('#notices-grid');
        const $listContainer = $('#notices-list-container');
        
        // Handle Home Grid View
        if ($gridContainer.length) {
            $gridContainer.empty();
            if (notices.length === 0) {
                $gridContainer.html('<div class="col-12 text-center my-5"><p class="text-muted">No notices found.</p></div>');
                return;
            }

            // Show latest 3 on homepage
            notices.slice(0, 3).forEach(notice => {
                const badgeClass = `badge-${notice.type.toLowerCase()}`;
                const card = `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="notice-card h-100 p-4 bg-white shadow-sm border-0 position-relative" style="border-top: 5px solid ${getTypeColor(notice.type)} !important; border-radius: 12px; overflow: hidden;">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="notice-badge ${badgeClass} text-uppercase px-2 py-1 rounded-1 fw-bold" style="font-size: 0.65rem;">${notice.type}</span>
                                <span class="text-muted" style="font-size: 0.75rem;">${notice.date}</span>
                            </div>
                            <h4 class="fw-bold primary-navy mb-3 h5" style="line-height:1.4;">${notice.title}</h4>
                            <p class="text-muted small mb-4">${notice.content.substring(0, 100)}...</p>
                            <a href="notices.html" class="text-decoration-none fw-bold primary-navy" style="font-size: 0.85rem;">Read More <i class="bi bi-arrow-right-short fs-5 align-middle"></i></a>
                        </div>
                    </div>
                `;
                $gridContainer.append(card);
            });
        }

        // Handle Notice Board List View
        if ($listContainer.length) {
            $listContainer.empty();
            if (notices.length === 0) {
                $listContainer.html('<div class="text-center my-5 py-5"><i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i><p class="text-muted">No notices found matching your search.</p></div>');
                return;
            }

            notices.forEach(notice => {
                const badgeClass = `badge-${notice.type.toLowerCase()}`;
                const iconClass = getTypeIcon(notice.type);
                const color = getTypeColor(notice.type);
                
                const item = `
                    <div class="notice-list-item d-flex align-items-start mb-4 bg-white p-4 p-md-5 rounded-4 shadow-sm border-0">
                        <div class="notice-list-icon me-4 d-none d-md-flex shadow-sm" style="background-color: ${color}10; color: ${color}; width: 64px; height: 64px; border: 1px solid ${color}30; border-radius: 50%; align-items: center; justify-content: center; font-size: 1.75rem; flex-shrink: 0;">
                            <i class="bi ${iconClass}"></i>
                        </div>
                        <div class="notice-list-content w-100">
                            <div class="mb-3">
                                <span class="notice-badge ${badgeClass} text-uppercase px-2 py-1 rounded-1 fw-bold mb-2 d-inline-block" style="font-size: 0.65rem; border-radius: 4px !important;">${notice.type}</span>
                                <h3 class="fw-bold primary-navy mb-2 h4" style="letter-spacing: -0.5px;">${notice.title}</h3>
                                <div class="text-muted small d-flex align-items-center mb-3">
                                    <i class="bi bi-calendar3 me-2 text-primary"></i> ${notice.date} <span class="mx-2">@</span> <i class="bi bi-clock me-2 text-primary"></i> ${notice.time}
                                </div>
                            </div>
                            <p class="text-muted mb-4" style="line-height: 1.8; font-size: 0.95rem;">${notice.content}</p>
                            <a href="${notice.link}" class="text-decoration-none fw-bold primary-navy hover-accent d-inline-flex align-items-center" style="font-size: 0.9rem;">
                                Read Full Notice <i class="bi bi-arrow-right-short fs-4 ms-1"></i>
                            </a>
                        </div>
                    </div>
                `;
                $listContainer.append(item);
            });
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            'Urgent': '#ef4444',
            'Event': '#0284c7',
            'Important': '#ca8a04',
            'News': '#0891b2',
            'Features': '#16a34a',
            'Academic': '#ea580c'
        };
        return colors[type] || '#003366';
    };

    const getTypeIcon = (type) => {
        const icons = {
            'Urgent': 'bi-alarm-fill',
            'Event': 'bi-calendar-event-fill',
            'Important': 'bi-calendar-date-fill',
            'News': 'bi-megaphone-fill',
            'Features': 'bi-star-fill',
            'Academic': 'bi-book-fill'
        };
        return icons[type] || 'bi-info-circle-fill';
    };

    const renderPrograms = (programs) => {
        const $container = $('#programs-grid');
        programs.forEach(program => {
            const card = `
                <div class="col-md-5 mb-4">
                    <div class="program-card">
                        <span class="program-icon">${program.icon}</span>
                        <h3 class="program-title">${program.title}</h3>
                        <p class="program-subtitle">${program.subtitle}</p>
                        <p class="program-description">${program.description}</p>
                    </div>
                </div>
            `;
            $container.append(card);
        });
    };

    const renderAchievements = (achievements) => {
        const $container = $('#achievements-grid');
        if (!$container.length) return;

        $container.empty();
        achievements.forEach(achievement => {
            const card = `
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="achievement-card">
                        <div class="d-flex justify-content-between align-items-start">
                            <span class="fs-2">${achievement.icon}</span>
                            <span class="achievement-year-badge">${achievement.year}</span>
                        </div>
                        <h4 class="achievement-title">${achievement.title}</h4>
                        <p class="achievement-category">${achievement.category}</p>
                        <p class="achievement-desc">${achievement.description}</p>
                        <button class="btn btn-achievement shadow-none border-0 py-2 px-3 fw-bold small" data-id="${achievement.id}">
                            <i class="bi bi-award me-2"></i> View Details
                        </button>
                    </div>
                </div>
            `;
            $container.append(card);
        });
    };

    // Achievement Modal Logic
    $(document).on('click', '.btn-achievement', function() {
        const id = $(this).data('id');
        const achievement = allAchievements.find(a => a.id === id);
        
        if (achievement) {
            $('#modalAchievementIcon').text(achievement.icon);
            $('#modalAchievementTitle').text(achievement.title);
            $('#modalAchievementCategory').text(achievement.category);
            $('#modalAchievementYearBadge').text(achievement.year);
            $('#modalAchievementOverview').text(achievement.overview || achievement.description);
            
            // Render Key Achievements
            const $keyList = $('#modalAchievementKeyList');
            $keyList.empty();
            if (achievement.keyAchievements) {
                achievement.keyAchievements.forEach(item => {
                    $keyList.append(`
                        <li class="d-flex align-items-start mb-3">
                            <div class="achievement-item-icon me-3 mt-1">
                                <i class="bi bi-trophy-fill"></i>
                            </div>
                            <span class="text-muted" style="font-size: 0.95rem; line-height: 1.6;">${item}</span>
                        </li>
                    `);
                });
            }

            // Render Students
            const $studentList = $('#modalAchievementStudents');
            $studentList.empty();
            if (achievement.outstandingStudents) {
                achievement.outstandingStudents.forEach(student => {
                    $studentList.append(`
                        <div class="student-pill">${student}</div>
                    `);
                });
            }

            $('#achievementModal').modal('show');
        }
    });

    // 3. Search Logic
    $('#noticeSearch, #noticeBoardSearch').on('input', function() {
        const query = $(this).val().toLowerCase();
        const filteredNotices = allNotices.filter(notice => 
            notice.title.toLowerCase().includes(query) || 
            notice.content.toLowerCase().includes(query) ||
            notice.type.toLowerCase().includes(query)
        );
        renderNotices(filteredNotices);
    });

    // 4. Form Validation
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const subject = $('#subject').val().trim();
        const message = $('#message').val().trim();

        // Simple validation
        if (name === "" || email === "" || subject === "" || message === "") {
            isValid = false;
            alert("Please fill in all required fields.");
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            isValid = false;
            alert("Please enter a valid email address.");
        }

        if (isValid) {
            // Simulate submission
            const btn = $(this).find('button[type="submit"]');
            btn.html('<span class="spinner-border spinner-border-sm me-2"></span>Sending...');
            btn.prop('disabled', true);

            setTimeout(() => {
                alert("Thank you! Your message has been sent successfully.");
                $(this)[0].reset();
                btn.html('Send Message');
                btn.prop('disabled', false);
                $('#contactModal').modal('hide');
            }, 1500);
        }
    });

    // 5. Multi-Step Admission Modal Logic
    let currentStep = 1;
    const totalSteps = 9;

    const updateModalUI = () => {
        // Update Steps Visibility
        $('.form-step').removeClass('active');
        $(`.form-step[data-step="${currentStep}"]`).addClass('active');

        // Update Progress Bar
        const progress = (currentStep / totalSteps) * 100;
        $('#formProgressBar').css('width', `${progress}%`).attr('aria-valuenow', progress);

        // Update Text
        const currentTitle = $(`.form-step[data-step="${currentStep}"]`).attr('data-title');
        $('#stepIndicatorName').text(currentTitle);
        $('#stepProgressText').text(`Step ${currentStep} of ${totalSteps}`);
        $('#bottomStepCounter').text(`Step ${currentStep} of ${totalSteps}`);

        // Update Buttons
        $('#prevStepBtn').prop('disabled', currentStep === 1);

        if (currentStep === totalSteps) {
            $('#nextStepBtn').html('<i class="bi bi-check-all me-1"></i> Submit Application').addClass('btn-success').removeClass('btn-next');
            
            // Populate Summary Fields in Step 9
            const fullName = $('input[name="fullName"]').val() || 'Not provided';
            const grade = $('input[name="gradeApplying"]').val() || 'Not provided';
            const fatherName = $('input[name="fatherFullName"]').val() || 'Not provided';
            const motherName = $('input[name="motherFullName"]').val() || 'Not provided';

            $('#summaryStudentName').text(fullName);
            $('#summaryGrade').text(grade);
            $('#summaryFatherName').text(fatherName);
            $('#summaryMotherName').text(motherName);
        } else {
            $('#nextStepBtn').html('Next <i class="bi bi-arrow-right ms-2"></i>').removeClass('btn-success').addClass('btn-next');
        }

        // Scroll to top of container for better experience on long steps
        if ($('.apply-container').length) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    $('#nextStepBtn').on('click', function() {
        if (currentStep < totalSteps) {
            // Optional: Add validation here per step
            currentStep++;
            updateModalUI();
        } else {
            // Final submission
            const btn = $(this);
            btn.html('<span class="spinner-border spinner-border-sm me-2"></span>Submitting...');
            btn.prop('disabled', true);

            setTimeout(() => {
                alert("Application submitted successfully! Our admissions office will contact you soon.");
                $('#admissionModal').modal('hide');
                
                // Reset for next time
                setTimeout(() => {
                    currentStep = 1;
                    $('#admissionForm')[0].reset();
                    updateModalUI();
                    btn.prop('disabled', false);
                }, 500);
            }, 2000);
        }
    });

    $('#prevStepBtn').on('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateModalUI();
        }
    });

    // Triggers for Admission Modal
    $('#btnApplyHome, .admission-trigger').on('click', function(e) {
        e.preventDefault();
        $('#admissionModal').modal('show');
    });
});
