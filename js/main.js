const searchInput = document.querySelector(".note__search-engine");
const menu = document.querySelector(".menu");
const noteBox = document.querySelector(".note__items");
const notes = document.getElementsByClassName("note__item");
const panel = document.querySelector(".panel");
const title = document.querySelector(".panel__title");
const color = document.querySelector(".panel__color");
const content = document.querySelector(".panel__content");
const error = document.querySelector(".panel__error");

const panelBtn = document.querySelector(".panel__btn");
const searchBtn = document.querySelector(".menu__search-btn");
const addBtn = document.querySelector(".menu__add-btn");
const removeBtn = document.querySelector(".menu__remove-btn");
const sortBtn = document.querySelector(".menu__sort-btn");
const saveBtn = document.querySelector(".panel__btn--save");
const editBtn = document.querySelector(".panel__btn--edit");
const cancelBtn = document.querySelector(".panel__btn--cancel");

const removeNoteBtns = document.getElementsByClassName('note__item-btn-remove');
const editNoteBtns = document.getElementsByClassName('note__item-btn-edit');

const menuBtns = [addBtn, removeBtn, sortBtn, removeBtn]; //tablica potrzebna do wyłączenia przycisków w momencie gdy panel dodawania jest aktywny

const letterNumber = document.querySelector(".panel__content-length-left");

let noteID = 0;
let noteOrder = 0;
let editID = 0;
let errorOfNumbers = 0;


const getCurrentDate = () => {
	const date = new Date();
	const month = [
		"styczeń",
		"luty",
		"marzec",
		"kwiecień",
		"maj",
		"czerwiec",
		"lipiec",
		"sierpień",
		"wrzesień",
		"październik",
		"listopad",
		"grudzień",
	];
	
	const currentDate = `${date.getDate()} ${
		month[date.getMonth()]
	} ${date.getFullYear()}`;
	return currentDate;
}

const showPanel = () => {
	panel.classList.add("panel__show");
	if (saveBtn.classList.contains("panel__btn-hide")) {
		saveBtn.classList.remove("panel__btn-hide");
	}
};
const hidePanel = () => {
	panel.classList.remove("panel__show");
	if (editBtn.classList.contains("panel__btn-active")) {
		editBtn.classList.remove("panel__btn-active");
	}
	clearInputs();
};

const clearInputs = () => {
	const inputs = [title, content];
	inputs.forEach((input) => {
		input.value = "";
	});
	letterNumber.textContent = 0;
};

const checkLength  = (min, max, noteText) => {
	if(noteText.length < min || noteText.length > max){
		return 0
	}
}

const countLetters = () => {
	letterNumber.textContent = content.value.length;
};

const addNote = () => {
	if ((!title.value || !color.value || !content.value)) {
		error.classList.add("panel__show-error");
		error.textContent = 'Pola nie mogą być puste';
	} else if(checkLength(3,15,title.value) === 0 || checkLength(70,200, content.value) === 0){
		error.classList.add("panel__show-error");
		error.textContent = 'Nieprawidłowa ilość znaków';
	}else{
		createNote();
	}
};

const createNote = () => {
	const note = document.createElement("div");
	//console.log(title.value.slice(1));
	note.classList.add("note__item");
	note.setAttribute("data-id", `${noteID}`);
	note.style.backgroundColor = `${color.value}`;
	const result = note.style.backgroundColor.match(/\(([^)]+)\)/); // wyrażenie regularne, które pozwala przechwycić wartości w nawiasach (przed nawaisami znajduje się "rgb")
	const rgb = result[1].split(","); //pobieramy 1 wartosc rgb i każdą z nich dzielimy za pomocą przecinka
	note.innerHTML = `<h2 class="note__item-title">${title.value.charAt(0).toUpperCase()}${title.value.slice(1)}</h2>
    <p class="note__item-text">${content.value}</p>
    <p class="note__item-date">${getCurrentDate()}</p>
    <button class="note__item-btn note__item-btn-remove" style="color: ${changeTextColor(rgb)}" onclick="deleteNote(${noteID})"><i class="fa-solid fa-xmark"></i></button>
    <button class="note__item-btn note__item-btn-edit" style="color: ${changeTextColor(rgb)}" onclick="fetchToEdit(${noteID})"><i class="fa-solid fa-pen-to-square"></i></button>`;
	noteID++;

	note.style.color = changeTextColor(rgb);
	noteBox.appendChild(note);
	hidePanel();
};

const fetchToEdit = (id) => {
	const editNote = document.querySelector(`[data-id="${id}"]`);
	const editNoteTitle = editNote.querySelector("h2");
	const editNoteText = editNote.querySelector(".note__item-text");
	const editNodeColor = editNote.style.backgroundColor;

	const result = editNodeColor.match(/\(([^)]+)\)/); // wyrażenie regularne, które pozwala przechwycić wartości w nawiasach (przed nawaisami znajduje się "rgb")
	const rgb = result[1].split(","); //pobieramy 1 wartosc rgb i każdą z nich dzielimy za pomocą przecinka
	const r = parseInt(rgb[0]);
	const g = parseInt(rgb[1]);
	const b = parseInt(rgb[2]);

	showPanel();
	saveBtn.classList.add("panel__btn-hide");
	editBtn.classList.add("panel__btn-active");

	//Treść
	title.value = editNoteTitle.textContent;
	content.value = editNoteText.textContent;

	//kolor dla inputa (przyjmuje on tylko wartość hex - dlatego jest zamieniany z wartości rgb)
	color.value = RGBtoHex(r, g, b);

	letterNumber.textContent = content.value.length;

	editID = id;
};

