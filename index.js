const questionsContainerContent = document.querySelector('.question-content'),
    questionCongradulation = document.querySelector('.congradulation'),
    questionElem = document.querySelector('.question'),
    answerContainers = document.querySelectorAll('.answer'),
    answerElems = document.querySelectorAll('.answer p'),
    submitElem = document.querySelector('.btn-submit'),
    inputElems = document.querySelectorAll('.answer-input'),
    progressBarElems = document.querySelectorAll('.progress-bar'),
    grannyContainer = document.querySelector('.granny-container'),
    grannyMessages = document.querySelector('.granny-messages'),
    btnExtraGranny = document.querySelector('.btn-extra-granny'),
    btnGranny = document.querySelector('.btn-granny'),
    godAnimation = document.querySelector('#god-container'),
    btnExtraGod = document.querySelector('.btn-extra-god'),
    btnExtraMotivation = document.querySelector('.btn-extra-motivation'),
    youtubeContainer = document.querySelector('.youtube-container'),
    btnYoutube = document.querySelector('.youtube-btn'),
    btnExtraChill = document.querySelector('.btn-extra-chill'),
    btnGame = document.querySelector('.game-btn'),
    gameContainer = document.querySelector('.game-container'),
    gameOver = document.querySelector('.game-over');


const game = {
    round: 0,
    selectedAnswer: null,
    questions: [],
    extra: {
        granny: {
            available: true,
            currentMsg: 0,
            currentParagraph: 0,
            msgDiv: null,
            textDiv: null
        },
        god: {
            available: true,
            correctIndex: null
        },
        motivation: {
            available: true
        },
        chill: {
            available: true
        }
    }
}

const loadQuestion = () => {
    const question = game.questions[game.round];
    questionElem.innerText = (game.round + 1) + '. ' + question.question;
    for (let i = 0; i < answerElems.length; i++) {
        answerElems[i].innerText = question.answers[i];
    }
}

const initElems = () => {
    progressBarElems[0].classList.add('progress-active');
    progressBarElems[0].innerText = '$' + game.questions[0].prize + ' KDJ';
    progressBarElems[0].style.height = '3vh';
}

//call after updating game.round
const updateProgress = () => {
    progressBarElems[game.round - 1].classList.replace('progress-active', 'progress-done');
    const currentProgressPar = progressBarElems[game.round];
    currentProgressPar.classList.add('progress-active');
    currentProgressPar.innerText = '$' + game.questions[game.round].prize + ' KDJ';
    currentProgressPar.style.height = '3vh';
}

const resetInputs = (inputs) => {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
    }
    //reset answer styles
    animateSelect(answerContainers, -1);
}

const checkAnswer = () => {
    return game.questions[game.round].answers[game.selectedAnswer] === game.questions[game.round].correct_answer;
}

const congradulate = () => {
    questionsContainerContent.style.opacity = 0;
    questionCongradulation.style.display = 'inherit';
    questionCongradulation.style.opacity = 1;
    setTimeout(() => {
        questionCongradulation.style.opacity = 0;
        questionsContainerContent.style.display = 'inherit';
        questionsContainerContent.style.opacity = 1;
    }, 1000);
}

const nextQuestion = () => {
    game.round++;
    game.selectedAnswer = null;
    resetInputs(inputElems);
    loadQuestion();
    updateProgress();
    submitElem.classList.remove('active');
}

const handleGod = async () => {
    godAnimation.classList.add('god-animation');
    game.extra.god.correctIndex = game.questions[game.round].answers.indexOf(game.questions[game.round].correct_answer);
    game.selectedAnswer = game.extra.god.correctIndex;
    await new Promise(resolve => setTimeout(resolve, 10000));
    answerContainers[game.extra.god.correctIndex].classList.add('o0');
    await new Promise(resolve => setTimeout(resolve, 1000));
    answerContainers[game.extra.god.correctIndex].classList.add('bring-front-answer');
    answerContainers[game.extra.god.correctIndex].classList.add('answer-glow', 'answer-active');
    await new Promise(resolve => setTimeout(resolve, 2000));
    godAnimation.style.opacity = 0;
    answerContainers[game.extra.god.correctIndex].classList.add('shadow-remove');
}

