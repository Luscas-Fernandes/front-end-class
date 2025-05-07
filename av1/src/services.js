const serviceData = {
    'professor': { 
        price: 'R$ 100,00/hora', 
        deadline: '2 dias',
        description: 'Oferecer-se como Professor' 
    },
    'aluno': { 
        price: 'R$ 125,00/hora', 
        deadline: '3 dias',
        description: 'Oferecer-se como Aluno' 
    },
    'oferecer_consultoria': { 
        price: 'R$ 200,00/hora', 
        deadline: '2 dia',
        description: 'Oferecer Consultoria em Artes' 
    },
    'receber_consultoria': { 
        price: 'R$ 150,00/hora', 
        deadline: '3 dia',
        description: 'Receber Consultoria em Artes' 
    }
};


let requestCounter = 0;

document.addEventListener('DOMContentLoaded', function() {    
    const user = JSON.parse(localStorage.getItem('usuarioParthenogenesis'));
    if (!user) {
        window.location.href = 'signin.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.nome || 'Não informado';
    document.getElementById('user-email').textContent = user.email || 'Não informado';
    
    document.getElementById('service-type').addEventListener('change', updateServiceInfo);
    document.getElementById('add-request-btn').addEventListener('click', addRequest);
        
    loadExistingRequests();
});

function updateServiceInfo() {
    const serviceType = document.getElementById('service-type').value;
    const priceElement = document.getElementById('service-price');
    const deadlineElement = document.getElementById('service-deadline');
    const dateElement = document.getElementById('service-date');
    
    if (serviceType && serviceData[serviceType]) {
        priceElement.textContent = serviceData[serviceType].price;
        deadlineElement.textContent = serviceData[serviceType].deadline;
                
        const today = new Date();
        const deadlineDays = parseInt(serviceData[serviceType].deadline);
        if (!isNaN(deadlineDays)) {
            today.setDate(today.getDate() + deadlineDays);
            dateElement.textContent = formatDate(today);
        } else {
            dateElement.textContent = serviceData[serviceType].deadline;
        }
    } else {
        priceElement.textContent = 'Selecione um serviço';
        deadlineElement.textContent = 'Selecione um serviço';
        dateElement.textContent = 'Selecione um serviço';
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function addRequest() {
    const serviceType = document.getElementById('service-type').value;
    
    if (!serviceType) {
        alert('Por favor, selecione um serviço.');
        return;
    }
    
    const table = document.getElementById('requests-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(0);
    
    const today = new Date();
    requestCounter++;
    const requestNumber = `2023-${String(requestCounter).padStart(3, '0')}`;
    
    newRow.innerHTML = `
        <td>${formatDate(today)}</td>
        <td>${requestNumber}</td>
        <td>${serviceData[serviceType].description}</td>
        <td><span class="status status-draft">EM ELABORAÇÃO</span></td>
        <td>${serviceData[serviceType].price}</td>
        <td>${document.getElementById('service-date').textContent}</td>
        <td><button class="btn btn-danger" onclick="deleteRequest(this)">Excluir</button></td>
    `;
        
    document.getElementById('service-type').value = '';
    updateServiceInfo();
        
    sortTableByDate();
    
    alert('Solicitação adicionada com sucesso!');
}

function deleteRequest(button) {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
        const row = button.closest('tr');
        row.parentNode.removeChild(row);
    }
}

function sortTableByDate() {
    const tbody = document.querySelector('#requests-table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const dateA = new Date(a.cells[0].textContent.split('/').reverse().join('-'));
        const dateB = new Date(b.cells[0].textContent.split('/').reverse().join('-'));        
    });
        
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
        
    rows.forEach(row => tbody.appendChild(row));
}

function loadExistingRequests() {        
    requestCounter = 0;
}