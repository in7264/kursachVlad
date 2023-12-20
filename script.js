// Функція для відображення списку програм
displaySoftwareList();

// Функція для додавання програми
function addSoftware() {
    var softwareName = document.getElementById("software-name").value;
    var softwareKey = document.getElementById("software-key").value;
    var expiryDate = document.getElementById("expiry-date").value;

    // Отримання існуючого списку програм з локального сховища
    var softwareList = JSON.parse(localStorage.getItem('softwareList')) || [];

    // Додавання нової програми до списку
    softwareList.push({
        name: softwareName,
        key: softwareKey,
        expiry: expiryDate
    });

    // Збереження оновленого списку в локальному сховищі
    localStorage.setItem('softwareList', JSON.stringify(softwareList));

    // Оновлення таблиці
    displaySoftwareList();
}

// Функція для відображення списку програм
function displaySoftwareList() {
    var softwareList = JSON.parse(localStorage.getItem('softwareList')) || [];
    var tableBody = document.getElementById("software-table-body");

    // Очищення існуючих рядків
    tableBody.innerHTML = "";

    // Перевірка наявності прострочених ліцензій та виведення повідомлень
    softwareList.forEach(function (software, index) {
        var newRow = tableBody.insertRow(tableBody.rows.length);
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);

        cell1.innerHTML = software.name;
        cell2.innerHTML = software.key;
        cell3.innerHTML = software.expiry;

        // Перевірка чи ліцензія прострочена
        if (isLicenseExpired(software.expiry)) {
            cell3.style.color = 'red'; // Необов'язково, можна виділити прострочену дату червоним
            showExpirationNotification(software.name);
        }

        var actionButtons = document.createElement("div");
        actionButtons.classList.add("action-buttons");

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Видалити";
        deleteButton.onclick = function () {
            deleteSoftware(index);
        };

        var extendButton = document.createElement("button");
        extendButton.innerHTML = "Продовжити";
        extendButton.onclick = function () {
            extendSoftware(index);
        };

        actionButtons.appendChild(deleteButton);
        actionButtons.appendChild(extendButton);
        cell4.appendChild(actionButtons);
    });
}

// Функція для перевірки, чи прострочена ліцензія
function isLicenseExpired(expiryDate) {
    var currentDateTime = new Date();
    var expiryDateTime = new Date(expiryDate);
    return currentDateTime > expiryDateTime;
}

// Функція для відображення повідомлення про закінчення ліцензії
function showExpirationNotification(softwareName) {
    if (Notification.permission === "granted") {
        var notification = new Notification("Сповіщення про закінчення ліцензії", {
            body: "Ліцензія на " + softwareName + " закінчилась!",
            icon: "шлях/до/іконки.png" // Вказати шлях до іконки для повідомлення
        });

        // Необов'язково, можна обробляти події повідомлення
        notification.onclick = function () {
            // Обробка події кліку
            console.log("Повідомлення клікнуто");
        };

        notification.onshow = function () {
            // Обробка події показу
            console.log("Повідомлення відображено");
        };

        notification.onclose = function () {
            // Обробка події закриття
            console.log("Повідомлення закрито");
        };
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                showExpirationNotification(softwareName);
            }
        });
    }
}

// Функція для перевірки прострочених ліцензій
function checkExpiredLicenses() {
    var softwareList = JSON.parse(localStorage.getItem('softwareList')) || [];

    softwareList.forEach(function (software) {
        // Перевірка, чи ліцензія прострочена
        if (isLicenseExpired(software.expiry)) {
            // Необов'язково, можна виконати додаткові дії тут
            console.log("Ліцензія на " + software.name + " прострочена.");

            // Виведення повідомлення про прострочену ліцензію
            showExpirationNotification(software.name);
        }
    });

    // Запланування наступної перевірки через 1 хвилину
    setTimeout(checkExpiredLicenses, 60000); // 60000 мілісекунд = 1 хвилина
}

// Перший виклик для початку рекурсивної перевірки
checkExpiredLicenses();

// Функція для видалення програми
function deleteSoftware(index) {
    var softwareList = JSON.parse(localStorage.getItem('softwareList')) || [];
    softwareList.splice(index, 1);
    localStorage.setItem('softwareList', JSON.stringify(softwareList));
    displaySoftwareList();
}

// Функція для виведення форми продовження ліцензії
function extendSoftware(index) {
    var dateInput = document.createElement("input");
    dateInput.type = "datetime-local";
    dateInput.id = "extend-date-input";

    var confirmButton = document.createElement("button");
    confirmButton.innerHTML = "Підтвердити";
    confirmButton.onclick = function () {
        confirmExtend(index);
    };

    var cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Відмінити";
    cancelButton.onclick = function () {
        cancelExtend();
    };

    var extendContainer = document.getElementById("extend-container");
    extendContainer.innerHTML = "";
    extendContainer.appendChild(dateInput);
    extendContainer.appendChild(confirmButton);
    extendContainer.appendChild(cancelButton);

    // Відображення вікна продовження
    extendContainer.style.display = "block";
}

// Функція для відміни продовження
function cancelExtend() {
    var extendContainer = document.getElementById("extend-container");
    extendContainer.style.display = "none"; // Приховання вікна продовження
}

// Функція для підтвердження продовження
function confirmExtend(index) {
    var newExpiry = document.getElementById("extend-date-input").value;
    if (newExpiry) {
        var softwareList = JSON.parse(localStorage.getItem('softwareList')) || [];
        softwareList[index].expiry = newExpiry;
        localStorage.setItem('softwareList', JSON.stringify(softwareList));
        displaySoftwareList();
        cancelExtend();
    }
}

// Другий виклик для виведення списку програм при завантаженні сторінки
displaySoftwareList();
