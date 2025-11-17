// Ajuste esta constante para a URL pública do seu backend (Render/Railway ou localhost)
// Exemplos:
//   - Local: 'https://SEU_APP.onrender.com'
//   - Render: 'https://SEU_APP.onrender.com'
const API_BASE = 'https://api-java-copilot.onrender.com';

async function listar() {
  const r = await fetch(`${API_BASE}/api/v1/produtos`);
  const data = await r.json();
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
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
}

async function criar() {
  const nome = document.getElementById('nome').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  if (!nome || isNaN(preco)) {
    alert('Preencha nome e preço válido.');
    return;
  }
  const r = await fetch(`${API_BASE}/api/v1/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, preco })
  });
  if (!r.ok) {
    alert('Erro ao criar.');
    return;
  }
  document.getElementById('nome').value = '';
  document.getElementById('preco').value = '';
  await listar();
}

async function salvar(id) {
  const inputs = document.querySelectorAll(`input[data-id="${id}"]`);
  const body = {};
  inputs.forEach(i => body[i.getAttribute('data-field')] = i.value);
  body.preco = parseFloat(body.preco);
  const r = await fetch(`${API_BASE}/api/v1/produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) { alert('Erro ao salvar.'); return; }
  await listar();
}

async function remover(id) {
  if (!confirm('Tem certeza?')) return;
  const r = await fetch(`${API_BASE}/api/v1/produtos/${id}`, { method: 'DELETE' });
  if (!r.ok) { alert('Erro ao excluir.'); return; }
  await listar();
}

window.addEventListener('DOMContentLoaded', listar);
