// Generate an array of all possible card combinations
const cards = [];
const suits = ['♠', '♣', '♦', '♥'];
const suit_chars = ['s', 'c', 'd', 'h'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const num_values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

function createCard(value, suit, num_value, suit_char) {
    return { value: value, suit: suit, num_value: num_value, suit_char: suit_char };
}

for (let j = 0; j < suits.length; j++) {
    for (let i = 0; i < values.length; i++) {
        cards.push(createCard(values[i], suits[j], num_values[i], suit_chars[j]));
    }
}
// Shuffle the array of cards
cards.sort(() => Math.random() - 0.5);

function goodHand(hand) {
    let c1 = hand[0];
    let c2 = hand[1];
    if (c1.value === c2.value) {
        return true;
    } else if (c1.suit === c2.suit) {
        return true;
    } else if (c1.num_value === 14 || c2.num_value === 14) {
        return true;
    } else if (c1.num_value === 13 && c2.num_value > 5 || c2.num_value === 13 && c1.num_value > 5) {
        return true;
    } else if (c1.num_value > 9 && c2.num_value > 9) {
        return true;
    } else {
        return false;
    }
}

let hand = cards.slice(0, 2)
const flop = cards.slice(2,5);

async function executePokerStove(hand, flop) {
    let output = '';
    const executablePath = './pokerstove/build/bin/ps-eval';
    let handString = hand[0].value + hand[0].suit_char + hand[1].value + hand[1].suit_char;
    let boardString = flop[0].value + flop[0].suit_char + flop[1].value + flop[1].suit_char + flop[2].value + flop[2].suit_char;
    // Construct the command
    const command = `${executablePath} ${handString} --board ${boardString}`;

    const response = await fetch('/execute-pokerstove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({command})
    });
    const data = await response.json();
    output = data.output;
    return parseOutput(output);
}


async function testExecutePokerStove() {
    try {
        const eq = await executePokerStove(hand, flop);
        console.log('Equity:', eq);
    } catch (error) {
        console.error('Error:', error);
    }
}

await testExecutePokerStove();
function parseOutput(output) {
    // Parse the output and extract the relevant information
    // Example: "The hand AcAs has 80.2704 % equity (852045 7001 0 0)"
    // Extract the equity percentage
    const regex = /The hand (\S+) has (\S+) % equity/;
    const matches = output.match(regex);
    if (matches && matches.length >= 3) {
        const hand = matches[1];
        const equity = parseFloat(matches[2]);
        return { hand: hand, equity: equity };
    } else {
        return null;
    }
}

function displayOutput(output) {
    if (output) {
        console.log(`The hand ${output.hand} has ${output.equity.toFixed(4)} % equity`);
        // Display the output in your HTML or perform any other action
    } else {
        console.error('Failed to parse output');
    }
}

//equity(hand, flop);

function callorFold(pot, bet, eq) {

        //TODO consider cases where hand doesn't need to improve, e.g. AA, two pair
        //or like if flush draw but you do NOT have the right suit, then FOLD

    let callOdds = potOdds(pot, bet)
    let extractMoney = impliedOdds(pot, bet, eq)
    if ((eq / 100) >= callOdds || extractMoney < .5 * (pot + bet)) {
        return true
    } else {
        return false
    }
}

async function checkAnswer() {
        //const gameLog = document.getElementById('game-log');

    const eq = await executePokerStove(hand, flop);

    if (callorFold(pot, bet, eq)) {
        console.log("CALL");
    } else {
        console.log("FOLD");
    }
}

await checkAnswer();


//TODO make use of these or delete


function flushDraw(c1, c2, f1, f2, f3) {
    const suits = [c1.suit, c2.suit, f1.suit, f2.suit, f3.suit];
    const suitedCardsCount = suits.filter(suit => suit === c1.suit).length;
    return suited(c1, c2) && suitedCardsCount === 4;
}


function openStraightDraw(c1, c2, f1, f2, f3) {
    // Combine the card values into an array
    const cardValues = [c1.num_value, c2.num_value, f1.num_value, f2.num_value, f3.num_value];
    // Sort the array in ascending order
    if (cardValues[4] === 13) {
        cardValues.push(1)
    }
    //TODO not sorting correctly
    cardValues.sort((a, b) => a - b);

    for (let i = 0; i < cardValues.length - 3; i++) {
        if (cardValues[i + 1] - cardValues[i] === 1 &&
            cardValues[i + 2] - cardValues[i + 1] === 1 &&
            cardValues[i + 3] - cardValues[i + 2] === 1) {
            return true; // Found four consecutive values
        }
    }

    return false;
}

function twoPairToFullHouse(c1, c2, f1, f2, f3) {
    return false;
}

function gutshot(c1, c2, f1, f2, f3) {
    return false;
}

function overcardToOverPair(c1, c2, f1, f2, f3) {
    const highestFlopValue = Math.max(f1.num_value, f2.num_value, f3.num_value);
    return (c1.num_value > highestFlopValue && c2.num_value <= highestFlopValue) ||
        (c1.num_value <= highestFlopValue && c2.num_value > highestFlopValue);
}

function twoOvercardsToOverPair(c1, c2, f1, f2, f3) {
    const highestFlopValue = Math.max(f1.num_value, f2.num_value, f3.num_value);
    return c1.num_value > highestFlopValue && c2.num_value > highestFlopValue;
}

function numOuts(flop, hand){
    const c1 = hand[0];
    const c2 = hand[1];
    const f1 = flop[0];
    const f2 = flop[1];
    const f3 = flop[2];

    if (flushDraw(c1, c2, f1, f2, f3)){
        return 9;
    }
    else if (openStraightDraw(c1, c2, f1, f2, f3)) {
        return 8;
    }
    //assuming nothing on the board so u think single pair will win pot
    else if (twoOvercardsToOverPair(c1, c2, f1, f2, f3)) {
        return 6;
        //README: OVERCARDS TO OVER PAIR
    }
        //else if (gutshot(c1, c2, f1, f2, f3)) {
        // return 4;
        //  }
        // else if (twoPairtoFullHouse(...){}
    // pair up overcard to win
    else if (overcardToOverPair(c1, c2, f1, f2, f3)) {
        return 3;
    }
    //need 3 of a kind to win (?) ***Smaller pocket pair
    else if (pocketPairToSet(c1, c2)){
        return 2;
    }
    return 0;
}

const outs = numOuts(flop, hand);



//sklansky dollars = [ (total pot size) * (equity) ] - last call amount
//expected value
function sklanksyDollars(){
    return pot * equity - bet;
}


