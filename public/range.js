// import './cards.js';
// import './madehands.js';
// import {cards, flop} from './cards.js';
// import { getMadeHandSubqualifier } from './madehands.js';

const { cards, flop, hand, goodHand, rankMap, reverseRankMap, num_values, values} = require('./cards.js');
const { RANK_CLASS_TO_STRING, STRING_TO_RANK_CLASS } = require('./madehands.js');
const { getQualifier } = require('./madehands.js');
const { getMadeHandSubqualifier } = require('./madehands.js');
const { isPocketPair } = require('./madehands.js');

const COMBOS_ORDERED = ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AQs', '88', 'AJs', 'AKo', 'KQs', 'ATs', 'AQo', '77', 'KJs', 'A9s', 'KTs', 'AJo', 'KQo', 'QJs', 'A8s', '66', 'QTs', 'ATo', 'K9s', 'A7s', 'KJo', 'JTs', 'A5s', 'A6s', 'KTo', 'Q9s', '55', 'A9o', 'QJo', 'A4s', 'K8s', 'A3s', 'A8o', 'K7s', 'J9s', 'QTo', 'A2s', 'Q8s', 'K9o', 'K6s', 'A7o', 'T9s', '44', 'JTo', 'K5s', 'J8s', 'A5o', 'Q7s', 'A6o', 'Q9o', 'K4s', 'T8s', 'K3s', 'K8o', 'A4o', 'Q6s', '98s', 'K7o', 'J7s', 'K2s', 'A3o', '33', 'J9o', 'Q5s', 'T7s', 'Q8o', 'T9o', 'A2o', 'K6o', 'Q4s', 'J6s', '97s', 'Q3s', 'J5s', 'K5o', '87s', 'J8o', '22', 'T6s', 'Q2s', 'Q7o', 'J4s', '96s', 'K4o', 'T8o', '86s', '76s', 'J3s', '98o', 'Q6o', 'J7o', 'K3o', 'T5s', 'T4s', 'K2o', 'J2s', '95s', 'Q5o', 'T3s', 'T7o', '85s', '65s', 'Q4o', '75s', 'J6o', 'T2s', '97o', '94s', '87o', 'Q3o', '93s', '54s', '84s', 'J5o', '64s', 'T6o', '74s', 'Q2o', '92s', 'J4o', '53s', '96o', '86o', '76o', '73s', '83s', '63s', 'J3o', 'T5o', '82s', '43s', 'J2o', 'T4o', '95o', '52s', '62s', '72s', '85o', '65o', '75o', 'T3o', '42s', '32s', 'T2o', '94o', '54o', '84o', '64o', '93o', '74o', '92o', '53o', '83o', '63o', '73o', '43o', '82o', '52o', '62o', '72o', '42o', '32o'];


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

function categorizeHands(range) {
    const pocketPairs = new Set();
    const suitedHands = new Set();
    const offsuitHands = new Set();

    range.forEach(handString => {
        const [card1, card2] = handString.split(' ');

        const rank1 = rankMap[card1[0]];
        const rank2 = rankMap[card2[0]];
        const suit1 = card1[1];
        const suit2 = card2[1];

        if (rank1 === rank2) {
            pocketPairs.add(rank1);
        } else {
            // Sort ranks in descending order
            let [highRank, lowRank] = rank1 > rank2 ? [rank1, rank2] : [rank2, rank1];

            if (suit1 === suit2) {
                suitedHands.add(`${reverseRankMap[highRank]}${reverseRankMap[lowRank]}s`);
            } else {
                offsuitHands.add(`${reverseRankMap[highRank]}${reverseRankMap[lowRank]}o`);
            }
        }
    });

    return { pocketPairs, suitedHands, offsuitHands };

}

function getPocketPairRange(pairs) {
    if (pairs.size === 0) return '';
    const sortedPairs = Array.from(pairs).sort((a, b) => b - a);
    const actualPairs = sortedPairs.map(rank => `${reverseRankMap[rank]}${reverseRankMap[rank]}`);

    const sequences = [];
    let currentSequence = [actualPairs[0]];

    for (let i = 1; i < actualPairs.length; i++) {
        const prevMain = rankMap[actualPairs[i - 1][0]];
        const currentMain = rankMap[actualPairs[i][0]];
        if (currentMain === prevMain - 1) {
            currentSequence.push(actualPairs[i]);
        } else {
            sequences.push([...currentSequence]);
            currentSequence = [actualPairs[i]];
        }
    }
    sequences.push([...currentSequence]);

    // Determine the highest num value
    const rangeParts = sequences.map(seq => {
        const startHand = seq[0];
        const endHand = seq[seq.length - 1];

        if (seq.length === 1) {
            return `${startHand}`;
        } else if (rankMap[startHand[0]] === 14) { // Up to highest pair
            return `${endHand}+`;
        } else {
            return `${endHand}-${startHand}`;
        }
    });
    return rangeParts.join(',');
}

