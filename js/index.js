// create a render event to display the data
const render_event = new CustomEvent('render', {
	detail: {
		message: 'Rendering book data from localStorage to the DOM',
	},
});

document.addEventListener('DOMContentLoaded', function () {
	// check if the data is already in localStorage, if not, create it
	if (localStorage.getItem('bookData') === null) {
		localStorage.setItem(
			'bookData',
			JSON.stringify({
				books: [
					{
						title: 'Epic of Gilgamesh',
						author: 'Anonymous ',
						category: 'non-fiction',
						publisher: 'Penguin Classics',
						year: '-2100',
						pages: '128',
						read: true,
					},
					{
						title: 'The Iliad',
						author: 'Homer',
						category: 'non-fiction',
						publisher: 'Penguin Classics',
						year: '-630',
						pages: '704',
						read: false,
					},
					{
						title: 'The Da Vinci Code',
						author: 'Dan Brown',
						category: 'fiction',
						publisher: 'Doubleday',
						year: '2003',
						pages: '689',
						read: false,
					},
				],
			})
		);
	}

	// read book data from localStorage
	bookData = JSON.parse(localStorage.getItem('bookData'));
	console.log(JSON.stringify(bookData));

	// add listener for sumbit event on the form
	const form = document.getElementById('bookForm');
	form.addEventListener('submit', function (event) {
		event.preventDefault();

		// get the values from the form
		let title = document.getElementById('title').value;
		let author = document.getElementById('author').value;
		let category = document.getElementById('category').value;
		let publisher = document.getElementById('publisher').value;
		let year = document.getElementById('year').value;
		let pages = document.getElementById('pages').value;
		let read = document.getElementById('read').checked;

		// validate the form
		if (
			title === '' ||
			author === '' ||
			category === '' ||
			publisher === '' ||
			year === '' ||
			pages === ''
		) {
			alert('Please fill in all fields');
			return;
		}

		// validate that the title is unique
		if (bookData.books.findIndex((book) => book.title === title) !== -1) {
			alert('Book title must be unique');
			return;
		}

		// validate year between -1000 to todays date
		if (year < -3000 || year > new Date().getFullYear()) {
			alert('Year must be between -1000 and todays date');
			return;
		}

		// create a new book object
		const newBook = {
			title: title,
			author: author,
			category: category,
			publisher: publisher,
			year: year,
			pages: pages,
			read: read,
		};

		// reset form input
		form.reset();

		// add the new book to the bookData object
		bookData.books.push(newBook);

		// update the localStorage with the new book
		localStorage.setItem('bookData', JSON.stringify(bookData));

		// dispatch the render event
		document.dispatchEvent(render_event);
	});

	// listen to render event
	document.addEventListener('render', function (event) {
		// print message on console
		console.log(event.detail.message);

		// get the bookData from localStorage
		bookData = JSON.parse(localStorage.getItem('bookData'));

		// get the book list element
		const unreadBook = document.getElementById('unreadBook');
		const readBook = document.getElementById('readBook');

		// clear the book list
		unreadBook.innerHTML = '';
		readBook.innerHTML = '';

		// loop through the books and add them to the DOM
		bookData.books.forEach(function (book) {
			// create the book card
			const bookCard = document.createElement('div');
			bookCard.classList.add('book-card');

			// add inner html to the book card
			bookCard.innerHTML = `
                <div class="book-image">
                    <span class="category">${toTitleCase(book.category)}</span>
                </div>
                <div class="book-info">
                    <h5>${book.title}</h5>
                    <p>${book.author}</p>
                    <p>${book.publisher}</p>
                    <p>${stringifyYear(book.year)}</p>
                    <p>${book.pages}</p>
                </div>

                <div class="action">
                    <button class="btn-read" onclick="readBook(this)">
                    ${book.read === true ? 'Read' : 'Unread'}
                    </button>
                    <button class="btn-delete" onclick="deleteBook(this)">Delete</button>
                </div>
            `;

			// add the book card to the DOM
			if (book.read) {
				readBook.appendChild(bookCard);
			} else {
				unreadBook.appendChild(bookCard);
			}
		});
	});

	// dispatch the render event
	document.dispatchEvent(render_event);
});

function toTitleCase(text) {
	return text.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function readBook(element) {
	// get the bookData from localStorage
	bookData = JSON.parse(localStorage.getItem('bookData'));

	// get book title
	let card = element.parentElement.parentElement;
	let title = card.querySelector('h5').innerText;

	// find index book data
	let index = bookData.books.findIndex((book) => book.title === title);

	// toggle the read property of the book
	bookData.books[index].read = !bookData.books[index].read;

	// update the localStorage
	localStorage.setItem('bookData', JSON.stringify(bookData));

	// dispatch the render event
	document.dispatchEvent(render_event);
}

function deleteBook(element) {
	// display alert
	if (!confirm('Are you sure you want to delete this book?')) {
		return;
	}

	// get the bookData from localStorage
	bookData = JSON.parse(localStorage.getItem('bookData'));

	// get book title
	let card = element.parentElement.parentElement;
	let title = card.querySelector('h5').innerText;

	// find index book data
	let index = bookData.books.findIndex((book) => book.title === title);

	// remove the book from the bookData
	bookData.books.splice(index, 1);

	// update the localStorage
	localStorage.setItem('bookData', JSON.stringify(bookData));

	// dispatch the render event
	document.dispatchEvent(render_event);
}

function stringifyYear(year) {
	// if year is less than 0, add BCE to the end
	if (year < 0) {
		return `${Math.abs(year)} BCE`;
	}
	return year;
}
