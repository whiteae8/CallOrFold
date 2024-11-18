CallOrFold
==========
## Poker Puzzle Game by Ashley White (In Progress)
### Example run: 
<br/>
<img src="https://github.com/whiteae8/CallOrFold/assets/78070322/80622917-bafa-4fde-98cd-cf8590e51404" width="400" alt="Screenshot 2024-05-13 at 3 06 45 PM">
<br/><br/>

### Notes: <br/>
* Utilizes pokerstove poker hand evaluation engine to calculate equity [PokerStove GitHub](https://github.com/andrewprock/pokerstove/tree/master)
* Set up: Clone repository, navigate to repo folder in terminal & type:
`$ node server.js`
<br/>The output should return a clickable link: `Server is running on http://localhost:xxxxx` 
* Current progress: Need to download or create new equity engine because the current equity is the hand against a random hand and I want it to calculate range equity like in [OpenPokerTools](https://openpokertools.com/range-equity.html) - see range.js and range.test.js for current progress - Range is able to be calculated but not parsed / made concise 
* Next steps: Further dive into possible range - consider different seats at the table, consider the flop, consider options based on "personality" of player
