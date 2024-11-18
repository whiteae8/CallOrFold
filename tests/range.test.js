const {generateRange, formatCards} = require('../public/range.js');
const { cards, createCard} = require('../public/cards.js');
const {getQualifier} = require("../public/madehands");

/*
describe('Full House Test', () => {
    test('getQualifier', () => {
        let test_flop = [createCard('7', '♥', 7, 'h'), createCard('7', '♣', 7, 'c'), createCard('9', '♥', 9, 'h')];
        let test_hand = [createCard('7', '♠', 7, 's'), createCard('9', '♣', 9, 'c')];

        const qual = getQualifier(test_hand, test_flop);

        console.log(`Hand: ${formatCards(test_hand)}`);
        console.log(`Flop: ${formatCards(test_flop)}`);
        console.log(`Qualifier: ${qual}`);

        // Expected value: Full House
    });
});

describe('Straight Test', () => {
    test('getQualifier', () => {
        let test_flop = [createCard('7', '♥', 7, 'h'), createCard('8', '♣', 8, 'c'), createCard('9', '♥', 9, 'h')];
        let test_hand = [createCard('6', '♠', 6, 's'), createCard('5', '♣', 5, 'c')];

        const qual = getQualifier(test_hand, test_flop);

        console.log(`Hand: ${formatCards(test_hand)}`);
        console.log(`Flop: ${formatCards(test_flop)}`);
        console.log(`Qualifier: ${qual}`);

        // Expected value: Straight
    });
});

describe('Ace High Straight', () => {
    test('getQualifier', () => {
        let test_flop = [createCard('A', '♥', 14, 'h'), createCard('K', '♣', 13, 'c'), createCard('J', '♥', 11, 'h')];
        let test_hand = [createCard('Q', '♠', 12, 's'), createCard('T', '♣', 10, 'c')];

        const qual = getQualifier(test_hand, test_flop);

        console.log(`Hand: ${formatCards(test_hand)}`);
        console.log(`Flop: ${formatCards(test_flop)}`);
        console.log(`Qualifier: ${qual}`);

        // Expected value: Straight
    });
});

describe('Ace Low Straight', () => {
    test('getQualifier', () => {
        let test_flop = [createCard('A', '♥', 14, 'h'), createCard('2', '♣', 2, 'c'), createCard('5', '♥', 5, 'h')];
        let test_hand = [createCard('3', '♠', 3, 's'), createCard('4', '♣', 4, 'c')];

        const qual = getQualifier(test_hand, test_flop);

        console.log(`Hand: ${formatCards(test_hand)}`);
        console.log(`Flop: ${formatCards(test_flop)}`);
        console.log(`Qualifier: ${qual}`);

        // Expected value: Straight
    });
});

describe('No Cornering Check', () => {
    test('getQualifier', () => {
        let test_flop = [createCard('A', '♥', 14, 'h'), createCard('2', '♣', 2, 'c'), createCard('K', '♥', 13, 'h')];
        let test_hand = [createCard('3', '♠', 3, 's'), createCard('4', '♣', 4, 'c')];

        const qual = getQualifier(test_hand, test_flop);

        console.log(`Hand: ${formatCards(test_hand)}`);
        console.log(`Flop: ${formatCards(test_flop)}`);
        console.log(`Qualifier: ${qual}`);

        // Expected value: high card
    });
});

 */

describe('Range Generation', () => {
    test('generateRange', () => {
        let test_flop = [createCard('7', '♥', 7, 'h'), createCard('7', '♣', 7, 'c'), createCard('9', '♥', 9, 'h')];


        const range = generateRange(test_flop, cards);

        console.log(`Flop: ${formatCards(test_flop)}`);

        // Expected value: Array of hands + generate range output
        console.log(range);
    });
});

describe('Range Generation with Hero Hand', () => {
    test('generateRange', () => {
        let test_flop = [createCard('9', '♥', 9, 'h'), createCard('9', '♣', 9, 'c'), createCard('K', '♥', 13, 'h')];
        let test_hand = [createCard('10', '♥', 10, 'h'), createCard('9', '♠', 9, 's')];

        const range = generateRange(test_flop, cards, test_hand);

        console.log(`Flop: ${formatCards(test_flop)}`);
        console.log(`Hand: ${formatCards(test_hand)}`);
        console.log(range);
    });
});



