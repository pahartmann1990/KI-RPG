const ADMIN_CODE = '291290';
let currentUserCode = null;
let isAdmin = false;
let hourHeight = 30; // Standard px pro Stunde

// Definierte Tage für den Kalender
const calendarDays = [
    '2025-08-02', '2025-08-03', '2025-08-04', '2025-08-05',
    '2025-08-06', '2025-08-07', '2025-08-08', '2025-08-09', '2025-08-10'
];

// Daten in localStorage speichern
let users = JSON.parse(localStorage.getItem('users')) || [];
let fixedActivities = JSON.parse(localStorage.getItem('fixedActivities')) || [];
let proposals = JSON.parse(localStorage.getItem('proposals')) || [];

function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('fixedActivities', JSON.stringify(fixedActivities));
    localStorage.setItem('proposals', JSON.stringify(proposals));
}

function verifyCode() {
    const code = document.getElementById('code-input').value.trim();
    if (code === ADMIN_CODE) {
        isAdmin = true;
        currentUserCode = code;
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('user-panel').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';
        loadAdminPanel();
    } else if (code.length === 4 && users.some(user => user.code === code)) {
        isAdmin = false;
        currentUserCode = code;
        document.getElementById('user-panel').style.display = 'block';
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';
    } else {
        alert('Ungültiger Code! Stelle sicher, dass der Code existiert und 4-stellig ist. Überprüfe im Browser-Console: console.log(localStorage.getItem("users"));');
    }
    updateCalendar();
    updateActivitiesList();
}

function logout() {
    isAdmin = false;
    currentUserCode = null;
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('user-panel').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    updateCalendar();
    updateActivitiesList();
}

function addUser() {
    const name = document.getElementById('new-user-name').value.trim();
    if (name) {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        users.push({ name, code });
        saveData();
        loadUserList();
    }
}

function loadUserList() {
    const list = document.getElementById('user-list');
    list.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `${user.name} - Code: ${user.code}`;
        
        const renameBtn = document.createElement('button');
        renameBtn.textContent = 'Umbenennen';
        renameBtn.onclick = () => {
            const newName = prompt('Neuen Namen eingeben:', user.name);
            if (newName) {
                user.name = newName;
                saveData();
                loadUserList();
            }
        };
        li.appendChild(renameBtn);
        
        const editCodeBtn = document.createElement('button');
        editCodeBtn.textContent = 'Code ändern';
        editCodeBtn.onclick = () => {
            const newCode = prompt('Neuen 4-stelligen Code eingeben:', user.code);
            if (newCode && newCode.length === 4) {
                user.code = newCode;
                saveData();
                loadUserList();
            }
        };
        li.appendChild(editCodeBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.onclick = () => {
            if (confirm(`Jugendlichen ${user.name} wirklich löschen?`)) {
                users.splice(index, 1);
                saveData();
                loadUserList();
            }
        };
        li.appendChild(deleteBtn);
        
        list.appendChild(li);
    });
}

function loadAdminPanel() {
    loadUserList();
    loadAdminProposals();
    loadEditActivities();
}

function loadAdminProposals() {
    const container = document.getElementById('admin-proposals');
    container.innerHTML = '';
    proposals.forEach(proposal => {
        const div = document.createElement('div');
        div.className = 'proposal';
        div.textContent = `${proposal.day} ${proposal.time}: ${proposal.name} (Ja: ${proposal.votesYes}, Nein: ${proposal.votesNo})`;
        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Annehmen';
        acceptBtn.onclick = () => {
            const duration = parseInt(prompt('Dauer in Minuten eingeben (z.B. 120 für Anfahrt etc.):')) || 60;
            const id = Date.now();
            fixedActivities.push({ id, day: proposal.day, time: proposal.time, duration, name: proposal.name });
            proposals = proposals.filter(p => p.id !== proposal.id);
            saveData();
            updateCalendar();
            updateActivitiesList();
            loadAdminProposals();
            loadEditActivities();
        };
        const rejectBtn = document.createElement('button');
        rejectBtn.textContent = 'Ablehnen';
        rejectBtn.onclick = () => {
            proposals = proposals.filter(p => p.id !== proposal.id);
            saveData();
            loadAdminProposals();
        };
        div.appendChild(acceptBtn);
        div.appendChild(rejectBtn);
        container.appendChild(div);
    });
}

