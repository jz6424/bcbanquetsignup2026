// Contact — handles adding and removing children from the list

function addChild() {
  const list = document.getElementById('childrenList');
  const row = document.createElement('div');
  row.className = 'child-row';
  row.innerHTML = `<input class="field-input" type="text" placeholder="Child's full name">
    <button class="remove-child" onclick="this.parentElement.remove()">&times;</button>`;
  list.appendChild(row);
}
