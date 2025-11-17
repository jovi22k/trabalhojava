// URL base da sua API no Render
// Se for testar local, mude para: 'http://localhost:8080'
const API_BASE = 'https://api-java-copilot.onrender.com';

// Caminho dos endpoints de produtos (ajuste se o seu controller usar outro caminho)
const PRODUTOS_PATH = '/api/v1/produtos';

const statusApiEl = document.getElementById('statusApi');
const listaVaziaEl = document.getElementById('listaVazia');

async function checarStatus() {
  try {
    const r = await fetch(`${API_BASE}/actuator/health`);
    if (!r.ok) throw new Error();
    const json = await r.json();
    statusApiEl.textContent = `API online (status: ${json.status})`;
    statusApiEl.classList.remove('error');
    statusApiEl.classList.add('ok');
  } catch (e) {
    statusApiEl.textContent = 'Não foi possível conectar à API.';
    statusApiEl.classList.remove('ok');
    statusApiEl.classList.add('error');
  }
}

async function listar() {
  try {
    const r = await fetch(`${API_BASE}${PRODUTOS_PATH}`);
    if (!r.ok) throw new Error('Erro ao listar');
    const data = await r.json();

    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
      listaVaziaEl.style.display = 'block';
      return;
    }

    listaVaziaEl.style.display = 'none';

    for (const p of data) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td><input value="${p.nome}" data-id="${p.id}" data-field="nome"/></td>
        <td><input type="number" step="0.01" value="${p.preco}" data-id="${p.id}" data-field="preco"/></td>
        <td>
          <button onclick="salvar(${p.id})">Salvar</button>
          <span class="danger" onclick="remover(${p.id})">Excluir</span>
        </td>`;
      tbody.appendChild(tr);
    }
  } catch (e) {
    alert('Erro ao carregar lista de produtos.');
    console.error(e);
  }
}

async function criar() {
  const nome = document.getElementById('nome').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);

  if (!nome || isNaN(preco)) {
    alert('Preencha nome e preço válido.');
    return;
  }

  try {
    const r = await fetch(`${API_BASE}${PRODUTOS_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, preco })
    });

    if (!r.ok) {
      alert('Erro ao criar produto.');
      return;
    }

    document.getElementById('nome').value = '';
    document.getElementById('preco').value = '';
    await listar();
  } catch (e) {
    alert('Erro ao criar produto.');
    console.error(e);
  }
}

async function salvar(id) {
  const inputs = document.querySelectorAll(`input[data-id="${id}"]`);
  const body = {};
  inputs.forEach(i => body[i.getAttribute('data-field')] = i.value);

  body.preco = parseFloat(body.preco);

  if (!body.nome || isNaN(body.preco)) {
    alert('Nome ou preço inválido.');
    return;
  }

  try {
    const r = await fetch(`${API_BASE}${PRODUTOS_PATH}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      alert('Erro ao salvar.');
      return;
    }
    await listar();
  } catch (e) {
    alert('Erro ao salvar produto.');
    console.error(e);
  }
}

async function remover(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;

  try {
    const r = await fetch(`${API_BASE}${PRODUTOS_PATH}/${id}`, {
      method: 'DELETE'
    });

    if (!r.ok) {
      alert('Erro ao excluir.');
      return;
    }
    await listar();
  } catch (e) {
    alert('Erro ao excluir produto.');
    console.error(e);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  checarStatus();
  listar();
});