function getSuitedOrOffsuitRange(handSet, type) {
    if (handSet.size === 0) return '';

    // Convert Set to Array and sort based on the main rank's numerical value
    const sortedHands = Array.from(handSet).sort((a, b) => {
        const mainA = a[0];
        const mainB = b[0];
        return rankMap[mainB] - rankMap[mainA] || rankMap[b[1]] - rankMap[a[1]];
    });

    // Initialize an array to hold sequences of consecutive kickers
    const sequences = [];
    let currentSequence = [sortedHands[0]];

    for (let i = 1; i < sortedHands.length; i++) {
        const prevMain = rankMap[sortedHands[i - 1][0]];
        const currentMain = rankMap[sortedHands[i][0]];
        const prevKicker = rankMap[sortedHands[i - 1][1]];
        const currentKicker = rankMap[sortedHands[i][1]];
        if (currentMain === prevMain) {
            if (currentKicker === prevKicker - 1) {
                currentSequence.push(sortedHands[i]);
            }
        } else {
            sequences.push([...currentSequence]);
            currentSequence = [sortedHands[i]];
        }
    }
    sequences.push([...currentSequence]);

    // Determine the highest kicker value for each main rank
    const rangeParts = sequences.map(seq => {
        const startHand = seq[0];
        const endHand = seq[seq.length - 1];

        if (seq.length === 1) {
            return `${startHand}`;
        } else if (rankMap[startHand[1]] === rankMap[startHand[0]] - 1) { // All kickers up to the highest possible
            return `${endHand}+`;
        } else {
            return `${endHand}-${startHand}`;
        }
    });

    return rangeParts.join(',');
}


// Main function
function generateRangeNotation(hands) {
    const { pocketPairs, suitedHands, offsuitHands } = categorizeHands(hands);

    const pocketRange = getPocketPairRange(pocketPairs);

    const suitedRange = getSuitedOrOffsuitRange(suitedHands, 's');
    const offsuitRange = getSuitedOrOffsuitRange(offsuitHands, 'o');

    const fullRangeParts = [];
    if (pocketRange) fullRangeParts.push(pocketRange);
    if (suitedRange) fullRangeParts.push(suitedRange);
    if (offsuitRange) fullRangeParts.push(offsuitRange);

    return fullRangeParts.join(',');
}

// Function to generate all possible two-card combinations from the remaining deck
function generateRange(flop, cards, hero_hand = []) {
    const range = []
    const fullRange = [];
    // Remove the flop cards from the deck
    const remainingDeck = cards.filter(card =>     //includes doesn't work bc different object in memory
        !flop.some(flopCard => flopCard.suit_char === card.suit_char && flopCard.value === card.value) &&
        !hero_hand.some(handCard => handCard.suit_char === card.suit_char && handCard.value === card.value)
    );

    // Generate all possible two-card combinations from the remaining deck
    for (let i = 0; i < remainingDeck.length; i++) {
        for (let j = i + 1; j < remainingDeck.length; j++) {
            const hand = [remainingDeck[i], remainingDeck[j]];
            if (goodHand(hand)) { // Only check against hands opponent would prob have
                // If the hand forms a made hand, add it to the range
                const qual = getQualifier(hand, flop);
                let handRank = STRING_TO_RANK_CLASS[qual];
                if (handRank === 6 || handRank === 8) { // trips or pair --> make sure it's not just on the flop
                    if(!validRank(qual, hand, flop)){ //high card
                        handRank = 9;
                    }
                }
                const handString = formatCards(hand);
                if (handRank === 9) {
                    if (rankMap[handString[0]] < 10) { //first card ranking
                        handRank = 10;
                    }
                    else if (rankMap[handString[3]] < 9) { //second card ranking
                        if (rankMap[handString[0]] !== 14){
                            handRank = 10;
                        }
                    }
                }
                if (handRank < 10) { // made a hand better than high card --> keep UTG high card for now
                    const subq = getMadeHandSubqualifier(qual, hand, flop);

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
    range_notation = generateRangeNotation(range);
    return range_notation;
}

function formatCards(cards) {
    const sortedCards = cards.sort((a, b) => rankMap[b.value] - rankMap[a.value]);
    return sortedCards.map(card => `${card.value}${card.suit_char}`).join(' ');
}

function main() {
    const range = generateRange(flop, cards);

    console.log(`Flop: ${formatCards(flop)}`);
    console.log(`Range: ${range}`);
}



// run directly (not connected to main call or fold html)
if (require.main === module) {
    main();
}

module.exports = {
    generateRange,
    formatCards
};




