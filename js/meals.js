// Meals — handles meal counters, remaining bar, and sidebar updates

function changeTotal(d) {
  total = Math.max(1, total + d);
  document.getElementById('totalDisplay').textContent = total;
  updateSidebar();
}

function changeMeal(key, d) {
  const newVal = meals[key] + d;
  const assigned = Object.values(meals).reduce((a, b) => a + b, 0);
  const remaining = total - assigned;
  if (newVal < 0) return;
  if (d > 0 && remaining <= 0) return;
  meals[key] = newVal;
  document.getElementById('count-' + key).textContent = newVal;
  updateRemaining();
  updateSidebar();
}

function updateRemaining() {
  const assigned = Object.values(meals).reduce((a, b) => a + b, 0);
  const rem = total - assigned;
  const bar = document.getElementById('remainingBar');
  document.getElementById('remainingCount').textContent = rem;
  bar.className = 'remaining-bar';
  if (rem === 0) {
    bar.classList.add('done');
    bar.querySelector('span').textContent = 'All guests assigned ✓';
  } else if (rem < 0) {
    bar.classList.add('over');
    bar.querySelector('span').textContent = 'Too many assigned!';
  } else {
    bar.querySelector('span').textContent = 'Guests unassigned';
  }
}

function updateSidebar() {
  document.getElementById('sidTotal').textContent = total;
  const assigned = Object.values(meals).reduce((a, b) => a + b, 0);
  const pct = total > 0 ? (assigned / total) * 100 : 0;
  document.getElementById('progressFill').style.width = Math.min(100, pct) + '%';
  for (const k of ['default', 'dairy', 'veg', 'vegan']) {
    document.getElementById('sid-' + k).textContent = meals[k] || '—';
  }
}
