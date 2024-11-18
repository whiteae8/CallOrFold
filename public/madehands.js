//import './cards.js';
//import { flop, hand } from './cards.js';
const { flop, hand } = require('./cards.js');

const MAX_STRAIGHT_FLUSH = 10;
const MAX_FOUR_OF_A_KIND = 166;
const MAX_FULL_HOUSE = 322;
const MAX_FLUSH = 1599;
const MAX_STRAIGHT = 1609;
const MAX_THREE_OF_A_KIND = 2467;
const MAX_TWO_PAIR = 3325;
const MAX_PAIR = 6185;
const MAX_HIGH_CARD = 7462;

const MAX_TO_RANK_CLASS = {
    10: 1,
    166: 2,
    322: 3,
    1599: 4,
    1609: 5,
    2467: 6,
    3325: 7,
    6185: 8,
    7462: 9,
};

const RANK_CLASS_TO_STRING = {
    1: 'straightflush',
    2: 'quads',
    3: 'fullhouse',
    4: 'flush',
    5: 'straight',
    6: 'trips',
    7: 'twopair',
    8: 'pair',
    9: 'highcard',
};

// Create a reverse mapping for efficient lookups
const STRING_TO_RANK_CLASS = {};
for (const [key, value] of Object.entries(RANK_CLASS_TO_STRING)) {
    STRING_TO_RANK_CLASS[value] = parseInt(key, 10);
}

function numSuits(board) {
    const uniqueSuits = new Set();
    // Add each card's suit to the Set
    for (const card of board) {
        uniqueSuits.add(card.suit_char);
    }

    return uniqueSuits.size;
}


const scoreToString = function(score) {
    if (score >= 0 && score <= MAX_STRAIGHT_FLUSH) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_STRAIGHT_FLUSH]];
    } else if (score <= MAX_FOUR_OF_A_KIND) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_FOUR_OF_A_KIND]];
    } else if (score <= MAX_FULL_HOUSE) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_FULL_HOUSE]];
    } else if (score <= MAX_FLUSH) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_FLUSH]];
    } else if (score <= MAX_STRAIGHT) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_STRAIGHT]];
    } else if (score <= MAX_THREE_OF_A_KIND) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_THREE_OF_A_KIND]];
    } else if (score <= MAX_TWO_PAIR) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_TWO_PAIR]];
    } else if (score <= MAX_PAIR) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_PAIR]];
    } else if (score <= MAX_HIGH_CARD) {
        return RANK_CLASS_TO_STRING[MAX_TO_RANK_CLASS[MAX_HIGH_CARD]];
    }
};

const isStraightFlush = function(board) {
    return isStraight(board) && isFlush(board);
};

const isQuads = function(board) {
    const rankCounts = {};

    for (const card of board) {
        const rank = card.num_value;
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        // Check for quads
        if (rankCounts[rank] === 4) {
            return true;
        }
    }
    return false;
};

const isFullHouse = function(board) {
    if (!isTrips(board)) {
        return false;
    } else if (isQuads(board)) {
        return false;
    }
    const uniqueValues = new Set();
    // Add each card's suit to the Set
    for (const card of board) {
        uniqueValues.add(card.num_value);
    }

    return uniqueValues.size === 2; // 3 of a kind + only 2 dif numbers = full house

};

const isFlush = function(board) {
    return numSuits(board) === 1;
};

const isStraight = function(cards) {
    // Extract numerical values and sort them
    let values = cards.map(card => card.num_value).sort((a, b) => a - b);

    // Special case for Ace (14) that can also be used as 1
    const hasAce = values.includes(14);
    if (hasAce) {
        // Add Ace as 1 at the start of the sorted array for checking low straight
        values = [1].concat(values.slice(0, -1)); // Remove high Ace and add low Ace
    }

    // Check if the values are consecutive
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] - values[i] !== 1) {
            // If not consecutive, check the high Ace straight
            if (hasAce && i === 0 && values.slice(1).every((val, idx, arr) => idx === 0 || val - arr[idx - 1] === 1)) {
                return true; // Special case for straight with high Ace
            }
            return false;
        }
    }

    return true; // If all are consecutive, it's a straight
};

const isTrips = function(board) {
    const rankCounts = {};
    // Count occurrences of each rank
    for (const card of board) {
        const rank = card.num_value;
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;

        if (rankCounts[rank] === 3) {
            return true;  // Return immediately if trips is found
        }
    }
    return false;
};

const isTwoPair = function(board) {
    return false;
};

const isPair = function(board) {
    const rankCounts = {};
    // Count occurrences of each rank
    for (const card of board) {
        const rank = card.num_value;
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;

        if (rankCounts[rank] === 2) {
            return true;  // Return immediately if pair is found
        }
    }
    return false;
};



