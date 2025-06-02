// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the performance chart
    initPerformanceChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize tooltips for calendar events
    initTooltips();
    
    // Set the current date in the calendar
    highlightCurrentDay();
});


// Initialize the performance chart using Chart.js
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    const performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Pump Station A-42',
                    data: [95, 93, 94, 92, 90, 91],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Compressor B-17',
                    data: [90, 87, 88, 82, 78, 75],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Well Head C-09',
                    data: [85, 82, 78, 72, 65, 55],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'Storage Tank D-23',
                    data: [98, 97, 98, 96, 95, 97],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Efficiency %'
                    }
                }
            }
        }
    });
}

// Set up event listeners for interactive elements
function setupEventListeners() {
    // Work Order Modal handling
    const generateWorkOrderBtn = document.querySelector('.work-order-form .btn-primary');
    const workOrderModal = document.getElementById('workOrderModal');
    const closeModal = document.getElementById('closeModal');
    const modalClose = document.querySelector('.close-modal');
    
    if (generateWorkOrderBtn) {
        generateWorkOrderBtn.addEventListener('click', function() {
            showModal(workOrderModal);
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            hideModal(workOrderModal);
        });
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            hideModal(workOrderModal);
        });
    }

    const downloadWorkOrderPdfBtn = document.getElementById('downloadWorkOrderPdf');
    if (downloadWorkOrderPdfBtn) {
        downloadWorkOrderPdfBtn.addEventListener('click', function() {
            downloadWorkOrderPdf();
        });

    }
  
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === workOrderModal) {
            hideModal(workOrderModal);
        }

    });
    
    // Equipment card click to show detailed info
    const equipmentCards = document.querySelectorAll('.equipment-card');
    equipmentCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle an 'expanded' class for more details
            this.classList.toggle('expanded');
        });
    });
    
    // Calendar navigation
    const prevMonthBtn = document.querySelector('.calendar-header .fa-chevron-left').parentElement;
    const nextMonthBtn = document.querySelector('.calendar-header .fa-chevron-right').parentElement;
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            navigateCalendar('prev');
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            navigateCalendar('next');
        });
    }
    
    // Add event listeners for the sidebar navigation
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Add event listeners for the anomaly cards
    const investigateButtons = document.querySelectorAll('.anomaly-actions .btn:not(.btn-primary)');
    investigateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.anomaly-card');
            const equipmentName = card.querySelector('h4').textContent.split(':')[1].trim();
            alert(`Investigating issue on ${equipmentName}. Opening diagnostic panel...`);
        });
    });
    
    // Create work order buttons in anomaly cards
    const createWorkOrderButtons = document.querySelectorAll('.anomaly-actions .btn-primary');
    createWorkOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.anomaly-card');
            const equipmentName = card.querySelector('h4').textContent.split(':')[1].trim();
            
            // Find the equipment in the dropdown and select it
            const equipmentSelect = document.getElementById('equipment');
            for (let i = 0; i < equipmentSelect.options.length; i++) {
                if (equipmentSelect.options[i].text === equipmentName) {
                    equipmentSelect.selectedIndex = i;
                    break;
                }
            }
            
            // Set priority based on card class
            const prioritySelect = document.getElementById('priority');
            if (card.classList.contains('critical')) {
                setPriority(prioritySelect, 'critical');
            } else if (card.classList.contains('warning')) {
                setPriority(prioritySelect, 'high');
            } else {
                setPriority(prioritySelect, 'medium');
            }
            
            // Scroll to work order form
            document.querySelector('.work-order-form').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchEquipment(searchTerm);
        });
    }
    
    // PDF Download button handling
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', function() {
            downloadPdf();
        });
    }

    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
const addEquipmentModal = document.getElementById('addEquipmentModal');
const cancelAddEquipment = document.getElementById('cancelAddEquipment');
const confirmAddEquipment = document.getElementById('confirmAddEquipment');
const closeAddEquipmentModal = addEquipmentModal.querySelector('.close-modal');

if (addEquipmentBtn) {
    addEquipmentBtn.addEventListener('click', function() {
        showModal(addEquipmentModal);
    });
}

if (cancelAddEquipment) {
    cancelAddEquipment.addEventListener('click', function() {
        hideModal(addEquipmentModal);
    });
}

if (closeAddEquipmentModal) {
    closeAddEquipmentModal.addEventListener('click', function() {
        hideModal(addEquipmentModal);
    });
}

if (confirmAddEquipment) {
    confirmAddEquipment.addEventListener('click', function() {
        addNewEquipment();
    });
}
}

