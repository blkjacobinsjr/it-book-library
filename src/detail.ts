// src/detail.ts

async function renderDetail() {
    // 1. Get ISBN from URL
    const params = new URLSearchParams(window.location.search);
    const isbn = params.get("isbn");

    // 2. Fetch this book
    const response = await fetch(`http://localhost:4730/books/${isbn}`);
    const book = await response.json();

    // 3. Fill in the page
    const h1 = document.querySelector("h1") as HTMLHeadingElement;
    h1.innerHTML = `${book.title}<br><small>${book.subtitle}</small>`;

    const abstract = document.querySelector("p") as HTMLParagraphElement;
    abstract.textContent = book.abstract;

    const detailsList = document.querySelector("ul") as HTMLUListElement;
    detailsList.innerHTML = `
        <li><strong>Author:</strong> ${book.authorFirstName} ${book.authorLastName}</li>
        <li><strong>Publisher:</strong> ${book.publisher}</li>
        <li><strong>Pages:</strong> ${book.numPages}</li>
    `;
}

renderDetail();
