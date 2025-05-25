const rooms = Array.from({ length: 9 }, (_, i) => (100 + i).toString());
const CLEANING_DURATION = 2 * 1000; // 2 seconds // 30 minutes in milliseconds

let roomData = JSON.parse(localStorage.getItem('roomData')) || {};

function init() {
  rooms.forEach((room) => {
    if (!roomData[room]) {
      roomData[room] = {
        status: 'Available',
        lastVacated: null,
        lastOccupied: null,
        neverUsed: true,
      };
    }
  });

  renderRooms();
  setInterval(updateStatuses, 1000); // Real-time update
}

function updateStatuses() {
  const now = Date.now();
  let updated = false;

  rooms.forEach((room) => {
    const data = roomData[room];

    if (data.status === 'Cleaning') {
      const vacatedTime = new Date(data.lastVacated).getTime();
      if (now - vacatedTime >= CLEANING_DURATION) {
        data.status = 'Available';
        updated = true;
      }
    }
  });

  if (updated) {
    saveData();
    renderRooms();
  }
}

function renderRooms() {
  const container = document.getElementById('room-container');
  container.innerHTML = '';

  rooms.forEach((room) => {
    const data = roomData[room];
    const roomDiv = document.createElement('div');
    roomDiv.classList.add('room');

    // Color-coded borders
    roomDiv.classList.add(
      data.status === 'Occupied' ? 'occupied' :
      data.status === 'Cleaning' ? 'cleaning' :
      'available'
    );

    const statusText = `<div class="status">Status: ${data.status}</div>`;
    let buttonHTML = '';

    if (data.status === 'Occupied') {
      buttonHTML = `<button onclick="vacateRoom('${room}')">Mark Vacated</button>`;
    } else if (data.status === 'Available') {
      buttonHTML = `<button onclick="assignGuest('${room}')">Assign Guest</button>`;
    }

    roomDiv.innerHTML = `
      <h2>Room ${room}</h2>
      ${statusText}
      ${buttonHTML}
    `;
    container.appendChild(roomDiv);
  });
}

function vacateRoom(room) {
  const now = new Date();
  roomData[room].status = 'Cleaning';
  roomData[room].lastVacated = now.toISOString();
  roomData[room].lastOccupied = now.toISOString();
  roomData[room].neverUsed = false;
  saveData();
  renderRooms();
}

function assignGuest(room) {
  roomData[room].status = 'Occupied';
  roomData[room].lastOccupied = new Date().toISOString();
  roomData[room].neverUsed = false;
  saveData();
  renderRooms();
}

function saveData() {
  localStorage.setItem('roomData', JSON.stringify(roomData));
}

init();
