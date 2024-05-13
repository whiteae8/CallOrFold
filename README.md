CallOrFold
==========
## Poker Puzzle Game by Ashley White (In Progress)
<br/><br>
## Example run: <br/><br>
<img width="765" alt="Screenshot 2024-05-13 at 3 06 45 PM" src="https://github.com/whiteae8/CallOrFold/assets/78070322/80622917-bafa-4fde-98cd-cf8590e51404">
</br><br/><br><br>
## Notes: <br/><br>
* Utilizes pokerstove poker hand evaluation engine to calculate equity https://github.com/andrewprock/pokerstove/tree/master <br/><br>
* Set up: Clone repository, navigate to repo folder in terminal & type "$ node server.js" - a clickable link should show up. Refresh for new hands<br/><br>
* Current progress: Need to download or create new equity engine because the current equity is the hand against a random hand and I want it to calculate range equity like in https://openpokertools.com/range-equity.html - see range.js and range.test.js for current progress - Range is able to be calculated but not parsed / made concise <br/><br>
* Next steps: Further dive into possible range - consider different seats at the table, consider the flop, consider options based on "personality" of player
