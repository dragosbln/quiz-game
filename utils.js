const mixArray = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let j = i + Math.floor(Math.random() * (arr.length - i));
        const aux = arr[i];
        arr[i] = arr[j];
        arr[j] = aux;
    }
    return arr;
}

const decodeString = (str) => {
    return str.replace(/\&\#039;/g, "'")
        .replace(/\&quot;/g, '"')
        .replace(/\&deg;/g, '°')
        .replace(/\&ldquo;/g, '“')
        .replace(/\&rdquo;/g, '”')
        .replace(/\&amp;/g, '&')
        .replace(/\&.+;/g, '?')
}

const scrollContainer = (container) => {
    scrollHeight = Math.max(container.scrollHeight, container.clientHeight);
    container.scrollTop = scrollHeight - container.clientHeight;
}

const grannyMsg = [
    {
        from: 'you',
        texts: [
            'Hi, Granny! I need your help!',
            'Yo yo oy'
        ]
    },
    {
        from: 'granny',
        texts: [
            'Hello, Draling!',
            'Did you eat the zacusă I sent you last week?'
        ]
    },
    {
        from: 'you',
        texts: [
            'Granny, I am on National Television...'
        ]
    },
    {
        from: 'granny',
        texts: [
            'Oh, you are on Antena3?'
        ]
    },
    {
        from: 'you',
        texts: [
            'No, granny... Listen, I need your help with this question:',
            '*question*',
            '*options*'
        ]
    },
    {
        from: 'granny',
        texts: [
            'Oh, I think I think I heard Virgil Ianțu talking about that. The answer is *answer*'
        ]
    },
    {
        from: 'you',
        texts: [
            'Thanks, Granny!'
        ]
    },
    {
        from: 'granny',
        texts: [
            "You're welcome, darling!",
            "Today I am making sarmale.",
            "I will send you tomorrow with that handsome bus driver"
        ]
    },
    {
        from: 'you',
        texts: [
            'Bye, Granny!'
        ]
    }
]

const dotsDiv = document.createElement('div');
[1, 2, 3].forEach(() => {
    const span = document.createElement('span');
    span.classList.add('dot');
    dotsDiv.append(span);
});

const congradulations = [
    'YPPIIEE YA YOOO!',
    'FANTASMAGHORIC!',
    'EXTRACEPTIONAL!',
    'BRILLIAMAZING!',
    'INCREDIFUL!',
]