// Add this new function to handle equipment creation
function addNewEquipment() {
    const nameInput = document.getElementById('equipmentName');
    const typeSelect = document.getElementById('equipmentType');
    const locationInput = document.getElementById('equipmentLocation');
    
    if (!nameInput.value.trim()) {
        showNotification('Please enter equipment name', 'error');
        return;
    }
    
    const equipmentName = nameInput.value.trim();
    const equipmentType = typeSelect.value;
    const equipmentLocation = locationInput.value.trim() || 'Location not specified';
    
    // Create a new equipment card
    const equipmentGrid = document.querySelector('.equipment-grid');
    const newEquipmentCard = document.createElement('div');
    newEquipmentCard.className = 'equipment-card';
    newEquipmentCard.innerHTML = `
        <div class="equipment-header">
            <h3>${equipmentName}</h3>
            <div class="equipment-status healthy">
                <i class="fas fa-check-circle"></i> Healthy
            </div>
        </div>
        <div class="equipment-details">
            <div class="parameter">
                <span>Vibration</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.floor(Math.random() * 30) + 10}%"></div>
                </div>
            </div>
            <div class="parameter">
                <span>Temperature</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.floor(Math.random() * 30) + 10}%"></div>
                </div>
            </div>
            <div class="parameter">
                <span>Power</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.floor(Math.random() * 30) + 10}%"></div>
                </div>
            </div>
        </div>
        <div class="maintenance-timer">
            <i class="fas fa-clock"></i>
            <span>Next maintenance: ${Math.floor(Math.random() * 60) + 30} days</span>
        </div>
    `;
    
    // Add click handler for the new card
    newEquipmentCard.addEventListener('click', function() {
        this.classList.toggle('expanded');
    });
    
    // Add to the grid
    equipmentGrid.appendChild(newEquipmentCard);
    
    // Clear the form
    nameInput.value = '';
    locationInput.value = '';
    typeSelect.selectedIndex = 0;
    
    // Close the modal
    hideModal(addEquipmentModal);
    
    // Show success notification
    showNotification(`${equipmentName} added successfully!`);
    
    // Update the performance chart (you might want to add this equipment to the chart too)
    // This would require modifying your chart initialization code
}

// Helper function to set priority in select element
function setPriority(selectElement, value) {
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === value) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}

// Function to show modal
function showModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        // Add animation class
        setTimeout(() => {
            modal.querySelector('.modal-content').classList.add('show');
        }, 10);
    }
}

// Function to hide modal
function hideModal(modal) {
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.remove('show');
        // Wait for animation to complete
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Calendar navigation function
function navigateCalendar(direction) {
    const monthDisplay = document.querySelector('.calendar-header h3');
    const currentMonth = monthDisplay.textContent;
    
    // Parse month and year
    const [monthName, year] = currentMonth.split(' ');
    
    // Convert month name to number (0-11)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    let monthIndex = months.findIndex(m => m.startsWith(monthName));
    
    // Calculate new month and year
    if (direction === 'next') {
        monthIndex = (monthIndex + 1) % 12;
        if (monthIndex === 0) {
            // Increment year if moving from December to January
            monthDisplay.textContent = `${months[monthIndex]} ${parseInt(year) + 1}`;
        } else {
            monthDisplay.textContent = `${months[monthIndex]} ${year}`;
        }
    } else {
        monthIndex = (monthIndex - 1 + 12) % 12;
        if (monthIndex === 11) {
            // Decrement year if moving from January to December
            monthDisplay.textContent = `${months[monthIndex]} ${parseInt(year) - 1}`;
        } else {
            monthDisplay.textContent = `${months[monthIndex]} ${year}`;
        }
    }
    
    // Update calendar days (this would need to be implemented to show correct days for the month)
    updateCalendarDays(monthIndex, parseInt(year));
}

// Function to update calendar days based on month and year
function updateCalendarDays(month, year) {
    const daysContainer = document.querySelector('.calendar-days');
    // Clear current days
    daysContainer.innerHTML = '';
    
    // Get first day of month and number of days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get days from previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('prev-month');
        dayElement.textContent = daysInPrevMonth - i;
        daysContainer.appendChild(dayElement);
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        
        // Check if this is today
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('current-day');
        }
        
        // Add event markers (this is simplified - in a real app you'd check against actual events)
        if ((month === 3 && (i === 9 || i === 18 || i === 26)) || (month === 3 && i === 13)) {
            dayElement.classList.add('has-event');
            if (i === 13) dayElement.classList.add('critical');
            
            // Add tooltips
            if (i === 9) {
                dayElement.setAttribute('data-tooltip', 'Pump Inspection - Station A-42');
            } else if (i === 13) {
                dayElement.setAttribute('data-tooltip', 'Emergency Maintenance - Well Head C-09');
            } else if (i === 18) {
                dayElement.setAttribute('data-tooltip', 'Preventive Maintenance - Compressor B-17');
            } else if (i === 26) {
                dayElement.setAttribute('data-tooltip', 'Quarterly Inspection - Storage Tank D-23');
            }
        }
        
        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);
    }
    
    // Add days from next month
    const totalCells = 42; // 6 rows of 7 days
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('next-month');
        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);
    }
    
    // Re-initialize tooltips
    initTooltips();
}