const loadListeners = () => {
    for (let i = 0; i < inputElems.length; i++) {
        inputElems[i].addEventListener('change', () => {
            game.selectedAnswer = i;
            if (!submitElem.classList.contains('active')) submitElem.classList.add('active');
            animateSelect(answerContainers, i);
        })
    }

    //to achieve both transition effect and display: none
    questionsContainerContent.addEventListener('transitionend', () => {
        if (questionsContainerContent.style.opacity === '0') {
            questionsContainerContent.style.display = 'none';
        }
    });
    questionCongradulation.addEventListener('transitionend', () => {
        if (questionCongradulation.style.opacity === '0') {
            questionCongradulation.style.display = 'none';
        }
    })
    //reset granny container
    grannyContainer.addEventListener('transitionend', () => {
        if (grannyContainer.style.opacity === '0') {
            grannyContainer.style.display = 'none';
            grannyMessages.innerHTML = '';
            game.extra.granny = {
                currentMsg: 0,
                currentParagraph: 0,
                msgDiv: null,
                textDiv: null
            }
        }
    })

    godAnimation.addEventListener('transitionend', () => {
        if (!answerContainers[game.extra.god.correctIndex].classList.contains('bring-front-answer')) return;
        godAnimation.classList.remove('god-animation');
        answerContainers[game.extra.god.correctIndex].classList.remove('o0', 'answer-glow', 'bring-front-answer', 'shadow-remove');
        if (!submitElem.classList.contains('active')) submitElem.classList.add('active');
    })

    youtubeContainer.addEventListener('transitionend', () => {
        if (youtubeContainer.style.opacity === '0') {
            youtubeContainer.style.display = 'none';
            youtubePlayer.stopVideo();
        }
    })

    gameContainer.addEventListener('transitionend', () => {
        if (gameContainer.style.opacity === '0') {
            gameContainer.style.display = 'none';
        }
    })

    submitElem.addEventListener('click', async () => {
        if (game.selectedAnswer === null) return;
        if (checkAnswer()) {
            nextQuestion();
            congradulate();
        } else {
            console.log('INCORRECTO :(');
            gameOver.style.display = 'flex';
            await new Promise(res => setTimeout(res,100));

            gameOver.style.opacity = 1;
        }
    })

    btnExtraGranny.addEventListener('click', () => {
        if (game.extra.granny.available) {
            btnGranny.innerText = grannyMsg[game.extra.granny.currentMsg].texts[0];
            grannyContainer.style.display = 'inherit';
            grannyContainer.style.opacity = 1;
            game.extra.granny.available = false;
            btnExtraGranny.classList.add('extra-option-disabled');
        }

    })

    btnGranny.addEventListener('click', () => {
        handleGranny();
    })

    btnExtraGod.addEventListener('click', async () => {
        if(game.extra.god.available){
            handleGod();
            game.extra.god.available = false;
            btnExtraGod.classList.add('extra-option-disabled');
        }
    });

    btnExtraMotivation.addEventListener('click', () => {
        if(game.extra.motivation.available){
            if (youtubePlayer !== null) {
                youtubePlayer.playVideo();
            }
            youtubeContainer.style.display = 'inherit';
            youtubeContainer.style.opacity = 1;
            game.extra.motivation.available = false;
            btnExtraMotivation.classList.add('extra-option-disabled');
        }
    })

    btnYoutube.addEventListener('click', () => {
        youtubeContainer.style.opacity = 0;
    })

    btnExtraChill.addEventListener('click', async () => {
        if(game.extra.chill.available){
            gameContainer.style.display = 'inherit';
            gameContainer.style.opacity = 1;
            await new Promise(res => setTimeout(res, 1000));
            startGame()
            game.extra.chill.available = false;
            btnExtraChill.classList.add('extra-option-disabled');
        }
        
    })

    btnGame.addEventListener('click', () => {
        gameContainer.style.opacity = 0;
    })

}




fetch('https://opentdb.com/api.php?amount=10&type=multiple')
    .then(blob => {
        return blob.json();
    }).then(response => {
        response.results.forEach((result, i) => {
            game.questions.push({
                question: decodeString(result.question),
                answers: mixArray([decodeString(result.correct_answer), ...result.incorrect_answers.map(ia => decodeString(ia))]),
                correct_answer: decodeString(result.correct_answer),
                category: result.category,
                prize: Math.pow(2, i)
            })
        })
        loadQuestion(game.questions[game.round]);
        initElems();
        loadListeners();
    })


