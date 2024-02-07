const form = document.getElementsByTagName("form")[0];

const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
        name: form.querySelector('#name').value,
        group: Number(form.querySelector('#group').value),
    }

    fetch("/login", {
        method: "POST",
        body: JSON.stringify(data),
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.ok)
                return res.json();
        })
        .then(data => {
            localStorage.setItem('user', data.data);

            document.querySelector('#alerta').innerHTML = data.message;
            document.querySelector('#alerta').classList.remove('d-none');

            setTimeout(2000, () => {
                location.href = '/chat'
            })
        })
        .catch(err => console.error('Erro: ' + err));
}