// Initialize tooltips for calendar events
function initTooltips() {
    const eventDays = document.querySelectorAll('.has-event');
    eventDays.forEach(day => {
        day.addEventListener('mouseenter', function(e) {
            const tooltip = this.getAttribute('data-tooltip');
            if (tooltip) {
                const tooltipElement = document.createElement('div');
                tooltipElement.classList.add('tooltip');
                tooltipElement.textContent = tooltip;
                
                // Position the tooltip
                tooltipElement.style.left = `${e.pageX}px`;
                tooltipElement.style.top = `${e.pageY - 40}px`;
                
                document.body.appendChild(tooltipElement);
            }
        });
        
        day.addEventListener('mouseleave', function() {
            const tooltips = document.querySelectorAll('.tooltip');
            tooltips.forEach(tooltip => tooltip.remove());
        });
    });
}

// Highlight the current day in the calendar
function highlightCurrentDay() {
    const today = new Date();
    const currentDay = today.getDate();
    
    const days = document.querySelectorAll('.calendar-days div:not(.prev-month):not(.next-month)');
    days.forEach(day => {
        if (parseInt(day.textContent) === currentDay) {
            day.classList.add('current-day');
        }
    });
}

// Search functionality for equipment
function searchEquipment(searchTerm) {
    const equipmentCards = document.querySelectorAll('.equipment-card');
    
    equipmentCards.forEach(card => {
        const equipmentName = card.querySelector('h3').textContent.toLowerCase();
        
        if (equipmentName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to simulate real-time data updates
// This would typically fetch data from an API in a real application
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update random parameter values to simulate changing sensor data
        document.querySelectorAll('.equipment-details .parameter').forEach(param => {
            const progressBar = param.querySelector('.progress');
            if (progressBar) {
                let currentWidth = parseInt(progressBar.style.width);
                // Random fluctuation between -5% and +5%
                const fluctuation = (Math.random() * 10) - 5;
                let newWidth = Math.max(5, Math.min(95, currentWidth + fluctuation));
                
                progressBar.style.width = `${newWidth}%`;
                
                // Update colors based on value
                progressBar.classList.remove('warning', 'danger');
                if (newWidth > 75) {
                    progressBar.classList.add('danger');
                } else if (newWidth > 60) {
                    progressBar.classList.add('warning');
                }
            }
        });
    }, 5000); // Update every 5 seconds
}

// Call this function to start simulated updates
// Uncomment the line below to enable real-time simulated updates
// simulateRealTimeUpdates();

// Add random notification functionality
function setupNotifications() {
    const notificationBell = document.querySelector('.notifications');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // Create a notification dropdown
            let dropdown = document.querySelector('.notification-dropdown');
            
            if (dropdown) {
                // Remove if already exists (toggle behavior)
                dropdown.remove();
            } else {
                // Create new dropdown
                dropdown = document.createElement('div');
                dropdown.classList.add('notification-dropdown');
                
                const notifications = [
                    'New maintenance task assigned to you',
                    'Well Head C-09 vibration levels critical',
                    'Scheduled maintenance due in 3 days',
                    'System update available'
                ];
                
                // Build notification items
                notifications.forEach(text => {
                    const item = document.createElement('div');
                    item.classList.add('notification-item');
                    item.innerHTML = `
                        <i class="fas fa-info-circle"></i>
                        <p>${text}</p>
                    `;
                    dropdown.appendChild(item);
                });
                
                // Position and show the dropdown
                const rect = notificationBell.getBoundingClientRect();
                dropdown.style.top = `${rect.bottom}px`;
                dropdown.style.right = `${window.innerWidth - rect.right}px`;
                
                document.body.appendChild(dropdown);
                
                // Click outside to close
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && e.target !== notificationBell) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }
        });
    }
}

// Initialize notifications
setupNotifications();

/**
 * Function to generate and download a PDF
 */
