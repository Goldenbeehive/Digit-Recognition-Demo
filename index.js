canvas = document.getElementById('canvas');

ctx = canvas.getContext('2d');
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = 20;
ctx.lineCap = 'round';
ctx.strokeStyle = '#FFFFFF';

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
    isDrawing = true;
    if (e.type.startsWith('touch')) {
        [lastX, lastY] = [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
    } else {
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    if (e.type.startsWith('touch')) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        [lastX, lastY] = [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
        ctx.lineTo(lastX, lastY);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
}

function stopDrawing() {
    isDrawing = false;
}

const myButton = document.getElementById('myButton');
const clear = document.getElementById('clear');
clear.addEventListener('click', () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
})
myButton.addEventListener('click', () => {
    let outputarea = document.getElementById('output')
    outputarea.innerHTML = ""
    outputarea.innerHTML = `<div class="progress-bar">
    <div class="progress"></div>
  </div>`

    predictDigit()
});

async function predictDigit() {
    try {
        const response = await fetch('https://goldenbee-digit-recog.hf.space/api/predict', {
            method: "POST",
            body: JSON.stringify({
                "data": [canvas.toDataURL('image/png')]
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        const p = document.getElementById('pred');
        let outputarea = document.getElementById('output')
        output = ""
        let arr = data.data[0].confidences
        outputarea.innerHTML = ""
        for (let index = 0; index < 5; index++) {
            outputarea.innerHTML = outputarea.innerHTML + `
            <div style="padding:5px">
      ${arr[index].label}  
      <progress value="${arr[index].confidence}" max="1"></progress>
      ${(arr[index].confidence * 100).toFixed(4)}%
    </div>
    
            `

        }
        data.data[0].confidences.forEach(element => {
            output = output + element.label + " : " + (100 * element.confidence).toFixed(4) + "%\n"
        });



    } catch (error) {
        console.log(error);
    }
}

function setProgress(percent) {
    const progress = document.querySelector(".progress");
    if (progress == null) {
        return;
    }
    const progressText = document.querySelector(".progress-text");

    const deg = percent * 3.6;
    progress.style.transform = `rotate(${deg}deg)`;

}

setInterval(() => {
    const percent = Math.floor(Math.random() * 101); // simulate progress
    setProgress(percent);
}, 2000); // update progress every 2 seconds