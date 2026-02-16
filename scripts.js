const generateBtn = document.getElementById("generate-btn");
const colors = document.getElementsByClassName("color");
const popup = document.querySelector(".copy-container")
// console.log(colors)
// console.log(Math.floor(Math.random() * 256))

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(value => value.toString(16).padStart(2, '0')).join('');
}

function checkTextContrast(color, htmlElement){
  const luminance = chroma(color).luminance();
  if (luminance > 0.5){
    htmlElement.style.color = "black"
  } else {
    htmlElement.style.color = "white"
  }
}

// Generates a random color for each column and adds the hex color code to the p of the column
function generateColors() {
  for (const color of colors) {
    // Skip if this color is locked
    if (color.getAttribute("data-locked") === 'true') continue;

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const rgbString = `rgb(${r}, ${g}, ${b})`;
    const hexString = rgbToHex(r, g, b);

    console.log(rgbString)
    color.style.backgroundColor = rgbString;

    const p = color.querySelector('p');
    p.textContent = hexString
    checkTextContrast(rgbString, p);

    const lockSpan = color.querySelector(".lock-icon");
    checkTextContrast(rgbString, lockSpan);
  }

  generateBtn.classList.add('rotate'); //start rotation
  setTimeout(() => {
    generateBtn.classList.remove('rotate'); //stop rotation
  }, 500);
}

generateBtn.addEventListener('click', () => generateColors());

window.addEventListener('DOMContentLoaded', generateColors);

window.addEventListener("keydown", (event) => {
  if (event.code === 'Space' || event.key.toLowerCase() === 'g') {
    generateColors();
  }
})

// Add click event to each lock icon to lock/unlock color
for (const color of colors) {
  const lockSpan = color.querySelector(".lock-icon");
  // console.log(lockSpan)

  if (lockSpan) {
    lockSpan.innerHTML = '<i class="fa-solid fa-unlock"></i>'
    lockSpan.addEventListener('click', () => {
      const isLocked = color.getAttribute('data-locked') === 'true';
      
      if (isLocked === true){
        color.setAttribute('data-locked', 'false');
        lockSpan.innerHTML = '<i class="fa-solid fa-unlock"></i>'
      } else {
        color.setAttribute('data-locked', 'true');
        lockSpan.innerHTML = '<i class="fa-solid fa-lock"></i>'
      }

    })
  }

  const p = color.querySelector('p');
  p.addEventListener('click', () => {
    copyToClipboard(p);
  })
}

function copyToClipboard(hex) {
  const elem = document.createElement("textarea");
  elem.value = hex.innerText;
  document.body.appendChild(elem);
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
  const popupBox = popup.children[0];
  popup.classList.add("active");
  popupBox.classList.add("active");
}

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  popup.classList.remove("active");
  popupBox.classList.remove("active");
});

// Get all modal and button elements
const saveBtn = document.querySelector('.save-btn');
const saveContainer = document.querySelector(".save-container");
const closeSave = document.querySelector(".close-save");
const submitSave = document.querySelector(".submit-save");
const saveName = document.querySelector(".save-name");

const libraryBtn = document.querySelector(".library-btn");
const libraryContainer = document.querySelector(".library-container");
const closeLibraryBtn = document.querySelector(".close-library");
const libraryPopup = document.querySelector(".library-popup");

function openPalette(){
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}

function closePalette(){
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

function openLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}

function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}

libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

let savedPalettes = []

// Save the current colors as a new pallete and render it in the library
function savePalette(){
  // Hide the save modal
  saveContainer.classList.remove("active");
  popup.classList.remove("acitve");
  //Get the palette name from the input
  const name = saveName.value;
  const hexColors = [];
  // Get all current hex codes from the color divs
  const currentHexes = document.querySelectorAll(".color p");
  currentHexes.forEach(hex => {
    hexColors.push(hex.innerText);
  });

  // Create a palette object
  const paletteObj = {name: name, colors: hexColors}
  // Add to savedPalettes array
  savedPalettes.push(paletteObj);
  //save to localStorage
  // localStorage.setItem("palettes", JSON.stringify(savedPalettes));
  saveToLocal(paletteObj);
  // Clear the input
  saveName.value = "";
  // Render the new palette in the library
  renderPalette(paletteObj);
}

saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette)

function saveToLocal(paletteObj){
  let localPalettes;

  // if there are not palettes in the localStorage, start with an empty array
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    // Converting JSON to JS from LS
    localPalettes = JSON.parse(localStorage.getItem('palettes'));
  }
  // Add the new palette
  localPalettes.push(paletteObj);
  // Save back to LocalStorage
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

// Render a palette in the library modal
function renderPalette(paletteObj) {
  // Create a container for the palette
  const palette = document.createElement('div');
  palette.classList.add("custom-palette");
  // Add the palette name as a title
  const title = document.createElement("h4");
  title.innerText = paletteObj.name;
  // Create a preview of the palette colors
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletteObj.colors.forEach(smallColor => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;
    preview.appendChild(smallDiv);
  })
  // Create a button to select this palette
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.innerText = "Select";
  paletteBtn.setAttribute("data-name", paletteObj.name);

  // When the button is clicked, apply the palette colors to the main color divs
  paletteBtn.addEventListener("click", e => {
    closeLibrary();
    const paletteName = e.target.getAttribute("data-name");
    const palette = savedPalettes.find(p => p.name === paletteName);
    // Set each color div to the palette color
    const colorDivs = Array.from(document.getElementsByClassName("color"));
    for (let i = 0; i<colorDivs.length; i++){
      colorDivs[i].style.backgroundColor = palette.colors[i];
      const text = colorDivs[i].querySelector('p');
      checkTextContrast(palette.colors[i], text);
      if (text) text.textContent = palette.colors[i];
      const lockSpan = colorDivs[i].querySelector(".lock-icon");
      if (lockSpan) checkTextContrast(palette.colors[i], lockSpan)
    }
  })



  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  // Add the palette to the library modal
  libraryContainer.children[0].appendChild(palette)
}

function getLocal() {
  if (localStorage.getItem("palettes") === null){
    localPalettes = [];
  } else {
    // Converting JSON to JS from LS
    const paletteObjects = JSON.parse(localStorage.getItem('palettes'));
    savedPalettes = [...paletteObjects]
    paletteObjects.forEach(renderPalette)
  }
}

getLocal()