document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement('div');
    header.classList.add('div-logo');

    const logo = document.createElement('img');
    logo.src = "./assets/logo03.svg";
    logo.alt = "Logo do site";

    const title = document.createElement('h1');
    title.textContent = 'QuickList';

    header.append(logo, title);
    document.body.appendChild(header);

    document.body.classList.add('body');

    const main = document.createElement('div');
    main.classList.add('container');

    const formArea = document.createElement('div');
    formArea.classList.add('search');

    const heading = document.createElement('h1');
    heading.textContent = "Compras da semana";

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Adicione um novo item';

    const addBtn = document.createElement('button');
    addBtn.classList.add('btn-add');
    addBtn.textContent = 'Adicionar Item';

    formArea.append(input, addBtn);
    main.append(heading, formArea);
    document.body.appendChild(main);

    let blocked = false;

    addBtn.addEventListener('click', () => {
        if (blocked) return;

        blocked = true;
        addBtn.disabled = true;

        const value = input.value.trim();
        if (value === '') {
            alert('Por favor, insira um item.');
            releaseBtn();
            return;
        }

        const alreadyExists = Array.from(main.querySelectorAll('.item-text'))
            .some(el => el.textContent.toLowerCase() === value.toLowerCase());

        if (alreadyExists) {
            alert('Este item já foi adicionado.');
            releaseBtn();
            return;
        }

        const item = createItem({ text: value, checked: false });
        main.appendChild(item);
        saveList();
        showMessage('adicionado');

        input.value = '';

        setTimeout(() => {
            clearMessage();
            releaseBtn();
        }, 2000);
    });

    function releaseBtn() {
        blocked = false;
        addBtn.disabled = false;
    }

    function createItem(data) {
        const box = document.createElement('div');
        box.classList.add('item');

        const checkWrap = document.createElement('div');
        checkWrap.classList.add('input-select');

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.checked = data.checked;

        const label = document.createElement('label');
        label.classList.add('item-text');
        label.textContent = data.text;
        label.style.textDecoration = data.checked ? 'line-through' : 'none';

        check.addEventListener('change', () => {
            label.style.textDecoration = check.checked ? 'line-through' : 'none';
            saveList();
        });

        checkWrap.append(check, label);
        box.append(checkWrap, createDeleteButton(box));

        return box;
    }

    function createDeleteButton(target) {
        const del = document.createElement('img');
        del.classList.add('img-delete');
        del.src = './assets/delete01.svg';
        del.alt = 'Remover';

        del.addEventListener('click', () => {
            target.remove();
            showMessage('removido');
            saveList();

            setTimeout(() => clearMessage(), 2000);
        });

        return del;
    }

    function showMessage(type) {
        const message = document.createElement('div');
        const icon = document.createElement('img');
        const text = document.createElement('p');

        if (type === 'adicionado') {
            message.classList.add('msg-add-item');
            icon.src = './assets/check-circle-bold (1).svg';
            text.textContent = "O Item foi adicionado à lista";
        } else {
            message.classList.add('msg-delete');
            icon.src = './assets/Icon.svg';
            text.textContent = "O Item foi removido da lista";
        }

        message.id = 'notifier';
        message.append(text, icon);
        main.appendChild(message);
    }

    function clearMessage() {
        const note = document.getElementById('notifier');
        if (note) note.remove();
    }

    function saveList() {
        const list = Array.from(main.querySelectorAll('.item')).map(item => {
            const text = item.querySelector('.item-text').textContent;
            const done = item.querySelector('input[type="checkbox"]').checked;
            return { text, checked: done };
        });

        localStorage.setItem('@quicklist-data', JSON.stringify(list));
    }

    const stored = JSON.parse(localStorage.getItem('@quicklist-data')) || [];
    stored.forEach(data => main.appendChild(createItem(data)));
});
