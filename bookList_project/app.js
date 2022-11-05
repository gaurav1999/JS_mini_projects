class Book {
 constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
 }
}

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = localStorage.getItem('books');
            books = JSON.parse(books);
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.filter(item => {
            if(item.isbn !== isbn) return item;
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

class UI {
    static displayBooks () {
        const StoredBooks = Store.getBooks();
        const books = StoredBooks;
        books.forEach((book) => {
            UI.addBookToList(book);
        })
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = ''; 
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(element) {
        if(element.classList.contains('btn-danger')) {
            element.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, classname) {
        const div = document.createElement('div');
        div.className = `alert alert-${classname}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form  = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds;
        setTimeout((
        ) => { document.querySelector('.alert').remove(); }, 3000);
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-smdelete">X</a></td>
        `;
        list.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);
document.querySelector('#book-form').addEventListener('submit', (event) => {
    //Prevent actual submit
    event.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value; 
    const isbn = document.querySelector('#isbn').value;
    const book = new Book(title, author, isbn);
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill all fields', 'danger');
    } else {
       
        UI.addBookToList(book);
        Store.addBook(book);
        UI.showAlert('Book addedd', 'success');
        UI.clearFields();
    }
    
})

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book removed', 'success');
})