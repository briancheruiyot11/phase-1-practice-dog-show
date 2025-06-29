document.addEventListener('DOMContentLoaded', () => {
  // Fetches and displays all dogs when page loads
  fetchDogs();
  
  // Form submission handler
  const dogForm = document.getElementById('dog-form');
  dogForm.addEventListener('submit', handleFormSubmit);
});

function fetchDogs() {
  fetch('http://localhost:3000/dogs')
    .then(response => response.json())
    .then(dogs => renderDogs(dogs))
    .catch(error => console.error('Error fetching dogs:', error));
}

function renderDogs(dogs) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  
  dogs.forEach(dog => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class='padding center'>${dog.name}</td>
      <td class='padding center'>${dog.breed}</td>
      <td class='padding center'>${dog.sex}</td>
      <td class='padding center'>
        <button class="edit-btn" data-id="${dog.id}">Edit</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  // Event listeners to all edit buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => populateForm(button.dataset.id));
  });
}

function populateForm(dogId) {
  fetch(`http://localhost:3000/dogs/${dogId}`)
    .then(response => response.json())
    .then(dog => {
      const form = document.getElementById('dog-form');
      form.name.value = dog.name;
      form.breed.value = dog.breed;
      form.sex.value = dog.sex;
      form.dataset.id = dog.id;
    })
    .catch(error => console.error('Error fetching dog:', error));
}

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const dogId = form.dataset.id;
  
  if (!dogId) {
    console.error('No dog selected for editing');
    return;
  }
  
  const dogData = {
    name: form.name.value,
    breed: form.breed.value,
    sex: form.sex.value
  };
  
  fetch(`http://localhost:3000/dogs/${dogId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dogData)
  })
    .then(() => {      
      fetchDogs();      
      form.reset();      
      delete form.dataset.id;
    })
    .catch(error => console.error('Error updating dog:', error));
}