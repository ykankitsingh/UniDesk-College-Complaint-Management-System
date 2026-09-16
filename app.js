let currentUser = null;
let complaints = [];

// Initialize & load data on startup
document.addEventListener("DOMContentLoaded", async () => {
  const storedComplaints = localStorage.getItem("bbdu_complaints");

  if (storedComplaints) {
    complaints = JSON.parse(storedComplaints);
  } else {
    try {
      const response = await fetch("data.json");
      const data = await response.json();
      complaints = data.complaints;
      saveToStorage();
    } catch (e) {
      console.error("Could not load data.json fallback", e);
      complaints = [];
    }
  }

  // Check existing session
  const activeUser = localStorage.getItem("bbdu_activeUser");
  if (activeUser) {
    currentUser = JSON.parse(activeUser);
    renderApp();
  }
});

function saveToStorage() {
  localStorage.setItem("bbdu_complaints", JSON.stringify(complaints));
}

// Handle Login Submission
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();

  if (email === "admin@bbdu.ac.in") {
    currentUser = { name: "University Admin Officer", email, role: "admin" };
  } else {
    currentUser = { 
      name: "Rohan Gupta", 
      email: email, 
      role: "student",
      rollNo: "1200952022" 
    };
  }

  localStorage.setItem("bbdu_activeUser", JSON.stringify(currentUser));
  renderApp();
});

// Logout handler
function logout() {
  localStorage.removeItem("bbdu_activeUser");
  currentUser = null;
  document.getElementById("navbar").style.display = "none";
  document.getElementById("login-section").style.display = "block";
  document.getElementById("student-section").style.display = "none";
  document.getElementById("admin-section").style.display = "none";
}

// Route UI based on User Role
function renderApp() {
  document.getElementById("login-section").style.display = "none";
  document.getElementById("navbar").style.display = "block";
  document.getElementById("user-display-name").innerText = `${currentUser.name} (${currentUser.role.toUpperCase()})`;

  if (currentUser.role === "student") {
    document.getElementById("student-section").style.display = "block";
    document.getElementById("admin-section").style.display = "none";
    renderStudentTable();
  } else {
    document.getElementById("admin-section").style.display = "block";
    document.getElementById("student-section").style.display = "none";
    updateMetrics();
    renderAdminTable();
  }
}

// Render Student View Table
function renderStudentTable() {
  const tbody = document.getElementById("student-table-body");
  tbody.innerHTML = "";

  // Match by logged-in student email or show sample complaints
  const myComplaints = complaints.filter(c => c.email === currentUser.email);

  if (myComplaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #64748b;">No complaints filed yet. Click 'Register New Complaint' to start.</td></tr>`;
    return;
  }

  myComplaints.forEach(c => {
    const row = `
      <tr>
        <td><strong>#${c.id}</strong></td>
        <td>
          <strong>${escapeHtml(c.title)}</strong>
          <span class="sub-text">${escapeHtml(c.description)}</span>
        </td>
        <td>${c.category}</td>
        <td>${c.date}</td>
        <td><span class="badge badge-${c.status.replace(/\s+/g, '-')}">${c.status}</span></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Calculate Summary Statistics for Admin
function updateMetrics() {
  document.getElementById("count-total").innerText = complaints.length;
  document.getElementById("count-pending").innerText = complaints.filter(c => c.status === "Pending").length;
  document.getElementById("count-progress").innerText = complaints.filter(c => c.status === "In Progress").length;
  document.getElementById("count-resolved").innerText = complaints.filter(c => c.status === "Resolved").length;
}

// Render Admin View Table (With Search and Status Filtering)
function renderAdminTable() {
  const tbody = document.getElementById("admin-table-body");
  tbody.innerHTML = "";

  const filterValue = document.getElementById("admin-filter").value;
  const searchValue = document.getElementById("admin-search").value.toLowerCase();

  let filtered = complaints;

  // Filter Status
  if (filterValue !== "All") {
    filtered = filtered.filter(c => c.status === filterValue);
  }

  // Filter Search String
  if (searchValue) {
    filtered = filtered.filter(c => 
      c.student.toLowerCase().includes(searchValue) ||
      c.rollNo.toLowerCase().includes(searchValue) ||
      c.title.toLowerCase().includes(searchValue) ||
      c.id.toString().includes(searchValue)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#64748b;">No matching complaints found.</td></tr>`;
    return;
  }

  filtered.forEach(c => {
    const row = `
      <tr>
        <td><strong>#${c.id}</strong></td>
        <td>
          <strong>${escapeHtml(c.student)}</strong>
          <span class="sub-text">Roll: ${c.rollNo}</span>
          <span class="sub-text">${c.email}</span>
        </td>
        <td>${c.department}</td>
        <td>
          <strong>${escapeHtml(c.title)}</strong>
          <span class="sub-text">${escapeHtml(c.description)}</span>
        </td>
        <td>${c.date}</td>
        <td><span class="badge badge-${c.status.replace(/\s+/g, '-')}">${c.status}</span></td>
        <td>
          <select class="input-field" style="margin-bottom:0; padding:6px;" onchange="updateStatus(${c.id}, this.value)">
            <option value="Pending" ${c.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${c.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Resolved" ${c.status === "Resolved" ? "selected" : ""}>Resolved</option>
            <option value="Rejected" ${c.status === "Rejected" ? "selected" : ""}>Rejected</option>
          </select>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Admin Status Update Function
function updateStatus(id, newStatus) {
  const complaint = complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = newStatus;
    saveToStorage();
    updateMetrics();
    renderAdminTable();
  }
}

// Modal Visibility Toggle
function toggleComplaintForm(show) {
  document.getElementById("complaint-modal").style.display = show ? "flex" : "none";
}

// Handle New Complaint Submission
document.getElementById("complaint-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const newComplaint = {
    id: Math.floor(1000 + Math.random() * 9000),
    student: currentUser.name,
    rollNo: document.getElementById("comp-roll").value,
    email: currentUser.email,
    department: document.getElementById("comp-dept").value,
    title: document.getElementById("comp-title").value,
    category: document.getElementById("comp-category").value,
    description: document.getElementById("comp-desc").value,
    status: "Pending",
    date: new Date().toISOString().split("T")[0]
  };

  complaints.unshift(newComplaint);
  saveToStorage();

  document.getElementById("complaint-form").reset();
  toggleComplaintForm(false);
  renderStudentTable();
});

// Helper for XSS safety
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}