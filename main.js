
/* =================================
   NOIR LIBRARY - FUNCIONALIDADES
================================= */

// MENU PARA CELULAR

const menuMobile = document.getElementById("menuMobile");
const navbar = document.querySelector(".navbar");

menuMobile.addEventListener("click", () => {
    navbar.classList.toggle("open");

    menuMobile.textContent = navbar.classList.contains("open")
        ? "✕"
        : "☰";
});

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuMobile.textContent = "☰";
    });
});


// PESQUISA DE LIVROS

const bookSearch = document.getElementById("bookSearch");
const categoryFilter = document.getElementById("categoryFilter");
const bookCards = document.querySelectorAll(".book-card");
const noResults = document.getElementById("noResults");

function filterBooks() {

    const searchText = bookSearch.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    let visibleBooks = 0;

    bookCards.forEach(card => {

        const title = card.dataset.title.toLowerCase();
        const author = card.dataset.author.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch =
            title.includes(searchText) ||
            author.includes(searchText);

        const matchesCategory =
            selectedCategory === "todos" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {

            card.style.display = "block";
            visibleBooks++;

        } else {

            card.style.display = "none";

        }

    });

    noResults.style.display =
        visibleBooks === 0 ? "block" : "none";

}

bookSearch.addEventListener("input", filterBooks);

categoryFilter.addEventListener("change", filterBooks);


// CATEGORIAS

document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.filter;

        categoryFilter.value = category;

        filterBooks();

        document.getElementById("colecao").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// LIMPAR FILTROS

document.getElementById("clearFilters").addEventListener("click", () => {

    bookSearch.value = "";
    categoryFilter.value = "todos";

    filterBooks();

});


// FAVORITOS

let favorites = JSON.parse(
    localStorage.getItem("noirFavorites")
) || [];

const favoriteButtons = document.querySelectorAll(".favorite-button");

function updateFavorites() {

    favoriteButtons.forEach(button => {

        const bookName = button.dataset.book;

        const isFavorite = favorites.includes(bookName);

        button.classList.toggle("active", isFavorite);

        button.textContent = isFavorite ? "♥" : "♡";

    });

}

favoriteButtons.forEach(button => {

    button.addEventListener("click", () => {

        const bookName = button.dataset.book;

        if (favorites.includes(bookName)) {

            favorites = favorites.filter(
                book => book !== bookName
            );

        } else {

            favorites.push(bookName);

        }

        localStorage.setItem(
            "noirFavorites",
            JSON.stringify(favorites)
        );

        updateFavorites();

    });

});

updateFavorites();


// BOTÃO DE PESQUISA DO CABEÇALHO

document.getElementById("searchButton").addEventListener("click", () => {

    document.getElementById("colecao").scrollIntoView({
        behavior: "smooth"
    });

    setTimeout(() => {
        bookSearch.focus();
    }, 500);

});


// MENSAGEM TEMPORÁRIA PARA PÁGINAS AINDA NÃO CRIADAS

function showMessage() {

    alert(
        "Esta história está aguardando sua próxima página! Em breve você poderá conhecer a sinopse e ler os capítulos."
    );

}
