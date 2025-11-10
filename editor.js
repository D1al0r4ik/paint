   for(let i = 0; i <= 1799; i += 1) {
    let div = document.createElement("div");
    div.className = "kletki";
    document.querySelector("#canvas").appendChild(div)
    }

let currentColor = "red"
const vseKnopki = document.querySelectorAll(".kletki");
let isMouseDown = false

// Отслеживание мыши
vseKnopki.forEach((knopka) =>{ 
    knopka.addEventListener("mousedown", ()=>{
        knopka.style.background = currentColor
    })
})

document.addEventListener('mousedown', function() {
    isMouseDown = true;
});

document.addEventListener('mouseup', function() {
    isMouseDown = false;
});

vseKnopki.forEach((knopka) =>{
    knopka.addEventListener("mouseover", ()=>{
        if(isMouseDown == true) {
             knopka.style.background = currentColor
        }
    })
})
// Выбор цвета рисования
let colorCell = document.querySelectorAll(".colorCell")
colorCell.forEach((colorbox) =>{
    colorbox.addEventListener("click", ()=>{
        currentColor = colorbox.style.background
    })
})

// Ластик
let lastik = document.querySelector(".lastik")
    lastik.addEventListener("click", ()=>{
        currentColor = "white"
    })

// Стиралка
let trash = document.querySelector(".trash")
    trash.addEventListener("click", ()=>{
    vseKnopki.forEach((vseKnopka) =>{
    vseKnopka.style.background = "white"
    })
})

//сохранение
document.querySelector(".save").addEventListener("click", function(){
    domtoimage.toPng(document.querySelector("#canvas"))
    .then(function(dataUrl){
        window.saveAs(dataUrl, "paint.png")
    })
})
