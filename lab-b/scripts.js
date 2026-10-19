
class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        this.list = document.querySelector("#task-list");
        this.form = document.querySelector("#task-form");
        this.input = document.querySelector("#task-input");
        this.deadline = document.querySelector("#task-deadline");
        this.search = document.querySelector("#search-input");
        this.message = document.querySelector("#form-message");
        this.empty = document.querySelector("#empty-state");
        this.searchEmpty = document.querySelector("#search-empty-state");

        this.editing = null;

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.add(this.input.value, this.deadline.value);
        });

        this.search.addEventListener("input", () => {
            if (this.editing) {
                this.saveEdit();
            } else {
                this.draw();
            }
        });

        document.addEventListener("click", (event) => {
            if (this.editing && !this.editing.li.contains(event.target)) {
                this.saveEdit();
            }
        });

        this.draw();
    }

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    validate(text, deadline) {
        if (text.length < 3 || text.length > 255) {
            this.message.textContent = "Zadanie musi mieć od 3 do 255 znaków.";
            return false;
        }

        if (deadline && new Date(deadline) <= new Date()) {
            this.message.textContent = "Data musi być w przyszłości.";
            return false;
        }

        this.message.textContent = "";
        return true;
    }

    add(text, deadline = "") {
        if (!this.validate(text, deadline)) {
            return;
        }

        let task = {
            id: Date.now(),
            text: text,
            deadline: deadline
        };

        this.tasks.push(task);

        this.save();
        this.draw();
        this.form.reset();
    }

    remove(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);

        this.editing = null;

        this.save();
        this.draw();
    }

    edit(id, text, deadline) {
        if (!this.validate(text, deadline)) {
            return;
        }

        let task = this.tasks.find(task => task.id === id);

        task.text = text;
        task.deadline = deadline;

        this.editing = null;

        this.save();
        this.draw();
    }
    //tutaj troche pomoglo ai
    draw() {
        this.list.innerHTML = "";

        let phrase = this.search.value;
        let visibleTasks = this.tasks;

        if (phrase.length >= 2) {
            visibleTasks = this.tasks.filter(task =>
                task.text.includes(phrase)
            );
        }

        this.empty.hidden = this.tasks.length > 0;

        this.searchEmpty.hidden =
            phrase.length < 2 ||
            visibleTasks.length > 0 ||
            this.tasks.length === 0;

        visibleTasks.forEach(task => {
            let li = document.createElement("li");
            li.dataset.id = task.id;

            let span = document.createElement("span");
            span.style.whiteSpace = "pre-wrap";

            if (phrase.length >= 2) {
                let text = task.text;
                let start = 0;
                let index = text.indexOf(phrase);

                while (index !== -1) {
                    span.append(text.slice(start, index));

                    let mark = document.createElement("mark");
                    mark.textContent = text.slice(index, index + phrase.length);
                    span.append(mark);

                    start = index + phrase.length;
                    index = text.indexOf(phrase, start);
                }

                span.append(text.slice(start));
            } else {
                span.textContent = task.text;
            }

            li.append(span);

            if (task.deadline) {
                let dateSpan = document.createElement("span");
                dateSpan.textContent = " | Termin: " + task.deadline.replace("T", " ");
                li.append(dateSpan);
            }

            let button = document.createElement("button");
            button.textContent = "Usuń";

            button.addEventListener("click", (event) => {
                event.stopPropagation();
                this.remove(task.id);
            });

            li.append(button);

            li.addEventListener("click", (event) => {
                event.stopPropagation();

                if (this.editing && this.editing.id === task.id) {
                    return;
                }

                if (this.editing) {
                    if (!this.validate(
                        this.editing.input.value,
                        this.editing.dateInput.value
                    )) {
                        return;
                    }

                    this.saveEdit();
                }

                this.startEdit(task.id);
            });

            this.list.append(li);
        });
    }

    startEdit(id) {
        let task = this.tasks.find(task => task.id === id);

        let li = Array.from(this.list.children).find(element =>
            element.dataset.id === String(id)
        );

        li.innerHTML = "";

        let input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.maxLength = 255;

        let dateInput = document.createElement("input");
        dateInput.type = "datetime-local";
        dateInput.value = task.deadline;

        li.append(input, dateInput);

        this.editing = {
            id: id,
            li: li,
            input: input,
            dateInput: dateInput
        };

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.saveEdit();
            }
        });

        input.focus();
    }

    saveEdit() {
        if (!this.editing) {
            return;
        }

        let id = this.editing.id;
        let text = this.editing.input.value;
        let deadline = this.editing.dateInput.value;

        this.edit(id, text, deadline);
    }
}

document.todo = new Todo();
