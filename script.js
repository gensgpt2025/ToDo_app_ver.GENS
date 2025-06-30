// DOM要素を取得します
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const completedList = document.getElementById('completed-list');

// --- イベントリスナーの初期設定 ---
function initialize() {
    addButton.addEventListener('click', addNewTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addNewTask();
        }
    });

    const deleteAllButton = document.getElementById('delete-all-completed-button');
    deleteAllButton.addEventListener('click', () => {
        // 確認ダイアログを表示
        if (confirm('完了済みのタスクをすべて削除します。よろしいですか？')) {
            completedList.innerHTML = ''; // 完了リストの中身を空にする
        }
    });
}

// --- メインの機能 ---

// 新しいタスクを追加する
function addNewTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return; // テキストが空なら何もしない

    const listItem = createListItem(taskText);
    taskList.appendChild(listItem);
    taskInput.value = '';
}

// 1つのタスク（li要素）を生成する
function createListItem(taskText) {
    const listItem = document.createElement('li');

    // タスク内容（テキストと追加日時）
    const taskContentDiv = document.createElement('div');
    taskContentDiv.className = 'task-content';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;

    const addedDateTimeDiv = document.createElement('div');
    addedDateTimeDiv.className = 'task-datetime';
    addedDateTimeDiv.textContent = `追加日時: ${formatDate(new Date())}`;

    taskContentDiv.appendChild(taskSpan);
    taskContentDiv.appendChild(addedDateTimeDiv);

    // ボタン類
    const buttonGroupDiv = document.createElement('div');
    buttonGroupDiv.className = 'button-group';

    const completeButton = createCompleteButton(listItem);
    const editButton = createEditButton(listItem, taskSpan, taskContentDiv);
    const deleteButton = createDeleteButton(listItem);

    buttonGroupDiv.appendChild(completeButton);
    buttonGroupDiv.appendChild(editButton);
    buttonGroupDiv.appendChild(deleteButton);

    // 組み立て
    listItem.appendChild(taskContentDiv);
    listItem.appendChild(buttonGroupDiv);

    return listItem;
}

// --- ボタンを作成する関数たち ---

// 完了ボタン
function createCompleteButton(listItem) {
    const button = document.createElement('button');
    button.textContent = '完了';
    button.className = 'complete-button';
    button.addEventListener('click', () => moveToCompleted(listItem));
    return button;
}

// 編集ボタン
function createEditButton(listItem, taskSpan, taskContentDiv) {
    const button = document.createElement('button');
    button.textContent = '編集';
    button.className = 'edit-button';
    button.addEventListener('click', () => {
        if (listItem.classList.contains('editing')) return;
        listItem.classList.add('editing');

        const input = document.createElement('input');
        input.type = 'text';
        input.value = taskSpan.textContent;
        input.className = 'edit-input';

        taskContentDiv.replaceChild(input, taskSpan);
        input.focus();

        const finishEditing = () => {
            taskSpan.textContent = input.value.trim() || taskSpan.textContent;
            taskContentDiv.replaceChild(taskSpan, input);
            listItem.classList.remove('editing');
        };

        input.addEventListener('blur', finishEditing);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') finishEditing();
        });
    });
    return button;
}

// 削除ボタン
function createDeleteButton(listItem) {
    const button = document.createElement('button');
    button.textContent = '削除';
    button.className = 'delete-button';
    button.addEventListener('click', () => listItem.parentElement.removeChild(listItem));
    return button;
}

// 戻すボタン
function createUndoButton(listItem) {
    const button = document.createElement('button');
    button.textContent = '戻す';
    button.className = 'undo-button';
    button.addEventListener('click', () => moveToIncomplete(listItem));
    return button;
}

// --- タスクを移動させる関数 ---

// 未完了 -> 完了 へ移動
function moveToCompleted(listItem) {
    // ボタンを「戻す」「削除」に入れ替え
    const buttonGroup = listItem.querySelector('.button-group');
    buttonGroup.innerHTML = ''; // 中身を一旦空にする
    buttonGroup.appendChild(createUndoButton(listItem));
    buttonGroup.appendChild(createDeleteButton(listItem));

    // 完了日時を追加
    const completedDateTimeDiv = document.createElement('div');
    completedDateTimeDiv.className = 'task-datetime completed-datetime';
    completedDateTimeDiv.textContent = `完了日時: ${formatDate(new Date())}`;
    listItem.querySelector('.task-content').appendChild(completedDateTimeDiv);

    completedList.appendChild(listItem);
}

// 完了 -> 未完了 へ移動
function moveToIncomplete(listItem) {
    // ボタンを「完了」「編集」「削除」に入れ替え
    const buttonGroup = listItem.querySelector('.button-group');
    buttonGroup.innerHTML = ''; // 中身を一旦空にする
    buttonGroup.appendChild(createCompleteButton(listItem));
    buttonGroup.appendChild(createEditButton(listItem, listItem.querySelector('span'), listItem.querySelector('.task-content')));
    buttonGroup.appendChild(createDeleteButton(listItem));

    // 完了日時を削除
    const completedDateTimeDiv = listItem.querySelector('.completed-datetime');
    if (completedDateTimeDiv) {
        completedDateTimeDiv.remove();
    }

    taskList.appendChild(listItem);
}

// --- ヘルパー関数 ---

// 日時をフォーマットする
function formatDate(date) {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// --- アプリケーションの開始 ---
initialize();