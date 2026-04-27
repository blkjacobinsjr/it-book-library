// src/favorite.ts

// Section 1 — Get favorites from localStorage (Jerry typed)
function getFavs(): string[] {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
}

async function renderFavorites() {
    const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
    const favCount = document.querySelector(".mainnav-number") as HTMLSpanElement;

    // Section 2 — Fetch only favorited books (Jerry typed)
    const favorites = getFavs();
    const results = await Promise.allSettled(
        favorites.map((isbn: string) =>
            fetch(`http://localhost:4730/books/${isbn}`).then(res => res.json())
        )
    );
    const books = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map(r => r.value);

    // Update nav counter
    favCount.textContent = String(books.length);

    // Update heading
    const h2 = document.querySelector("h2") as HTMLHeadingElement;
    h2.textContent = `${books.length} Favorites on your list`;

    // Render function
    function render(bookList: any[]) {
        tbody.innerHTML = "";

        bookList.forEach((book) => {
            const row = document.createElement("tr");

            const titleCell = document.createElement("td");
            titleCell.textContent = book.title;

            const isbnCell = document.createElement("td");
            isbnCell.textContent = book.isbn;

            const authorCell = document.createElement("td");
            authorCell.textContent = `${book.authorFirstName} ${book.authorLastName}`;

            const publisherCell = document.createElement("td");
            publisherCell.textContent = book.publisher;

            const actionCell = document.createElement("td");

            // Section 3 — Remove button (Jerry typed)
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", () => {
                let favs = getFavs();
                favs = favs.filter((id: string) => id !== book.isbn);
                localStorage.setItem("favorites", JSON.stringify(favs));
                renderFavorites();
            });

            const detailBtn = document.createElement("button");
            detailBtn.className = "button";
            detailBtn.textContent = "Detail";
            detailBtn.onclick = () => {
                window.location.href = `detail.html?isbn=${book.isbn}`;
            };

            actionCell.appendChild(removeBtn);
            actionCell.appendChild(detailBtn);

            row.appendChild(titleCell);
            row.appendChild(isbnCell);
            row.appendChild(authorCell);
            row.appendChild(publisherCell);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    }

    render(books);
}

renderFavorites();
