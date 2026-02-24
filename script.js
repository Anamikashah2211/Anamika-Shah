const form = document.getElementById('item-form');
const inventoryBody = document.getElementById('inventory-body');
const searchInput = document.getElementById('search');

const totalItemsEl = document.getElementById('total-items');
const totalStockEl = document.getElementById('total-stock');
const inventoryValueEl = document.getElementById('inventory-value');

const storageKey = 'clothing-store-items';
let items = JSON.parse(localStorage.getItem(storageKey)) || [];

function saveItems() {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function getStockStatus(stock) {
  if (stock === 0) return { label: 'Out of Stock', className: 'out-stock' };
  if (stock <= 5) return { label: 'Low Stock', className: 'low-stock' };
  return { label: 'In Stock', className: 'in-stock' };
}

function updateSummary(filteredItems = items) {
  totalItemsEl.textContent = filteredItems.length;
  const totalStock = filteredItems.reduce((sum, item) => sum + item.stock, 0);
  const inventoryValue = filteredItems.reduce(
    (sum, item) => sum + item.stock * item.price,
    0
  );

  totalStockEl.textContent = totalStock;
  inventoryValueEl.textContent = `$${inventoryValue.toFixed(2)}`;
}

function renderInventory(filteredItems = items) {
  inventoryBody.innerHTML = '';

  if (filteredItems.length === 0) {
    inventoryBody.innerHTML =
      '<tr><td colspan="7">No items found. Add products to your inventory.</td></tr>';
    updateSummary(filteredItems);
    return;
  }

  filteredItems.forEach((item) => {
    const status = getStockStatus(item.stock);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.size}</td>
      <td>${item.stock}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td><span class="badge ${status.className}">${status.label}</span></td>
      <td><button class="delete-btn" data-id="${item.id}">Delete</button></td>
    `;

    inventoryBody.appendChild(row);
  });

  updateSummary(filteredItems);
}

function addItem(event) {
  event.preventDefault();

  const item = {
    id: crypto.randomUUID(),
    name: document.getElementById('name').value.trim(),
    category: document.getElementById('category').value,
    size: document.getElementById('size').value.trim().toUpperCase(),
    stock: Number(document.getElementById('stock').value),
    price: Number(document.getElementById('price').value),
  };

  items.push(item);
  saveItems();
  form.reset();
  applySearch();
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  applySearch();
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  renderInventory(filteredItems);
}

form.addEventListener('submit', addItem);
searchInput.addEventListener('input', applySearch);
inventoryBody.addEventListener('click', (event) => {
  if (!event.target.classList.contains('delete-btn')) return;
  deleteItem(event.target.dataset.id);
});

renderInventory();
