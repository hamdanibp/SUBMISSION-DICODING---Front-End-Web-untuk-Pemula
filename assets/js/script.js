(function() {  
  const tabButtonWrapper = document.querySelector(".tab-button-wrapper");
  const tabButtons = document.querySelectorAll(".tab-buttons");

  tabButtonWrapper.addEventListener("click", e => {
    if(e.target.classList.contains("tab-buttons")) {
      tabButtons.forEach(button => {
        button.className = "tab-buttons";
      });

      e.target.classList.add("active");
    }
  });

  window.addEventListener("load", () => document.location.hash = "#uncompleted");
})();


(function() {
  const books = [];
  const RENDER_BOOK = "render-book";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form-input");
  
    form.addEventListener("submit", e => {
      e.preventDefault();
      addBook();
    });

    bookActionButtons();

    searchBook();
  });

  function addBook() {
    const id = +new Date();
    const title = document.querySelector(".title");
    const author = document.querySelector(".author");
    const year = document.querySelector(".year");
    const isCompleted = document.querySelector(".isCompleted");
    const bookList = { 
      id, 
      title: title.value, 
      author: author.value, 
      year: year.value, 
      isCompleted: isCompleted.checked 
    };

    books.unshift(bookList);

    title.value = "";
    author.value = "";
    year.value = "";
    isCompleted.checked = false;

    document.dispatchEvent(new Event(RENDER_BOOK));
  }

  function createBook(book) {
    const { id, title, author, year, isCompleted } = book;

    return `
      <tr id="${id}">
        <td class="title">${title}</td>
        <td>${author}</td>
        <td>${year}</td>
        <td>
        ${
          (!isCompleted) ? 
            `<button class="check-book" data-bookid="${id}"><i class="fas fa-check"></i></button>` 
          : 
            `<button class="undo-book" data-bookid="${id}"><i class="fas fa-undo"></i></button>`
        }
          <button class="remove-book" data-bookid="${id}"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }

  function searchBook() {
    const booksTabContent = document.querySelector("#allBook");
    
    booksTabContent.addEventListener("keyup", function(e) {
      if(e.target.classList.contains("keyword")) {
        const tRows = document.querySelectorAll(".all-results-table tbody tr");
        const value = e.target.value.toLowerCase();

        console.log(tRows);
        tRows.forEach(row => {
          if(row.querySelector(".title").textContent.toLowerCase().startsWith(value)) {
            row.style.display = "table-row";
          } else {
            row.style.display = "none";
          }
        });
      }
    });
  }

  function bookActionButtons() {
    const booksItem = document.querySelectorAll(".books-item");

    booksItem.forEach(buttonAction => {
      buttonAction.addEventListener("click", e => {
        if(e.target.classList.contains("check-book")) {
          const bookId = e.target.dataset.bookid;
          const bookTarget = books.find(book => book.id == bookId);
          
          bookTarget.isCompleted = true;
        } 
        
        if(e.target.classList.contains("undo-book")) {
          const bookId = e.target.dataset.bookid;
          const bookTarget = books.find(book => book.id == bookId);
          
          bookTarget.isCompleted = false;
        }

        if(e.target.classList.contains("remove-book")) {
          const bookId = e.target.dataset.bookid;
          const bookTarget = books.findIndex(book => book.id == bookId);

          books.splice(bookTarget, 1);
        }
        document.dispatchEvent(new Event(RENDER_BOOK));
      });
    });
  };

  document.addEventListener(RENDER_BOOK, () => {    
    console.log(books);

    const uncompletedBooks = document.querySelector(".books-item.uncompletedBook");
    const completedBooks = document.querySelector(".books-item.completedBook");
    const allBooks = document.querySelector(".books-item.allBook");

    uncompletedBooks.innerHTML = "";
    completedBooks.innerHTML = "";
    allBooks.innerHTML = "";

    books.map(book => {
      const bookElement = createBook(book);

      if(book.isCompleted || !book.isCompleted) {
        allBooks.innerHTML += bookElement;
      }

      if(book.isCompleted) {
        completedBooks.innerHTML += bookElement;
      }

      if (!book.isCompleted) {
        uncompletedBooks.innerHTML += bookElement;
      }
    });

    
  });

})();