// import './cards.js';
// import './madehands.js';
// import {cards, flop} from './cards.js';
// import { getMadeHandSubqualifier } from './madehands.js';

const { cards, flop, goodHand} = require('./cards.js');
const { RANK_CLASS_TO_STRING } = require('./madehands.js');
const { getQualifier } = require('./madehands.js');
const { getMadeHandSubqualifier } = require('./madehands.js');
const { isPocketPair } = require('./madehands.js');


//FROM POKER TOOLS
const SIX_MAX_OPEN = {
    'UTG': '44+, A2s+, K9s+, Q9s+, J9s+, T9s, 98s, 87s, 76s, ATo+, KJo+',
    // eslint-disable-next-line max-len
    'UTG+1': '22+, A2s+, K8s+, Q9s+, J9s+, T9s, 98s, 87s, 76s, 65s, 54s, ATo+, KTo+, QJo, JTo',
    // eslint-disable-next-line max-len
    'Cutoff': '22+, A2s+, K6s+, Q8s+, J8s+, T8s+, 97s+, 86s+, 75s+, 65s, 54s, 43s, 32s, A8o+, A5o, KTo+, QTo+, JTo, T9o, 98o',
    // eslint-disable-next-line max-len
    'Button': '22+, A2s+, K2s+, Q4s+, J6s+, T6s+, 95s+, 85s+, 74s+, 63s+, 53s+, 43s, 32s, A2o+, K7o+, Q9o+, J9o+, T9o, 98o',
    // eslint-disable-next-line max-len
    'Small Blind': '22+, A2s+, K2s+, Q3s+, J4s+, T4s+, 94s+, 84s+, 73s+, 63s+, 53s+, 43s, 32s, A2o+, K4o+, Q8o+, J9o+, T9o, 98o',
};

function validRank(qualifier, hand, flop) {
    if (qualifier === 'trips') {
        // Check for set
        if(!(flop[0].value === flop[1].value === flop[2].value)) {
            return true;
        }
    } else if (qualifier === 'pair') {
        // Check for pair
        if(isPocketPair(hand)) {
            return true;
        }
        for (const h of hand) {
            for (const f of flop) {
                if (h.value === f.value) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Function to generate all possible two-card combinations from the remaining deck
function generateRange(flop, cards) {
    const range = []
    const fullRange = [];
    // Remove the flop cards from the deck
    const remainingDeck = cards.filter(card => !flop.includes(card));

    // Generate all possible two-card combinations from the remaining deck
    for (let i = 0; i < remainingDeck.length; i++) {
        for (let j = i + 1; j < remainingDeck.length; j++) {
            const hand = [remainingDeck[i], remainingDeck[j]];
            if (goodHand(hand)) { // Only check against hands opponent would prob have
                // If the hand forms a made hand, add it to the range
                const qual = getQualifier(hand, flop);
                let rank = Object.keys(RANK_CLASS_TO_STRING).find(key => RANK_CLASS_TO_STRING[key] === qual);
                if (rank === '6' || rank === '8') { // trips or pair
                    if(!validRank(qual, hand, flop)){ //high card
                        rank = 9;
                    }
                }
                if (rank < 9 ) { // made a hand better than high card
                    const subq = getMadeHandSubqualifier(qual, hand, flop);

                    const handString = formatCards(hand);
                    range.push(handString);
                    fullRange.push({
                        hand: hand,
                        qualifier: qual,
                        subqualifier: subq || 'None'
                    });
                }
            }

        }
    }
    console.log(range);
    return fullRange;
}

function formatCards(cards) {
    return cards.map(card => `${card.value}${card.suit_char}`).join(' ');
}

function main() {
    const range = generateRange(flop, cards);

    console.log(`Flop: ${formatCards(flop)}`);
    range.forEach(item => {
        const handString = formatCards(item.hand);
        console.log(`Hand: [${handString}], Qualifier: ${item.qualifier}, Subqualifier: ${item.subqualifier || 'None'}`);
    });
}

// run directly (not connected to main call or fold html)
if (require.main === module) {
    main();
}

module.exports = {
    generateRange,
    formatCards,
};




