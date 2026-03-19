// Navigation — controls which step is visible

function goToStep(n) {
  document.querySelectorAll('.step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === n);
  });
}

function goToStep2() {
  document.getElementById('totalLabel').textContent = total;
  Object.keys(meals).forEach(k => {
    meals[k] = 0;
    document.getElementById('count-' + k).textContent = 0;
  });
  updateRemaining();
  goToStep(2);
}

function goToStep3() {
  const assigned = Object.values(meals).reduce((a, b) => a + b, 0);
  const err = document.getElementById('mealError');
  if (assigned !== total) {
    err.style.display = 'block';
    err.textContent = assigned < total
      ? `Please assign ${total - assigned} more guest(s) to a meal plan.`
      : `You've assigned ${assigned - total} too many. Please reduce.`;
    return;
  }
  err.style.display = 'none';
  goToStep(3);
}

function goToStep4() {
  const err = document.getElementById('contactError');
  const name = document.getElementById('parentName').value.trim();
  const phone = document.getElementById('parentPhone').value.trim();
  const email = document.getElementById('parentEmail').value.trim();
  const childInputs = document.querySelectorAll('#childrenList .field-input');
  const children = Array.from(childInputs).map(i => i.value.trim()).filter(Boolean);

  if (!name || !phone || !email || children.length === 0) {
    err.style.display = 'block';
    err.textContent = 'Please fill in all required fields and at least one child\'s name.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.style.display = 'block';
    err.textContent = 'Please enter a valid email address.';
    return;
  }
  err.style.display = 'none';
  goToStep(4);
}

function goToStep5() {
  // Build confirm meal table
  const tbody = document.getElementById('confirmBody');
  tbody.innerHTML = '';
  for (const [k, count] of Object.entries(meals)) {
    if (count === 0) continue;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${mealIcons[k]} ${mealNames[k]}</td><td>${count} guest${count !== 1 ? 's' : ''}</td>`;
    tbody.appendChild(tr);
  }
  if (tbody.innerHTML === '') {
    tbody.innerHTML = '<tr><td colspan="2" style="color:var(--muted); font-size:12px;">No guests assigned.</td></tr>';
  }

  const childInputs = document.querySelectorAll('#childrenList .field-input');
  const children = Array.from(childInputs).map(i => i.value.trim()).filter(Boolean);

  document.getElementById('confirmName').textContent = document.getElementById('parentName').value.trim();
  document.getElementById('confirmPhone').textContent = document.getElementById('parentPhone').value.trim();
  document.getElementById('confirmEmail').textContent = document.getElementById('parentEmail').value.trim();
  document.getElementById('confirmChildren').textContent = children.join(', ') || '—';
  document.getElementById('confirmTotal').textContent = total;
  document.getElementById('confirmAllergies').textContent = document.getElementById('allergies').value.trim() || 'None';

  goToStep(5);
}
