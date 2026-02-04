const generateBtn = document.getElementById("generate-btn");
const colors = document.getElementsByClassName("color");

// console.log(colors)
// console.log(Math.floor(Math.random() * 256))

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(value => value.toString(16).padStart(2, '0')).join('');
}

function generateColors() {
  for (const color of colors) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const rgbString = `rgb(${r}, ${g}, ${b})`;
    const hexString = rgbToHex(r, g, b);

    console.log(rgbString)
    color.style.backgroundColor = rgbString;

    const p = color.querySelector('p');
    p.textContent = hexString
  }
}

generateBtn.addEventListener('click', () => {
  generateColors();
  generateBtn.classList.add('rotate'); //start rotation
  setTimeout(() => {
    generateBtn.classList.remove('rotate'); //stop rotation
  }, 500)
});

window.addEventListener('DOMContentLoaded', generateColors);

window.addEventListener("keydown", (event) => {
  if (event.code === 'Space' || event.key.toLowerCase() === 'g') {
    generateColors();
    generateBtn.classList.add('rotate'); //start rotation
    setTimeout(() => {
      generateBtn.classList.remove('rotate'); //stop rotation
    }, 500);
  }
})