const isPocketPair = function(hand) {
    return hand[0].num_value ===
        hand[1].num_value;
};

const isOvercards = function(hand, flop) {
    const minHand = Math.min(...hand.map(card => card.num_value));

    const maxBoard = Math.max(...flop.map(card => card.num_value));

    return minHand > maxBoard;
};


const most = function(array) {
    const count = {};
    for (const x of array) {
        count[x] = (count[x] || 0) + 1;
    }

    let most = 0;
    let mostKey = -1;
    for (const k in count) {
        if (count[k] > most) {
            most = count[k];
            mostKey = k;
        }
    }
    return [Number(mostKey), most];
};

const getPairedCardRank = function(cards) {
    return most(cards.map(card => card.num_value))[0];
};

const getFlushCount = function(cards) {
    return most(cards.map(card => card.suit_char))[1];
};

const getStraightDraw = function(cards) {
    // Map the cards to their numerical rank values
    cards = cards.map(card => card.num_value);

    // Add low ace (1) if there is an Ace to handle Ace-low straights
    if (cards.indexOf(14) >= 0) {
        cards.push(1); // Add 1 for Ace as low
    }

    // Sort cards by rank
    cards.sort((a, b) => a - b);

    let pattern = '';
    for (let i = 0; i < cards.length - 1; i++) {
        if (cards[i + 1] - cards[i] === 0) {
            continue; // Skip duplicates
        } else if (cards[i + 1] - cards[i] > 1) {
            // For gaps larger than one rank, add placeholder '9'
            pattern += '9';
        } else {
            pattern += (cards[i + 1] - cards[i]).toString();
        }
    }

    const gutshotPatterns = ['211', '121', '112'];
    if (pattern.includes('1111')) {
        return 'straight';
    } else if (pattern.includes('111') || pattern.includes('2112')) {
        // Check for Ace-low straight ('1' at the start or end of the pattern)
        if ((pattern.startsWith('111') && cards[0] === 1) ||
            (pattern.endsWith('111') && cards[cards.length - 1] === 14)) {
            return 'gutshot';
        }
        return 'oesd'; // Open-ended straight draw
    } else if (gutshotPatterns.some(x => pattern.includes(x))) {
        return 'gutshot';
    } else {
        return 'none';
    }
};

function getMadeHandSubqualifier(qualifier, hand, flop) {

    qualifier = getQualifier(hand, flop);

    if (qualifier === 'trips') {
        if (isPocketPair(hand)) {
            return 'set';
        }
    } else if (qualifier === 'pair') {
        const lowBoard = flop.every(x => hand[0].num_value > x.num_value);
        if (isPocketPair(hand) && lowBoard) {
            return 'overpair';
        } else {
            const pairRank = getPairedCardRank(hand.concat(flop));
            const pairValue = flop.filter(x => x.num_value > pairRank).length;
            if (pairValue === 0) {
                return 'toppair';
            } else if (pairValue === 1) {
                return 'secondpair';
            } else {
                return 'weakpair';
            }
        }
    } else if (qualifier === 'highcard') {
        const ranksList = hand.concat(flop).map(card => card.num_value);
        if (Math.max(...ranksList) === 14) {
            return 'acehigh';
        }
    }
    return 'none';
}

function getQualifier(hand, flop) {
    if (isStraightFlush(hand.concat(flop))) return scoreToString(MAX_STRAIGHT_FLUSH);
    if (isQuads(hand.concat(flop))) return scoreToString(MAX_FOUR_OF_A_KIND);
    if (isFullHouse(hand.concat(flop))) return scoreToString(MAX_FULL_HOUSE);
    if (isFlush(hand.concat(flop))) return scoreToString(MAX_FLUSH);
    if (isStraight(hand.concat(flop))) return scoreToString(MAX_STRAIGHT);
    if (isTrips(hand.concat(flop))) return scoreToString(MAX_THREE_OF_A_KIND);
    if(isTwoPair(hand.concat(flop))) return scoreToString(MAX_TWO_PAIR);
    if (isPair(hand.concat(flop))) return scoreToString(MAX_PAIR);

    return scoreToString(MAX_HIGH_CARD); // Default to high card if no other hand is made
}

module.exports = {
    getQualifier,
    getMadeHandSubqualifier,
    isPocketPair,
    RANK_CLASS_TO_STRING,
    STRING_TO_RANK_CLASS
};


//TODO works: pair and quads (i think), fix trips, full house,
// also somehow give sorted list of hands also and order the range from best hands to worst