const editNote = () => {
	const editNote = document.querySelector(`[data-id="${editID}"]`);
	const editNoteTitle = editNote.querySelector("h2");
	const editNoteText = editNote.querySelector(".note__item-text");
	const editDate = editNote.querySelector('.note__item-date');
	const editNoteBtns = editNote.querySelectorAll('.note__item-btn');

	const newColor = hexToRgb(color.value);
	const result = newColor.match(/\(([^)]+)\)/); // wyrażenie regularne, które pozwala przechwycić wartości w nawiasach (przed nawaisami znajduje się "rgb")
	const rgb = result[1].split(","); //pobieramy 1 wartosc rgb i każdą z nich dzielimy za pomocą przecinka

	//Sprawdzamy czy pola nie są puste i czy długość inputów jest prawidłowa
	if ((!title.value || !color.value || !content.value)) {
		error.classList.add("panel__show-error");
		error.textContent = 'Pola nie mogą być puste';
	} else if(checkLength(3,15,title.value) === 0 || checkLength(70,200, content.value) === 0){
		error.classList.add("panel__show-error");
		error.textContent = 'Nieprawidłowa ilość znaków';
	}else{
		//Treść
		editNoteTitle.textContent = title.value.charAt(0).toUpperCase() + title.value.slice(1);
		editNoteText.textContent = content.value;
		//kolory
		editNote.style.backgroundColor = color.value;
		editNote.style.color = changeTextColor(rgb);
		color.value = "#e66465";
		editNoteBtns.forEach(editNoteBtn => {
			editNoteBtn.style.color = changeTextColor(rgb);
		})
		//Aktualizowanie daty
		editDate.textContent = getCurrentDate();
		//chowanie i aktywowanie przycisków
		saveBtn.classList.remove("panel__btn-hide");
		editBtn.classList.remove("panel__btn-active");

		hidePanel();
	}
};

const deleteNote = (id) => {
	const noteToDelete = document.querySelector(`[data-id='${id}']`);
	noteToDelete.remove();
};

const deleteAllNotes = () => {
	noteBox.textContent = "";
};

const sortAllNotes = () => {
	const noteTitles = [];
	for (const note of notes) {
		const noteTitle = note.querySelector("h2").textContent;
		noteTitles.push(noteTitle);
	}
	noteTitles.sort();

	//Sprawdzamy po kolei czy posortowane elementy(noteTitles) zgadzaja się z żywą kolekcją
	//Jeśli tak to nadajemy po kolei order i zwiększamy go
	noteTitles.forEach((noteTitle) => {
		for (const note of notes) {
			const noteTit = note.querySelector("h2").textContent;
			if (noteTitle == noteTit) {
				note.style.order = `${noteOrder}`;
			}
		}
		noteOrder++;
	});
	noteOrder = 0;
};

const searchEngine = () => {
	for (const note of notes) {
		const noteTitle = note.querySelector("h2").textContent.toLowerCase();
		const noteText = note
			.querySelector(".note__item-text")
			.textContent.toLowerCase();
		if (
			!(
				noteTitle.includes(searchInput.value.toLowerCase()) ||
				noteText.includes(searchInput.value.toLowerCase())
			)
		) {
			note.classList.add("note__hide");
		} else {
			note.classList.remove("note__hide");
		}
	}
};



const disabledButton = (btns) => {
	for (const btn of btns) {
		if (panel.classList.contains("panel__show")) {
            btn.setAttribute('disabled', '');
		}else{
            btn.removeAttribute('disabled');
        }
	}
};


//colors
const colorToHex = (color) => {
	const hexadecimal = color.toString(16);
	return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
};

const RGBtoHex = (red, green, blue) => {
	return "#" + colorToHex(red) + colorToHex(green) + colorToHex(blue);
};

const hexToRgb = (hex) => {
	var r = parseInt(hex.substring(1, 3), 16);
	var g = parseInt(hex.substring(3, 5), 16);
	var b = parseInt(hex.substring(5, 7), 16);

	return "rgb(" + r + ", " + g + ", " + b + ")";
};
const changeTextColor = (rgb) => {
	const r = rgb[0];
	const g = rgb[1];
	const b = rgb[2];

	const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
	const textColor = brightness > 125 ? "black" : "white";
	return textColor;
};

//listeners
window.addEventListener('click', () => {
	disabledButton(menuBtns);
});

window.addEventListener('click', () => {
	disabledButton(removeNoteBtns);
});

window.addEventListener('click', () => {
	disabledButton(editNoteBtns);
});

addBtn.addEventListener("click", showPanel);
removeBtn.addEventListener("click", deleteAllNotes);
sortBtn.addEventListener("click", sortAllNotes);

saveBtn.addEventListener("click", addNote);
cancelBtn.addEventListener("click", hidePanel);

editBtn.addEventListener("click", editNote);
searchInput.addEventListener("keyup", searchEngine);
content.addEventListener("keyup", countLetters);
