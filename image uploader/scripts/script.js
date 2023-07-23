const container = document.querySelector(".container");
const dragArea = container.querySelector(".drag-area");
const addButton = container.querySelector("button");
const deleteButton = document.querySelector(".delete-button");
const finishButton = document.querySelector(".finish-button");
const input = container.querySelector("input");

let files = [];
let selectedImages = [];
let recentlyDeletedImages = [];

addButton.onclick = () => {
  input.click();
};

input.addEventListener("change", function () {
  files.push(...this.files);
  showFiles();
});

dragArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dragArea.classList.add("active");
});

dragArea.addEventListener("dragleave", () => {
  dragArea.classList.remove("active");
});

dragArea.addEventListener("drop", (event) => {
  event.preventDefault();
  files.push(...event.dataTransfer.files);
  showFiles();
});

function showFiles() {
  dragArea.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let fileReader = new FileReader();

    fileReader.onload = () => {
      const fileURL = fileReader.result;
      const imgTag = `<div class="image-container ${selectedImages.includes(i) ? "selected" : ""}" data-index="${i}">
                        <img src="${fileURL}" alt="image" onclick="toggleImageSelection(${i})">
                        <span class="delete-icon" onclick="deleteImage(${i})">Delete</span>
                      </div>`;
      dragArea.insertAdjacentHTML("beforeend", imgTag);
    };
    fileReader.readAsDataURL(file);
  }

  deleteButton.classList.toggle("show", selectedImages.length > 0);
  if (!container.contains(deleteButton)) {
    container.appendChild(deleteButton);
  }
}

function toggleImageSelection(index) {
  const isSelected = selectedImages.includes(index);
  if (isSelected) {
    const selectedIndex = selectedImages.indexOf(index);
    selectedImages.splice(selectedIndex, 1);
  } else {
    selectedImages.push(index);
  }

  showFiles();
}

function deleteImage(index) {
  const file = files.splice(index, 1)[0];
  recentlyDeletedImages.push([file]);
  selectedImages = selectedImages.filter((item) => item !== index);
  showFiles();
}

deleteButton.addEventListener("click", deleteSelectedImages);

function deleteSelectedImages() {
  let temp = []
  const sortedIndices = selectedImages.slice().sort((a, b) => b - a);
  sortedIndices.forEach((index) => {
    const file = files.splice(index, 1)[0];
    temp.push(file);
  });

  recentlyDeletedImages.push(temp);

  selectedImages = [];
  showFiles();
}

showFiles();

window.addEventListener("keydown", (event) => {
  if (event.key === "z" && event.ctrlKey && recentlyDeletedImages.length > 0) {
    let temp = recentlyDeletedImages.pop();
    files.push(...temp);
    showFiles();
  }
});

finishButton.addEventListener("click", () => {
  const filenames = files.map(file => file.name).join('\n');
  alert("File Names:\n" + filenames);
});