
function createCard(value, suit, num_value, suit_char) {
    return { value: value, suit: suit, num_value: num_value, suit_char: suit_char };
}

function updateCardElement(cardElement, card) {
    let val = card.value === 'T' ? '10'  : card.value;
    cardElement.textContent = val + card.suit;

    if (card.suit_char === 'h' || card.suit_char === 'd') {
        cardElement.style.color = 'red';
    } else {
        cardElement.style.color = 'black';
    }
}

// Generate an array of all possible card combinations
const cards = [];
const suits = ['♠', '♣', '♦', '♥'];
const suit_chars = ['s', 'c', 'd', 'h'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const num_values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

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
    } else if (c1.suit === c2.suit && Math.abs(c1.num_value - c2.num_value) === 1) {
        return true; //SUITED CONNECTORS
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

let hand = cards.slice(0, 2);
//TODO cards.slice doesnt take hand out
let cardsDrawn = 4;

while (!goodHand(hand)) {
    hand = cards.slice(cardsDrawn, cardsDrawn + 2);
    //oppHand = cards.slice(cardsDrawn + 2, cardsDrawn + 4);
    cardsDrawn += 4;
    // 52 - 43 = hero hand, villain hand, table, 52 - 47 = table
    if (cardsDrawn > 47 || !goodHand(hand) && cardsDrawn > 43) {
        cards.sort(() => Math.random() - 0.5); //reshuffle
        cardsDrawn = 0
    }
}

let flop = cards.slice(cardsDrawn, cardsDrawn + 3);

/*
HTML CODE

updateCardElement(document.getElementById('c1'), hand[0]);
updateCardElement(document.getElementById('c2'), hand[1]);
updateCardElement(document.getElementById('f1'), flop[0]);
updateCardElement(document.getElementById('f2'), flop[1]);
updateCardElement(document.getElementById('f3'), flop[2]);

export { flop, hand, cards };
*/

module.exports = { cards, flop, hand, createCard, goodHand}; // TEST CODE


