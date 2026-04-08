// ==== STATE ====
let students = [];
let currentFilter = 'All Classes';
let editingIndex = null;

// ==== LOCALSTORAGE ====
function loadStudentsFromLocalStorage() {
  const stored = localStorage.getItem('students');
  return stored ? JSON.parse(stored) : [];
}

function saveStudentsToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
}

// ==== INITIALIZE ON PAGE LOAD ====
window.addEventListener('load', function() {
  students = loadStudentsFromLocalStorage();
  buildFilterDropdown();
  renderTable();
  updateStats();
});

// ==== MODAL ====
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  clearForm();
  setEditMode(false);
}

function setEditMode(isEdit) {
  const title = document.getElementById('modalTitle');
  const btn = document.getElementById('saveBtn');
  if (isEdit) {
    title.textContent = 'Edit Student';
    btn.textContent = 'Update Student';
  } else {
    title.textContent = 'Add New Student';
    btn.textContent = 'Add Student';
    editingIndex = null;
  }
}

function clearForm() {
  document.getElementById('fName').value = '';
  document.getElementById('fRoll').value = '';
  document.getElementById('fEmail').value = '';
  document.getElementById('fPermanentAddr').value = '';
  document.getElementById('fTemporaryAddr').value = '';
  document.getElementById('fMarks').value = '';
  document.getElementById('fSubjects').value = '';
  document.getElementById('fProjects').value = '';
  document.getElementById('fFutureGoals').value = '';
  document.getElementById('fAttend').value = '';
  document.getElementById('fHealthCondition').value = '';
  document.getElementById('fHobbies').value = '';
  document.getElementById('fParentName').value = '';
  document.getElementById('fContactNumber').value = '';
  document.getElementById('fClass').value = 'Nursery';
  document.getElementById('fGrades').value = 'A+';
  document.getElementById('fFeesStatus').value = 'Unpaid';
  document.getElementById('fBloodGroup').value = 'O+';
  document.getElementById('fScholar').checked = false;
}

// ==== ADD / UPDATE STUDENT ====
function addStudent() {
  const name = document.getElementById('fName').value.trim();
  const roll = document.getElementById('fRoll').value.trim();
  
  if (!name || !roll) {
    alert('Full Name and Roll No are required!');
    return;
  }

  const cls = document.getElementById('fClass').value;
  const email = document.getElementById('fEmail').value.trim();
  const permAddr = document.getElementById('fPermanentAddr').value.trim();
  const tempAddr = document.getElementById('fTemporaryAddr').value.trim();
  const marks = parseFloat(document.getElementById('fMarks').value) || 0;
  const grades = document.getElementById('fGrades').value;
  const subjects = document.getElementById('fSubjects').value.trim();
  const projects = document.getElementById('fProjects').value.trim();
  const futureGoals = document.getElementById('fFutureGoals').value.trim();
  const attend = parseFloat(document.getElementById('fAttend').value) || 0;
  const feesStatus = document.getElementById('fFeesStatus').value;
  const scholar = document.getElementById('fScholar').checked ? 'Yes' : 'No';
  const bloodGroup = document.getElementById('fBloodGroup').value;
  const healthCond = document.getElementById('fHealthCondition').value.trim();
  const hobbies = document.getElementById('fHobbies').value.trim();
  const parentName = document.getElementById('fParentName').value.trim();
  const contactNum = document.getElementById('fContactNumber').value.trim();

  const data = {
    name, roll, cls, email, permAddr, tempAddr, marks, grades, subjects,
    projects, futureGoals, attend, feesStatus, scholar, bloodGroup,
    healthCond, hobbies, parentName, contactNum
  };

  if (editingIndex !== null) {
    students[editingIndex] = data;
    showToast('✅ Student updated successfully!');
  } else {
    students.push(data);
    showToast('✅ Student added successfully!');
  }

  saveStudentsToLocalStorage();
  closeModal();
  renderTable();
  updateStats();
}

// ==== EDIT STUDENT ====
function editStudent(index) {
  if (index < 0 || index >= students.length) return;
  const s = students[index];
  editingIndex = index;
  setEditMode(true);

  document.getElementById('fName').value = s.name || '';
  document.getElementById('fRoll').value = s.roll || '';
  document.getElementById('fEmail').value = s.email || '';
  document.getElementById('fPermanentAddr').value = s.permAddr || '';
  document.getElementById('fTemporaryAddr').value = s.tempAddr || '';
  document.getElementById('fMarks').value = s.marks || '';
  document.getElementById('fSubjects').value = s.subjects || '';
  document.getElementById('fProjects').value = s.projects || '';
  document.getElementById('fFutureGoals').value = s.futureGoals || '';
  document.getElementById('fAttend').value = s.attend || '';
  document.getElementById('fHealthCondition').value = s.healthCond || '';
  document.getElementById('fHobbies').value = s.hobbies || '';
  document.getElementById('fParentName').value = s.parentName || '';
  document.getElementById('fContactNumber').value = s.contactNum || '';
  document.getElementById('fClass').value = s.cls || 'Nursery';
  document.getElementById('fGrades').value = s.grades || 'A+';
  document.getElementById('fFeesStatus').value = s.feesStatus || 'Unpaid';
  document.getElementById('fBloodGroup').value = s.bloodGroup || 'O+';
  document.getElementById('fScholar').checked = s.scholar === 'Yes';

  openModal();
}

