// Submit — handles form submission to Google Sheets and form reset

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz7DsBPmYgRQFrl_FJMCfVZyEF4c3pwt-N0dl-sYUeOb1WvXSuQrWFXB3atOjbsatXO/exec';

function submitForm() {
  const btn = document.querySelector('#step5 .cta-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  // Hidden iframe so the page doesn't navigate away
  const iframeName = 'submit_frame_' + Date.now();
  const iframe = document.createElement('iframe');
  iframe.name = iframeName;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Hidden form — works from local files and hosted pages
  const form = document.createElement('form');
  form.method = 'GET';
  form.action = SHEET_URL;
  form.target = iframeName;

  const childInputs = document.querySelectorAll('#childrenList .field-input');
  const children = Array.from(childInputs).map(i => i.value.trim()).filter(Boolean).join(', ');

  const fields = {
    total:       total,
    default:     meals.default,
    dairy:       meals.dairy,
    veg:         meals.veg,
    vegan:       meals.vegan,
    parent_name: document.getElementById('parentName').value.trim(),
    phone:       document.getElementById('parentPhone').value.trim(),
    email:       document.getElementById('parentEmail').value.trim(),
    children:    children,
    allergies:   document.getElementById('allergies').value.trim() || 'None'
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
  document.getElementById('childrenList').innerHTML = '<div class="child-row"><input class="field-input" type="text" placeholder="Child name"></div>';
  updateSidebar();
  goToStep(1);
}

// Initialise sidebar on page load
updateSidebar();
