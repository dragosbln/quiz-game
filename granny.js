const handleGranny = async () => {
    if(btnGranny.innerText === 'Exit') {
        grannyContainer.style.opacity = 0;
        return;
    }
    if (game.extra.granny.currentMsg >= grannyMsg.length) {
        btnGranny.innerText = 'Exit';
        return;
    }
    if (!btnGranny.classList.contains('active')) return;
    if (game.extra.granny.currentParagraph === 0) {
        const div = document.createElement('div');
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('granny-img');
        const textDiv = document.createElement('div');
        textDiv.classList.add('granny-text');
        div.append(imgDiv, textDiv);
        game.extra.granny.msgDiv = div;
        game.extra.granny.textDiv = textDiv;
        grannyMessages.append(div);
    }

    if (grannyMsg[game.extra.granny.currentMsg].from === 'you') {
        game.extra.granny.msgDiv.classList.add('granny-msg-2');

        const p = document.createElement('p');
        let text = grannyMsg[game.extra.granny.currentMsg].texts[game.extra.granny.currentParagraph];
        if (text.includes('*question*')) text = '<span class="bold">' + text.replace('*question*', game.questions[game.round].question) + '</span>';
        if (text.includes('*options*')) text = text.replace('*options*', '<span class="bold">' + game.questions[game.round].answers.slice(0, 3).join(', ') + ' or ' + game.questions[game.round].answers[3] + '?' + '</span>');
        p.innerHTML = text;
        if (text.length < 60) p.style.whiteSpace = 'nowrap';
        p.style.alignSelf = 'flex-end';
        game.extra.granny.textDiv.append(p);
        scrollContainer(grannyMessages);

        game.extra.granny.currentParagraph++;
        if (game.extra.granny.currentParagraph >= grannyMsg[game.extra.granny.currentMsg].texts.length) {
            game.extra.granny.currentParagraph = 0;
            game.extra.granny.currentMsg++;
            btnGranny.click();
        } else {
            let btnText = grannyMsg[game.extra.granny.currentMsg].texts[game.extra.granny.currentParagraph];
            if (btnText.includes('*question*')) btnText = btnText.replace('*question*', game.questions[game.round].question);
            if (btnText.includes('*options*')) btnText = btnText.replace('*options*', game.questions[game.round].answers.slice(0, 3).join(', ') + ' or ' + game.questions[game.round].answers[3] + '?');
            btnGranny.innerText = btnText;
        }
    } else {
        btnGranny.classList.remove('active');
        btnGranny.innerText = 'Waiting for granny...';
        game.extra.granny.msgDiv.classList.add('granny-msg-1');
        while (game.extra.granny.currentParagraph < grannyMsg[game.extra.granny.currentMsg].texts.length) {
            const p = document.createElement('p');
            let text = grannyMsg[game.extra.granny.currentMsg].texts[game.extra.granny.currentParagraph];
            if (text.includes('*answer*')) text = text.replace('*answer*', '<span class="bold">' + game.questions[game.round].correct_answer) + '</span>';
            p.innerHTML = text;
            if (text.length < 60) p.style.whiteSpace = 'nowrap';
            game.extra.granny.textDiv.append(dotsDiv);
            scrollContainer(grannyMessages);
            await new Promise((resolve, reject) => setTimeout(resolve, text.length*50));
            game.extra.granny.textDiv.replaceChild(p, dotsDiv);
            game.extra.granny.currentParagraph++;
            scrollContainer(grannyMessages);                
        }
        game.extra.granny.currentMsg++;
        game.extra.granny.currentParagraph = 0;
        btnGranny.innerText = grannyMsg[game.extra.granny.currentMsg].texts[game.extra.granny.currentParagraph];
        btnGranny.classList.add('active');

    }
}