// ==== RENDER TABLE ====
function renderTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q);
    const matchFilter = currentFilter === 'All Classes' || s.cls === currentFilter;
    return matchSearch && matchFilter;
  });

  const tbody = document.getElementById('studentBody');
  tbody.innerHTML = filtered.map((s) => {
    const idx = students.findIndex(st => st.roll === s.roll && st.name === s.name);
    return `
      <tr>
        <td>${s.roll}</td>
        <td><b>${s.name}</b></td>
        <td>${s.cls}</td>
        <td>${s.marks}%</td>
        <td>${s.attend}%</td>
        <td><span class="badge ${s.scholar === 'Yes' ? 'badge-green' : 'badge-red'}">${s.scholar}</span></td>
        <td>${s.feesStatus}</td>
        <td>
          <button class="btn-edit" onclick="editStudent(${idx})" title="Edit">
            ✏️
          </button>
          <button class="btn-delete" onclick="deleteStudent(${idx})" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </td>
      </tr>
    `
  
    ;
  }).join('');

  const empty = document.getElementById('emptyState');
  const table = document.getElementById('studentTable');
  if (filtered.length === 0) {
    empty.style.display = 'flex';
    table.style.display = 'none';
  } else {
    empty.style.display = 'none';
    table.style.display = 'table';
  }
}

// ==== DELETE STUDENT ====
function deleteStudent(index) {
  if (index < 0 || index >= students.length) return;
  
  const student = students[index];
  if (confirm(`Are you sure you want to delete ${student.name}?`)) {
    students.splice(index, 1);
    saveStudentsToLocalStorage();
    renderTable();
    updateStats();
    showDeleteToast();
  }
}

// ==== UPDATE STATS ====
function updateStats() {
  const n = students.length;
  document.getElementById('totalStudents').textContent = n;
  document.getElementById('avgMarks').textContent = n ? Math.round(students.reduce((a, s) => a + s.marks, 0) / n) : 0;
  document.getElementById('scholarships').textContent = students.filter(s => s.scholar === 'Yes').length;
  document.getElementById('avgAttendance').textContent = (n ? Math.round(students.reduce((a, s) => a + s.attend, 0) / n) : 0) + '%';
  document.getElementById('feesPaid').textContent = n;
}

// ==== SEARCH ====
function filterStudents() {
  renderTable();
}

// ==== TOASTS ====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg || ' Student added successfully!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function showDeleteToast() {
  const toast = document.getElementById('toast');
  toast.textContent = ' Student deleted successfully!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==== EXPORT CSV ====
function exportCSV() {
  if (students.length === 0) {
    alert('No data to export!');
    return;
  }
  const rows = [['Roll No', 'Name', 'Email', 'Class', 'Marks', 'Grade', 'Attendance', 'Fees Status', 'Scholarship', 'Parent Name', 'Contact Number']];
  students.forEach(s => rows.push([
    s.roll, s.name, s.email, s.cls, s.marks, s.grades, s.attend, s.feesStatus, s.scholar, s.parentName, s.contactNum
  ]));
  const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv,' + encodeURIComponent(csv);
  a.download = 'students.csv';
  a.click();
}

// ==== FILTER DROPDOWN ====
const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

function buildFilterDropdown() {
  const dropdown = document.getElementById('filterDropdown');
  if (!dropdown) return;
  
  dropdown.innerHTML = '';
  
  const allDiv = document.createElement('div');
  allDiv.className = 'filter-item selected';
  allDiv.innerHTML = `
    <span class="item-check">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
    All Classes
  `;
  allDiv.onclick = () => selectFilter('All Classes', allDiv);
  dropdown.appendChild(allDiv);
  
  CLASSES.forEach(cls => {
    const div = document.createElement('div');
    div.className = 'filter-item';
    div.innerHTML = `
      <span class="item-check">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      ${cls}
    `;
    div.onclick = () => selectFilter(cls, div);
    dropdown.appendChild(div);
  });
}

function selectFilter(value, el) {
  const dropdown = document.getElementById('filterDropdown');
  dropdown.querySelectorAll('.filter-item').forEach(item => item.classList.remove('selected'));
  el.classList.add('selected');
  
  currentFilter = value;
  document.getElementById('triggerLabel').textContent = value;
  
  renderTable();
  closeFilterDropdown();
}

// ==== FILTER DROPDOWN TOGGLE ====
function openFilterDropdown() {
  const trigger = document.getElementById('filterTrigger');
  const dropdown = document.getElementById('filterDropdown');
  trigger.classList.add('open');
  dropdown.classList.add('open');
}

function closeFilterDropdown() {
  const trigger = document.getElementById('filterTrigger');
  const dropdown = document.getElementById('filterDropdown');
  trigger.classList.remove('open');
  dropdown.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
  const trigger = document.getElementById('filterTrigger');
  const wrapper = document.getElementById('filterWrapper');
  
  if (trigger) {
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = document.getElementById('filterDropdown');
      if (dropdown.classList.contains('open')) {
        closeFilterDropdown();
      } else {
        openFilterDropdown();
      }
    });
  }
  
  document.addEventListener('click', function(e) {
    if (!wrapper.contains(e.target)) {
      closeFilterDropdown();
    }
  });
});

// ==== LISTEN FOR STORAGE CHANGES ====
window.addEventListener('storage', function() {
  students = loadStudentsFromLocalStorage();
  renderTable();
  updateStats();
});
