// Dados dos serviços (preço e prazo)
const serviceData = {
    'professor': { 
        price: 'R$ 80,00/hora', 
        deadline: '2 dias',
        description: 'Oferecer-se como Professor' 
    },
    'aluno': { 
        price: 'R$ 50,00/hora', 
        deadline: '3 dias',
        description: 'Oferecer-se como Aluno' 
    },
    'desenvolvimento': { 
        price: 'R$ 1.200,00', 
        deadline: '15 dias',
        description: 'Desenvolvimento de Software' 
    },
    'manutencao': { 
        price: 'R$ 350,00', 
        deadline: '5 dias',
        description: 'Manutenção de Computadores' 
    },
    'rede': { 
        price: 'R$ 500,00', 
        deadline: '7 dias',
        description: 'Configuração de Rede' 
    },
    'consultoria': { 
        price: 'R$ 200,00/hora', 
        deadline: '1 dia',
        description: 'Consultoria em TI' 
    }
};

// Variável para controle do número de solicitações
let requestCounter = 3; // Começa com 3 porque já temos 3 solicitações fictícias

// Inicializa a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona event listeners
    document.getElementById('service-type').addEventListener('change', updateServiceInfo);
    document.getElementById('add-request-btn').addEventListener('click', addRequest);
    
    // Ordena a tabela por data ao carregar
    sortTableByDate();
});

// Atualiza as informações do serviço selecionado
function updateServiceInfo() {
    const serviceType = document.getElementById('service-type').value;
    const priceElement = document.getElementById('service-price');
    const deadlineElement = document.getElementById('service-deadline');
    const dateElement = document.getElementById('service-date');
    
    if (serviceType && serviceData[serviceType]) {
        priceElement.textContent = serviceData[serviceType].price;
        deadlineElement.textContent = serviceData[serviceType].deadline;
        
        // Calcula a data prevista
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

// Formata a data para dd/mm/aaaa
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Adiciona uma nova solicitação à tabela
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
    
    const serviceName = serviceData[serviceType].description;
    const price = document.getElementById('service-price').textContent;
    const deadline = document.getElementById('service-deadline').textContent;
    const date = document.getElementById('service-date').textContent;
    
    newRow.innerHTML = `
        <td>${formatDate(today)}</td>
        <td>${requestNumber}</td>
        <td>${serviceName}</td>
        <td><span class="status status-draft">EM ELABORAÇÃO</span></td>
        <td>${price}</td>
        <td>${date}</td>
        <td><button class="btn btn-danger" onclick="deleteRequest(this)">Excluir</button></td>
    `;
    
    // Limpa o formulário
    document.getElementById('service-type').value = '';
    updateServiceInfo();
    
    // Reordena a tabela por data
    sortTableByDate();
    
    alert('Solicitação adicionada com sucesso!');
}

// Exclui uma solicitação
function deleteRequest(button) {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
        const row = button.closest('tr');
        row.parentNode.removeChild(row);
    }
}

// Ordena a tabela por data (mais recente primeiro)
function sortTableByDate() {
    const table = document.getElementById('requests-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const dateA = parseDate(a.cells[0].textContent);
        const dateB = parseDate(b.cells[0].textContent);
        return dateB - dateA; // Ordem decrescente
    });
    
    // Remove todas as linhas
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    
    // Adiciona as linhas ordenadas
    rows.forEach(row => tbody.appendChild(row));
}

// Converte a data no formato dd/mm/aaaa para um objeto Date
function parseDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
}

// Função para exportar dados (opcional)
function exportRequests() {
    const rows = document.querySelectorAll('#requests-table tbody tr');
    const requests = Array.from(rows).map(row => {
        return {
            date: row.cells[0].textContent,
            number: row.cells[1].textContent,
            service: row.cells[2].textContent,
            status: row.cells[3].textContent.trim(),
            price: row.cells[4].textContent,
            expectedDate: row.cells[5].textContent
        };
    });
    
    console.log('Dados das solicitações:', requests);
    // Aqui você poderia enviar para um servidor ou gerar um arquivo
    alert('Dados prontos para exportação! Verifique o console.');
}