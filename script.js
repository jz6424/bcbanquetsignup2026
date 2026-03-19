const meals = { default: 0, dairy: 0, veg: 0, vegan: 0 };
  const mealNames = {
    default: 'Default',
    dairy: 'Dairy-Free',
    veg: 'Vegetarian',
    vegan: 'Vegan'
  };
  const mealIcons = { default:'🍽️', dairy:'🥛', veg:'🥗', vegan:'🌱' };
  let total = 1;

  function changeTotal(d) {
    total = Math.max(1, total + d);
    document.getElementById('totalDisplay').textContent = total;
    updateSidebar();
  }

  function changeMeal(key, d) {
    const newVal = meals[key] + d;
    const assigned = Object.values(meals).reduce((a,b)=>a+b,0);
    const remaining = total - assigned;
    if (newVal < 0) return;
    if (d > 0 && remaining <= 0) return;
    meals[key] = newVal;
    document.getElementById('count-' + key).textContent = newVal;
    updateRemaining();
    updateSidebar();
  }

  function updateRemaining() {
    const assigned = Object.values(meals).reduce((a,b)=>a+b,0);
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
    const assigned = Object.values(meals).reduce((a,b)=>a+b,0);
    const pct = total > 0 ? (assigned / total) * 100 : 0;
    document.getElementById('progressFill').style.width = Math.min(100, pct) + '%';
    for (const k of ['default','dairy','veg','vegan']) {
      document.getElementById('sid-' + k).textContent = meals[k] || '—';
    }
  }

  function goToStep2() {
    document.getElementById('totalLabel').textContent = total;
    Object.keys(meals).forEach(k => { meals[k] = 0; document.getElementById('count-'+k).textContent = 0; });
    updateRemaining();
    goToStep(2);
  }

  function goToStep3() {
    const assigned = Object.values(meals).reduce((a,b)=>a+b,0);
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
    // Build confirm table
    const tbody = document.getElementById('confirmBody');
    tbody.innerHTML = '';
    for (const [k, count] of Object.entries(meals)) {
      if (count === 0) continue;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${mealIcons[k]} ${mealNames[k]}</td><td>${count} guest${count!==1?'s':''}</td>`;
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
    const allergies = document.getElementById('allergies').value.trim();
    document.getElementById('confirmAllergies').textContent = allergies || 'None';
    goToStep(5);
  }

  function addChild() {
    const list = document.getElementById('childrenList');
    const row = document.createElement('div');
    row.className = 'child-row';
    row.innerHTML = `<input class="field-input" type="text" placeholder="Child's full name">
      <button class="remove-child" onclick="this.parentElement.remove()">&times;</button>`;
    list.appendChild(row);
  }

  function goToStep(n) {
    document.querySelectorAll('.step').forEach((el, i) => {
      el.classList.toggle('active', i + 1 === n);
    });
  }

  function submitForm() {
    const btn = document.querySelector('#step5 .cta-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz7DsBPmYgRQFrl_FJMCfVZyEF4c3pwt-N0dl-sYUeOb1WvXSuQrWFXB3atOjbsatXO/exec';

    // Hidden iframe to catch the form response without navigating away
    const iframeName = 'submit_frame_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Hidden form — works from local files, preserves all params through Google's redirect
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = SHEET_URL;
    form.target = iframeName;

    const childInputs = document.querySelectorAll('#childrenList .field-input');
    const children = Array.from(childInputs).map(i => i.value.trim()).filter(Boolean).join(', ');

    const fields = {
      total: total,
      default: meals.default,
      dairy: meals.dairy,
      veg: meals.veg,
      vegan: meals.vegan,
      parent_name: document.getElementById('parentName').value.trim(),
      phone: document.getElementById('parentPhone').value.trim(),
      email: document.getElementById('parentEmail').value.trim(),
      children: children,
      allergies: document.getElementById('allergies').value.trim() || 'None'
    };

    for (const [key, val] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = val;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();

    // Clean up and advance to success after short delay
    setTimeout(() => {
      document.getElementById('successCount').textContent = total;
      goToStep(6);
      btn.disabled = false;
      btn.textContent = 'Confirm Registration ✓';
      form.remove();
      iframe.remove();
    }, 1000);
  }

  function resetForm() {
    total = 1;
    Object.keys(meals).forEach(k => meals[k] = 0);
    document.getElementById('totalDisplay').textContent = 1;
    document.getElementById('parentName').value = '';
    document.getElementById('parentPhone').value = '';
    document.getElementById('parentEmail').value = '';
    document.getElementById('allergies').value = '';
    document.getElementById('childrenList').innerHTML = '<div class=\'child-row\'><input class=\'field-input\' type=\'text\' placeholder=\'Child name\'></div>';
    updateSidebar();
    goToStep(1);
  }

  updateSidebar();