function loadEditActivities() {
    const container = document.getElementById('edit-activities');
    container.innerHTML = '';
    fixedActivities.forEach(activity => {
        const div = document.createElement('div');
        div.textContent = `${activity.day} ${activity.time} (${activity.duration} Min.): ${activity.name}`;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Bearbeiten';
        editBtn.onclick = () => {
            const newTime = prompt('Neue Uhrzeit (z.B. 14:00):', activity.time);
            const newDuration = prompt('Neue Dauer in Minuten:', activity.duration);
            const newName = prompt('Neuer Name:', activity.name);
            if (newTime) activity.time = newTime;
            if (newDuration) activity.duration = parseInt(newDuration) || activity.duration;
            if (newName) activity.name = newName;
            saveData();
            updateCalendar();
            updateActivitiesList();
            loadEditActivities();
        };
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.onclick = () => {
            if (confirm('Aktivität löschen?')) {
                fixedActivities = fixedActivities.filter(a => a.id !== activity.id);
                saveData();
                updateCalendar();
                updateActivitiesList();
                loadEditActivities();
            }
        };
        div.appendChild(editBtn);
        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

function submitProposal() {
    const day = document.getElementById('proposal-day').value;
    const time = document.getElementById('proposal-time').value.trim();
    const name = document.getElementById('proposal-name').value.trim();
    if (day && time && name) {
        const id = Date.now();
        proposals.push({ id, day, time, name, votesYes: 0, votesNo: 0, votedUsers: [] });
        saveData();
        updateCalendar();
        updateActivitiesList();
    } else {
        alert('Bitte alle Felder ausfüllen!');
    }
}

function addFixedActivity() {
    const day = document.getElementById('activity-day').value;
    const time = document.getElementById('activity-time').value.trim();
    const duration = parseInt(document.getElementById('activity-duration').value.trim()) || 60;
    const name = document.getElementById('activity-name').value.trim();
    if (day && time && name) {
        const id = Date.now();
        fixedActivities.push({ id, day, time, duration, name });
        saveData();
        updateCalendar();
        updateActivitiesList();
        loadEditActivities();
    } else {
        alert('Bitte alle Felder ausfüllen!');
    }
}

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function updateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Header mit Tagen
    const header = document.createElement('div');
    header.className = 'calendar-header';
    calendarDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = new Date(day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric' });
        header.appendChild(dayHeader);
    });
    calendar.appendChild(header);

    // Grid mit Spalten
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    calendarDays.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column dropzone';
        dayColumn.dataset.day = day;
        dayColumn.style.minHeight = `${24 * hourHeight}px`;

        // Stundenlinien
        const hourLines = document.createElement('div');
        hourLines.className = 'hour-lines';
        for (let hour = 0; hour < 24; hour++) {
            const hourLine = document.createElement('div');
            hourLine.className = 'hour-line';
            hourLine.style.height = `${hourHeight}px`;
            const label = document.createElement('span');
            label.className = 'hour-label';
            label.textContent = `${hour}:00`;
            hourLine.appendChild(label);
            hourLines.appendChild(hourLine);
        }
        dayColumn.appendChild(hourLines);

        dayColumn.addEventListener('dragover', dragOver);
        dayColumn.addEventListener('drop', drop);

        // Feste Aktivitäten
        fixedActivities.filter(a => a.day === day).forEach(activity => {
            const div = createActivityElement(activity, 'fixed-activity');
            const startMin = parseTime(activity.time);
            div.style.top = `${(startMin / 60) * hourHeight}px`;
            div.style.height = `${(activity.duration / 60) * hourHeight}px`;
            dayColumn.appendChild(div);
        });

        // Vorschläge (Annahme: 60 Min Dauer für Anzeige, um sichtbar zu sein)
        proposals.filter(p => p.day === day).forEach(proposal => {
            const div = createProposalElement(proposal);
            const startMin = parseTime(proposal.time);
            div.style.top = `${(startMin / 60) * hourHeight}px`;
            div.style.height = `${hourHeight}px`; // 1 Stunde für Vorschläge
            dayColumn.appendChild(div);
        });

        grid.appendChild(dayColumn);
    });
    calendar.appendChild(grid);
}

function updateActivitiesList() {
    const list = document.getElementById('activities-list');
    list.innerHTML = '';

    fixedActivities.forEach(activity => {
        const div = createActivityElement(activity, 'fixed-activity draggable');
        list.appendChild(div);
    });

    proposals.forEach(proposal => {
        const div = createProposalElement(proposal, true);
        list.appendChild(div);
    });
}

function createActivityElement(activity, className) {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = `${activity.time} (${activity.duration} Min.): ${activity.name}`;
    div.dataset.id = activity.id;
    div.dataset.type = 'fixed';
    if (isAdmin) {
        div.draggable = true;
        div.addEventListener('dragstart', dragStart);
    }
    return div;
}

function createProposalElement(proposal, draggable = false) {
    const div = document.createElement('div');
    div.className = 'proposal' + (draggable && isAdmin ? ' draggable' : '');
    div.textContent = `${proposal.time}: ${proposal.name} (Ja: ${proposal.votesYes}, Nein: ${proposal.votesNo})`;
    div.dataset.id = proposal.id;
    div.dataset.type = 'proposal';
    if (draggable && isAdmin) {
        div.draggable = true;
        div.addEventListener('dragstart', dragStart);
    }
    div.onclick = () => {
        if (!currentUserCode) {
            alert('Bitte erst verifizieren!');
            return;
        }
        if (proposal.votedUsers.includes(currentUserCode)) {
            alert('Du hast bereits abgestimmt!');
            return;
        }
        const vote = confirm('Ja abstimmen? (OK = Ja, Abbrechen = Nein)');
        if (vote) {
            proposal.votesYes++;
        } else {
            proposal.votesNo++;
        }
        proposal.votedUsers.push(currentUserCode);
        saveData();
        updateCalendar();
        updateActivitiesList();
    };
    return div;
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', JSON.stringify({
        id: e.target.dataset.id,
        type: e.target.dataset.type
    }));
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const dayColumn = e.target.closest('.dropzone');
    const day = dayColumn.dataset.day;
    if (!day || !isAdmin) return;

    const rect = dayColumn.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const dropMin = Math.floor(y / hourHeight * 60);
    const dropHour = Math.floor(dropMin / 60);
    const dropMinute = dropMin % 60;
    const newTime = `${String(dropHour).padStart(2, '0')}:${String(dropMinute).padStart(2, '0')}`;

    let item;
    if (data.type === 'fixed') {
        item = fixedActivities.find(a => a.id == data.id);
        if (item) {
            item.day = day;
            item.time = newTime;
        }
    } else if (data.type === 'proposal') {
        item = proposals.find(p => p.id == data.id);
        if (item) {
            item.day = day;
            item.time = newTime;
        }
    }
    saveData();
    updateCalendar();
    updateActivitiesList();
}

// Slider für Skalierung
document.getElementById('scale-slider').addEventListener('input', (e) => {
    hourHeight = parseInt(e.target.value);
    updateCalendar();
});

// Initiale Ladung
updateCalendar();
updateActivitiesList();