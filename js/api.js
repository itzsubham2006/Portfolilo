const API_URL = 'https://portfolilo-6.onrender.com';

function submitForm(formId, endpoint, resultId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        var resultDiv = document.getElementById(resultId);
        if (resultDiv) resultDiv.innerHTML = '';
        var btn = form.querySelector('.predict-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'running inference...'; }
        fetch(API_URL + endpoint, { method: 'POST', body: formData })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                var cls = data.result.indexOf('Risk') !== -1 || data.result.indexOf('Malignant') !== -1 ? 'result-text risk' : 'result-text safe';
                var html = '<div class="result-box" style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);">';
                html += '<div class="tw-line"><span class="p">[subham@hehe]</span> <span class="t">./predict --model ' + data.model_name.toLowerCase().replace(/ /g, '_') + '</span></div>';
                html += '<div class="tw-line"><span class="s">  </span><span class="t"><span style="color:#6c757d">loading model... ok</span></span></div>';
                html += '<div class="tw-line"><span class="s">  </span><span class="t"><span style="color:#c8f7a6">model</span>:  ' + data.model_name + '</span></div>';
                html += '<div class="tw-line"><span class="s">  </span><span class="t"><span style="color:#c8f7a6">status</span>: COMPLETE</span></div>';
                html += '<div class="tw-line"><span class="s">  </span><span class="t"><span style="color:#c8f7a6">result</span>:</span></div>';
                html += '<div class="' + cls + '">' + data.result + ' (' + data.confidence + '% confidence)</div>';
                html += '</div>';
                if (resultDiv) resultDiv.innerHTML = html;
                if (btn) { btn.disabled = false; btn.textContent = formId === 'heartForm' ? './predict --model heart_disease_rf.pkl' : './predict --model cancer_detection_rf.pkl'; }
            })
            .catch(function(err) {
                if (resultDiv) resultDiv.innerHTML = '<div class="result-text risk">Error: ' + err.message + '</div>';
                if (btn) { btn.disabled = false; btn.textContent = formId === 'heartForm' ? './predict --model heart_disease_rf.pkl' : './predict --model cancer_detection_rf.pkl'; }
            });
    });
}
