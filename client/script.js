const form = document.getElementById('medicine-form');
const tableBody = document.querySelector('#medicine-table tbody');
const API = 'http://localhost:5000/api/medicines';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const medId = document.getElementById('medicineId').value;
  const data = {
    name: form.name.value,
    batchNo: form.batchNo.value,
    company: form.company.value,
    quantity: parseInt(form.quantity.value),
    price: parseFloat(form.price.value),
    expiryDate: form.expiryDate.value,
  };
  const expiryDate = new Date(data.expiryDate);
    const today = new Date();
    if (expiryDate < today) {
    alert("⚠️ Expiry date must be in the future!");
    return;
    }


  try {
    if (medId) {
      await fetch(`${API}/${medId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    form.reset();
    document.getElementById('medicineId').value = '';
    document.getElementById('submit-btn').textContent = 'Add Medicine';
    loadMedicines();
  } catch (err) {
    alert("Server error. Please check connection.");
  }
});

async function loadMedicines() {
  try {
    const res = await fetch(API);
    const meds = await res.json();
    tableBody.innerHTML = `<tr><td colspan="7">⚠️ Cannot connect to server</td></tr>`;
    meds.forEach((med) => {
      const tr = document.createElement('tr');
      const expiry = new Date(med.expiryDate);
      const today = new Date();
      const daysLeft = (expiry - today) / (1000 * 60 * 60 * 24);

      if (daysLeft < 30) tr.classList.add('expiring-soon');
      else if (med.quantity < 10) tr.classList.add('low-stock');

      tr.innerHTML = `
        <td>${med.name}</td>
        <td>${med.batchNo}</td>
        <td>${med.company}</td>
        <td>${med.quantity}</td>
        <td>₹${med.price}</td>
        <td>${new Date(med.expiryDate).toLocaleDateString()}</td>
        <td>
          <button onclick="editMed('${med._id}')">Edit</button>
          <button onclick="deleteMed('${med._id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="7">⚠️ Cannot connect to server</td></tr>`;
  }
}

async function deleteMed(id) {
  if (confirm("Delete this medicine?")) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadMedicines();
  }
}

async function editMed(id) {
  const res = await fetch(`${API}/${id}`);
  const med = await res.json();
  form.name.value = med.name;
  form.batchNo.value = med.batchNo;
  form.company.value = med.company;
  form.quantity.value = med.quantity;
  form.price.value = med.price;
  form.expiryDate.value = med.expiryDate.split('T')[0];
  document.getElementById('medicineId').value = med._id;
  document.getElementById('submit-btn').textContent = 'Update Medicine';
}

loadMedicines();
