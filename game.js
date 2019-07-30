const cellElems = document.querySelectorAll('.game-cell');
const DIM = 4;

class Game2048 {
    constructor(window, gameContainer) {
        this.window = window;
        this.gameContainer = gameContainer;
        this.boxes = [];
        this.currentGeneratedId = 0;
        this.play = true;
        this.gameMatrix = [
            [{ top: 2, left: 2 }, { top: 2, left: 26.5 }, { top: 2, left: 51 }, { top: 2, left: 75.5 }],
            [{ top: 26.5, left: 2 }, { top: 26.5, left: 26.5 }, { top: 26.5, left: 51 }, { top: 26.5, left: 75.5 }],
            [{ top: 51, left: 2 }, { top: 51, left: 26.5 }, { top: 51, left: 51 }, { top: 51, left: 75.5 }],
            [{ top: 75.5, left: 2 }, { top: 75.5, left: 26.5 }, { top: 75.5, left: 51 }, { top: 75.5, left: 75.5 }]
        ];

        let boundingClientRect = gameContainer.getBoundingClientRect(),
            containerWidth = boundingClientRect.bottom - boundingClientRect.top,
            containerHeight = boundingClientRect.right - boundingClientRect.left;

        for (let i = 0; i < this.gameMatrix.length; i++) {
            for (let j = 0; j < this.gameMatrix[i].length; j++) {
                this.gameMatrix[i][j] = {
                    top: this.gameMatrix[i][j].top / 100 * containerHeight,
                    left: this.gameMatrix[i][j].left / 100 * containerWidth,
                    val: 0,
                    boxId: [],
                    newBox: false,
                    merged: false
                }
            }
        }
    }

    _createBox = (top, left, val) => {
        const box = window.document.createElement('div');
        box.classList.add('game-box');
        box.style.top = top + 'px';
        box.style.left = left + 'px';
        box.innerText = val;
        box.id = ++this.currentGeneratedId;

        return box;
    }


    _genBox(i, j, val) {
        const cell = this.gameMatrix[i][j];

        const box = this._createBox(cell.top, cell.left, val);
        this.boxes.push(box);

        cell.newBox = true;
        cell.val = 2;
        cell.boxId.push(box.id);
    }

    _generateRandom = () => {
        let i = Math.floor(Math.random() * 4),
            j = Math.floor(Math.random() * 4);
        while (this.gameMatrix[i][j].val) {
            i = Math.floor(Math.random() * 4);
            j = Math.floor(Math.random() * 4);
        }
        const cell = this.gameMatrix[i][j];

        const box = this._createBox(cell.top, cell.left, 2);
        this.boxes.push(box);

        cell.newBox = true;
        cell.val = 2;
        cell.boxId = [box.id];
    }

    updateDisplay = async () => {
        let newBox = [];
        this.play = false;
        for (let i = 0; i < this.gameMatrix.length; i++) {
            for (let j = 0; j < this.gameMatrix[i].length; j++) {
                if (!this.gameMatrix[i][j].val) continue;
                const cell = this.gameMatrix[i][j];

                if (cell.boxId.length === 2) {
                    //merge
                    const box1 = this.boxes.find(box => box.id === cell.boxId[0]);
                    const box2 = this.boxes.find(box => box.id === cell.boxId[1]);



                    const translateByX1 = cell.left - +(box1.style.left.replace('px', ''));
                    const translateByY1 = cell.top - +(box1.style.top.replace('px', ''));

                    const translateByX2 = cell.left - +(box2.style.left.replace('px', ''));
                    const translateByY2 = cell.top - +(box2.style.top.replace('px', ''));

                    box1.addEventListener('transitionend', () => {
                        //replaces boxes to be merged with a new box
                        this.boxes.splice(this.boxes.indexOf(box1), 1);
                        this.boxes.splice(this.boxes.indexOf(box2), 1);
                        this.gameContainer.removeChild(box1);
                        this.gameContainer.removeChild(box2);
                        const newBox = this._createBox(cell.top, cell.left, cell.val);
                        this.boxes.push(newBox);
                        this.gameContainer.append(newBox);
                        console.log('merge boxes: ' + cell.boxId)
                        cell.boxId = [newBox.id];
                        cell.merged = false;
                    })
                    box1.style.transform = `translate(${translateByX1}px, ${translateByY1}px)`;
                    box2.style.transform = `translate(${translateByX2}px, ${translateByY2}px)`;

                } else {
                    const currentBox = this.boxes.find(box => cell.boxId.includes(box.id));

                    if (cell.newBox) {
                        //generated a box
                        newBox.push(currentBox);
                        cell.newBox = false;
                        continue;
                    }
                    if (currentBox.style.top === cell.top + 'px' && currentBox.style.left === cell.left + 'px') continue;

                    const translateByX = cell.left - +(currentBox.style.left.replace('px', ''));
                    const translateByY = cell.top - +(currentBox.style.top.replace('px', ''));

                    const updatePos = () => {
                        currentBox.style.top = cell.top + 'px';
                        currentBox.style.left = cell.left + 'px';
                        currentBox.style.transform = `none`;
                        currentBox.removeEventListener('transitionend', updatePos)
                    }

                    currentBox.addEventListener('transitionend', updatePos)

                    currentBox.style.transform = `translate(${translateByX}px, ${translateByY}px)`;
                }

            }
        }
        //wait for transitions to finnish and boxes to be replaced
        await new Promise(res => setTimeout(res, 100))
        newBox.forEach(box => this.gameContainer.append(box))
        this.play = true;

    }

