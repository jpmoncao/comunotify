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
        .then(res => console.log(res))
        .catch(err => console.error(err));
}
