const generateBtn = document.getElementById("generate-btn");
const colors = document.getElementsByClassName("color");

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
}