    up = () => {
        if (!this.play) {
            console.log('exited')
            return;
        }
        let moved = false;
        for (let i = 0; i < this.gameMatrix.length; i++) {
            for (let j = 0; j < this.gameMatrix[i].length; j++) {
                const currentCell = this.gameMatrix[i][j];
                if (currentCell.val) {

                    let currentVal = currentCell.val;
                    let currenId = currentCell.boxId[0];

                    let iFinal = i - 1;
                    while (iFinal >= 0 && !this.gameMatrix[iFinal][j].val) iFinal--;
                    if (iFinal === i - 1 && (iFinal < 0 || this.gameMatrix[iFinal][j].val !== currentVal)) {
                        //no move
                        continue;
                    } else {
                        //empty currentCell
                        currentCell.val = 0;
                        currentCell.boxId = [];

                        moved = true;

                        if (iFinal >= 0 && this.gameMatrix[iFinal][j].val === currentVal && !this.gameMatrix[iFinal][j].merged) {
                            //merge
                            this.gameMatrix[iFinal][j].val += currentVal;
                            this.gameMatrix[iFinal][j].boxId.push(currenId)
                            this.gameMatrix[iFinal][j].merged = true;
                        } else {
                            //just move
                            this.gameMatrix[iFinal + 1][j].val = currentVal;
                            this.gameMatrix[iFinal + 1][j].boxId = [currenId];
                        }
                    }
                }
            }
        }

        if (moved) {
            this._generateRandom();
            this.updateDisplay();
            // showMat(this.gameMatrix, this.boxes)

        }

    }

    down = () => {
        if (!this.play) return;
        let moved = false;
        for (let i = this.gameMatrix.length - 1; i >= 0; i--) {
            for (let j = this.gameMatrix[i].length - 1; j >= 0; j--) {
                const currentCell = this.gameMatrix[i][j];
                if (currentCell.val) {

                    let currentVal = currentCell.val;
                    let currenId = currentCell.boxId[0];

                    let iFinal = i + 1;
                    while (iFinal < DIM && !this.gameMatrix[iFinal][j].val) iFinal++;
                    if (iFinal === i + 1 && (iFinal >= DIM || this.gameMatrix[iFinal][j].val !== currentVal)) {
                        //no move
                        continue;
                    } else {
                        //empty current currentCell
                        currentCell.val = 0;
                        currentCell.boxId = [];

                        moved = true;

                        if (iFinal < DIM && this.gameMatrix[iFinal][j].val === currentVal && !this.gameMatrix[iFinal][j].merged) {
                            //merge
                            this.gameMatrix[iFinal][j].val += currentVal;
                            this.gameMatrix[iFinal][j].boxId.push(currenId)
                            this.gameMatrix[iFinal][j].merged = true;
                        } else {
                            this.gameMatrix[iFinal - 1][j].val = currentVal;
                            this.gameMatrix[iFinal - 1][j].boxId = [currenId];
                        }
                    }
                }
            }
        }


        if (moved) {
            this._generateRandom();
            this.updateDisplay();

        }
    }

