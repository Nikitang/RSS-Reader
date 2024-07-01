import onChange from 'on-change';

import * as yup from 'yup';

const state = {
    actual: '',
    urls: [],
};

const expectValues = yup.object().shape({
    actual: yup.string().url().required(),
});

const watchedState = onChange(state, (path, value, prevousValue) => {});

const addButton = document.querySelector('.add-btn');
const input = document.querySelector('input');
const div = document.querySelector('.first');
const p = document.querySelector('.feedback');

addButton.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.actual = input.value;
    expectValues.validate(state)
        .then((value) => {
            if (watchedState.urls.includes(input.value)) {
                p.textContent = 'RSS уже существует';
            } else {
                watchedState.urls.push(input.value);
                input.value = '';
                input.classList.remove('is-invalid');
                p.innerHTML = 'RSS успешно загружен';
                p.classList.replace('text-danger', 'text-success')
                console.log(value.urls);
            }
        })
        .catch((error) => {
            div.appendChild(p); 
            p.innerHTML = error.message;
            p.classList.replace('text-success', 'text-danger');
            input.classList.add('is-invalid');
            console.error(error);
        });
});
