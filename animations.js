(function(){
//animate title
const title = document.querySelector('.title');

for(let i = 0; i < title.children.length; i++){
    title.children[i].style.animationDelay = 0.3*i+'s';
    title.children[i].style.animationName = 'jump';
}

//animate answer select
const inputs = document.querySelectorAll('.answer-input'),
    answerContainers = document.querySelectorAll('.answer');

for(let i = 0; i < inputs.length; i++){
    answerContainers[i].addEventListener('animationend', (ev) => {
        answerContainers[i].classList.toggle('animate-scale');
    })
    inputs[i].addEventListener('change', (ev) => {
        answerContainers[i].classList.toggle('animate-scale');
    })
}

})()

//index = -1 to reset elems style
const animateSelect = (elems, index) => {
    for(let i = 0; i < elems.length; i++){
        if(i === index) elems[i].classList.add('answer-active');
        else elems[i].classList.remove('answer-active');
    }
}
