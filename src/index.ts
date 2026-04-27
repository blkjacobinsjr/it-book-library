// src/index.ts

function getFavorites(): string[] {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favs: string[]) {
    localStorage.setItem("favorites", JSON.stringify(favs));
}

async function renderBooks() {
    // 1. Fetch
    const response = await fetch("http://localhost:4730/books");
    const books = await response.json();

    // 2. Grab the HTML elements
    const searchInput = document.querySelector("#search") as HTMLInputElement;
    const publisherSelect = document.querySelector("#by-publisher") as HTMLSelectElement;
    const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
    const favCount = document.querySelector(".mainnav-number") as HTMLSpanElement;

    // 3. Fill the publisher dropdown
    const publishers: string[] = [...new Set(books.map((book: any) => book.publisher))] as string[];
    publishers.forEach((pub) => {
        const option = document.createElement("option");
        option.textContent = pub;
        publisherSelect.appendChild(option);
    });

    // 4. Render function (reusable)
    function render(filtered: any[]) {
        tbody.innerHTML = "";
        const favorites = getFavorites();

        filtered.forEach((book) => {
            const row = document.createElement("tr");

            // Heart button
            const heartCell = document.createElement("td");
            const heartBtn = document.createElement("button");
            heartBtn.className = "button button-clear fav-btn";
            const isFav = favorites.includes(book.isbn);
            heartBtn.innerHTML = isFav
                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fav"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="fav"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>`;
            heartBtn.addEventListener("click", () => {
                let favs = getFavorites();
                if (favs.includes(book.isbn)) {
                    favs = favs.filter((id: string) => id !== book.isbn);
                } else {
                    favs.push(book.isbn);
                }
                saveFavorites(favs);
                render(filtered);
                updateFavCount();
            });
            heartCell.appendChild(heartBtn);

            const titleCell = document.createElement("td");
            titleCell.textContent = book.title;

            const isbnCell = document.createElement("td");
            isbnCell.textContent = book.isbn;

            const authorCell = document.createElement("td");
            authorCell.textContent = `${book.authorFirstName} ${book.authorLastName}`;

            const publisherCell = document.createElement("td");
            publisherCell.textContent = book.publisher;

            const detailCell = document.createElement("td");
            const detailBtn = document.createElement("button");
            detailBtn.className = "button";
            detailBtn.textContent = "Detail";
            detailBtn.onclick = () => {
                window.location.href = `detail.html?isbn=${book.isbn}`;
            };
            detailCell.appendChild(detailBtn);

            row.appendChild(heartCell);
            row.appendChild(titleCell);
            row.appendChild(isbnCell);
            row.appendChild(authorCell);
            row.appendChild(publisherCell);
            row.appendChild(detailCell);
            tbody.appendChild(row);
        });
    }

    function updateFavCount() {
        favCount.textContent = String(getFavorites().length);
    }

    // 5. Initial render (all books)
    render(books);
    updateFavCount();

    // 6. Search listener
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = books.filter((book: any) =>
            book.title.toLowerCase().includes(query)
        );
        render(filtered);
    });

    // 7. Publisher listener
    publisherSelect.addEventListener("change", () => {
        const selected = publisherSelect.value;
        if (selected === "-") {
            render(books);
        } else {
            const filtered = books.filter((book: any) =>
                book.publisher.toLowerCase() === selected.toLowerCase()
            );
            render(filtered);
        }
    });
}

renderBooks();