    left = () => {
        if (!this.play) return;
        let moved = false;
        for (let i = 0; i < this.gameMatrix.length; i++) {
            for (let j = 0; j < this.gameMatrix[i].length; j++) {
                const currentCell = this.gameMatrix[i][j];
                if (currentCell.val) {

                    let currentVal = currentCell.val;
                    let currenId = currentCell.boxId[0];

                    let jFinal = j - 1;
                    while (jFinal >= 0 && !this.gameMatrix[i][jFinal].val) jFinal--;
                    if (jFinal === j - 1 && (jFinal < 0 || this.gameMatrix[i][jFinal].val !== currentVal)) {
                        //no move
                        continue;
                    } else {
                        //empty current currentCell
                        currentCell.val = 0;
                        currentCell.boxId = [];

                        moved = true;

                        if (jFinal >= 0 && this.gameMatrix[i][jFinal].val === currentVal && !this.gameMatrix[i][jFinal].merged) {
                            //merge
                            this.gameMatrix[i][jFinal].val += currentVal;
                            this.gameMatrix[i][jFinal].boxId.push(currenId)
                            this.gameMatrix[i][jFinal].merged = true;
                        } else {
                            this.gameMatrix[i][jFinal + 1].val = currentVal;
                            this.gameMatrix[i][jFinal + 1].boxId = [currenId];
                        }
                    }
                }
            }
        }

        if (moved) {
            this._generateRandom();
            this.updateDisplay();

        }
    }

    right = () => {
        if (!this.play) return;
        let moved = false;
        for (let i = this.gameMatrix.length - 1; i >= 0; i--) {
            for (let j = this.gameMatrix[i].length - 1; j >= 0; j--) {
                const currentCell = this.gameMatrix[i][j];
                if (currentCell.val) {

                    let currentVal = currentCell.val;
                    let currenId = currentCell.boxId[0];

                    let jFinal = j + 1;
                    while (jFinal < DIM && !this.gameMatrix[i][jFinal].val) jFinal++;
                    if (jFinal === j + 1 && (jFinal >= DIM || this.gameMatrix[i][jFinal].val !== currentVal)) {
                        //no move
                        continue;
                    } else {
                        //empty current currentCell
                        currentCell.val = 0;
                        currentCell.boxId = [];

                        moved = true;

                        if (jFinal < DIM && this.gameMatrix[i][jFinal].val === currentVal && !this.gameMatrix[i][jFinal].merged) {
                            //merge
                            this.gameMatrix[i][jFinal].val += currentVal;
                            this.gameMatrix[i][jFinal].boxId.push(currenId)
                            this.gameMatrix[i][jFinal].merged = true;
                        } else {
                            this.gameMatrix[i][jFinal - 1].val = currentVal;
                            this.gameMatrix[i][jFinal - 1].boxId = [currenId];
                        }
                    }
                }
            }
        }


        if (moved) {
            this._generateRandom();
            this.updateDisplay();
            // showMat(this.gameMatrix, this.boxes);

        }
    }
}

const showMat = async (mat, boxes) => {

    console.log('=====================================')
    for (let i = 0; i < mat.length; i++) {
        let str = '';
        mat[i].forEach(el => {
            str += el.val + ' ';
        })
        console.log('%c' + str, "font-size: 16pt");
    }
    console.log('=====================================')
    for (let i = 0; i < mat.length; i++) {
        let str = '';
        mat[i].forEach(el => {
            str += el.boxId + '|';
        })
        console.log('%c' + str, "font-size: 16pt");
    }
    let strBoxes = ''
    boxes.forEach(box => strBoxes += box.id + ' ');
    console.log(strBoxes);
    console.log('=====================================')
}


const gameMain = document.querySelector('.game');

const startGame = () => {

    const gm = new Game2048(window, gameMain);
    gm._generateRandom();
    gm._generateRandom();
    gm.updateDisplay();

    onkeypress = (ev) => {
        switch (ev.code) {
            case 'KeyW':
                gm.up();
                break;
            case 'KeyS':
                gm.down()
                break;
            case 'KeyA':
                gm.left();
                break;
            case 'KeyD':
                gm.right();
                break;
            default:
        }
    }
}

