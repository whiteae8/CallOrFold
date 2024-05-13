
import './cards.js';
import { flop, hand } from './cards.js';


// Define amounts as constants for now
const potAmount = 6;
const playerA = { name: 'Player A', balance: 100, action: 'Bets', amount: 3 };
//const playerB = { name: 'Player B', balance: 100, action: 'Calls', amount: 2 };
//const playerC = { name: 'Player C', balance: 100, action: 'Raises to', amount: 5 };
const pot = potAmount + playerA.amount; // + playerB.amount + playerC.amount
const bet = Math.max(playerA.amount); // Math.max(playerA.amount, playerB.amount , playerC.amount)

// Function to update the game log
function updateGameLog() {
    const gameLog = document.getElementById('game-log');
    gameLog.innerHTML = `Pot: $${potAmount}<br>`;
    gameLog.innerHTML += `${playerA.name} ($${playerA.balance}): ${playerA.action} $${playerA.amount}<br>`;
    //gameLog.innerHTML += `${playerB.name} ($${playerB.balance}): ${playerB.action} $${playerB.amount}<br>`;
    //gameLog.innerHTML += `${playerC.name} ($${playerC.balance}): ${playerC.action} $${playerC.amount}<br>`;
    gameLog.innerHTML += `Final Pot: $${pot}<br>`;
    gameLog.innerHTML += `To Call: $${bet}<br>`;
}

// Call the function to update the game log
updateGameLog();


function potOdds(pot, bet) {
    return bet / (pot + bet);
}

// bet / (2*bet (opp bet + ur bet + pot (before bet) + x) = equity
function impliedOdds(pot, bet, equity) {
    return bet/(equity) - (bet + pot); //consider 2* bet ?
}


//Calculate Equity

// true for call, false for fold
function callorFold(pot, bet, eq) {

    let callOdds = potOdds(pot, bet)
    let extractMoney = impliedOdds(pot, bet, eq)
    if ((eq / 100) >= callOdds || extractMoney < .5 * (pot + bet)) {
        return true
    } else {
        return false
    }
}

async function executePokerStove(hand, flop) {
    let output = '';
    const executablePath = './pokerstove/build/bin/ps-eval';
    let handString = hand[0].value + hand[0].suit_char + hand[1].value + hand[1].suit_char;
    let boardString = flop[0].value + flop[0].suit_char + flop[1].value + flop[1].suit_char + flop[2].value + flop[2].suit_char;
    // Construct the command
    const command = `${executablePath} ${handString} --board ${boardString}`;

    const response = await fetch('http://localhost:63342/execute-pokerstove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
    });
    const data = await response.json();
    output = data.output;
    return parseOutput(output);
}

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


async function handleCallClick() {
    await checkAnswer('Call');
    disableButtons();
}

async function handleFoldClick() {
    await checkAnswer('Fold');
    disableButtons();
}

function disableButtons() {
    let callButton = document.getElementById("call");
    let foldButton = document.getElementById("fold");

    callButton.removeEventListener('click', handleCallClick);
    foldButton.removeEventListener('click', handleFoldClick);

    callButton.disabled = true;  //visual feedback (idk)
    foldButton.disabled = true;
}

document.getElementById("call").addEventListener('click', handleCallClick);
document.getElementById("fold").addEventListener('click', handleFoldClick);

// Function to handle the logic after clicking call or fold
async function checkAnswer(value) {
    const gameLog = document.getElementById('game-log');

    try {
        const eq = await executePokerStove(hand, flop);
        if (!eq) {
            throw new Error('No equity returned from executePokerStove');
        }

        if (callorFold(pot, bet, eq.equity)) {
            gameLog.innerHTML += `CALL - NOTE EQUITY IS NOT ACCURATE AT THIS TIME<br>`;
        } else {
            gameLog.innerHTML += `FOLD - NOTE EQUITY IS NOT ACCURATE AT THIS TIME<br>`;
        }

        let potOddsPercentage = (potOdds(pot, bet) * 100).toFixed(2) + '%';

        gameLog.innerHTML += `<br>You Chose: ${value} <br>`;
        gameLog.innerHTML += `Pot Odds: ${potOddsPercentage} <br>`;
        gameLog.innerHTML += `Equity: ${eq.equity.toFixed(2) + '%'} <br>`;
    } catch (error) {
        console.error('Error in checkAnswer:', error);
        gameLog.innerHTML += `Error: ${error.message}<br>`;
    }
}