function downloadWorkOrderPdf() {
    // Check if jsPDF is available
    if (typeof jsPDF === 'undefined') {
        showNotification('PDF library not available', 'error');
        return;
    }

    try {
        // Create a new PDF document
        const doc = new jsPDF();
        
        // Set title and basic info
        doc.setFontSize(18);
        doc.text('Work Order', 105, 20, { align: 'center' });

        // Get the modal or fail gracefully
        const modal = document.getElementById('workOrderModal');
        if (!modal) {
            throw new Error('Work Order modal not found');
        }

        // Extract data with fallback values
        const workOrderNumber = getModalText(modal, '.work-order-title p', 'WO-UNKNOWN').split('|')[0].trim();
        const equipment = getModalText(modal, '[label="Equipment:"] + p', 'Not specified');
        const location = getModalText(modal, '[label="Location:"] + p', 'Not specified');
        const type = getModalText(modal, '[label="Type:"] + p', 'Not specified');
        const date = getModalText(modal, '[label="Scheduled Date:"] + p', new Date().toLocaleDateString());
        const assignedTo = getModalText(modal, '[label="Assigned To:"] + p', 'Not assigned');
        const duration = getModalText(modal, '[label="Estimated Duration:"] + p', 'Not estimated');
        const description = getModalText(modal, '[label="Description:"] + p', 'No description provided');
        
        // Get required parts
        const partsItems = modal.querySelectorAll('[label="Required Parts:"] li');
        const parts = partsItems.length > 0 
            ? Array.from(partsItems).map(li => li.textContent.trim()) 
            : ['No parts specified'];

        // Get safety precautions
        const safety = getModalText(modal, '[label="Safety Precautions:"] + p', 'Standard safety precautions apply');

        // Add content to PDF in two columns
        const leftCol = 20;
        const rightCol = 110;
        let yPosition = 40;

        // Left column content
        doc.setFontSize(12);
        doc.text('Work Order #:', leftCol, yPosition);
        doc.text(workOrderNumber, leftCol + 40, yPosition);
        yPosition += 10;

        doc.text('Equipment:', leftCol, yPosition);
        doc.text(equipment, leftCol + 40, yPosition);
        yPosition += 10;

        doc.text('Type:', leftCol, yPosition);
        doc.text(type, leftCol + 40, yPosition);
        yPosition += 10;

        doc.text('Assigned To:', leftCol, yPosition);
        doc.text(assignedTo, leftCol + 40, yPosition);
        yPosition += 10;

        // Right column content
        yPosition = 40;
        doc.text('Location:', rightCol, yPosition);
        doc.text(location, rightCol + 30, yPosition);
        yPosition += 10;

        doc.text('Scheduled Date:', rightCol, yPosition);
        doc.text(date, rightCol + 30, yPosition);
        yPosition += 10;

        doc.text('Duration:', rightCol, yPosition);
        doc.text(duration, rightCol + 30, yPosition);
        yPosition += 10;

        // Description (full width)
        yPosition += 10;
        doc.text('Description:', leftCol, yPosition);
        yPosition += 10;
        const splitDesc = doc.splitTextToSize(description, 180);
        doc.text(splitDesc, leftCol, yPosition);
        yPosition += splitDesc.length * 7;

        // Required parts
        yPosition += 10;
        doc.text('Required Parts:', leftCol, yPosition);
        yPosition += 10;
        parts.forEach(part => {
            doc.text('• ' + part, leftCol + 5, yPosition);
            yPosition += 10;
        });

        // Safety precautions
        yPosition += 10;
        doc.text('Safety Precautions:', leftCol, yPosition);
        yPosition += 10;
        const splitSafety = doc.splitTextToSize(safety, 180);
        doc.text(splitSafety, leftCol + 5, yPosition);
        yPosition += splitSafety.length * 7;

        // Signature fields
        yPosition += 20;
        doc.text('Technician Signature:', leftCol, yPosition);
        doc.line(leftCol, yPosition + 5, leftCol + 80, yPosition + 5);
        
        doc.text('Supervisor Approval:', rightCol, yPosition);
        doc.line(rightCol, yPosition + 5, rightCol + 80, yPosition + 5);

        // Generation timestamp
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, leftCol, 280);

        // Save the PDF
        doc.save(`${workOrderNumber.replace(/\s+/g, '_')}.pdf`);
        showNotification('Work Order PDF downloaded successfully!');

    } catch (error) {
        console.error('PDF Generation Error:', error);
        showNotification(`Error generating PDF: ${error.message}`, 'error');
    }
}

// Helper function to safely get text from modal
function getModalText(modal, selector, defaultValue = '') {
    const element = modal.querySelector(selector);
    return element ? element.textContent.trim() : defaultValue;
}

// Helper function for notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `download-notification ${type === 'error' ? 'error' : ''}`;
    notification.innerHTML = `
        <p>${message}</p>
        <span class="close-btn" onclick="this.parentElement.remove()">&times;</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), type === 'error' ? 5000 : 3000);
}
