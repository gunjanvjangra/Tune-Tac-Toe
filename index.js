window.addEventListener("DOMContentLoaded", () => {
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const playerDisplay = document.querySelector(".display-player");
  const resetButton = document.querySelector("#reset");
  const announcer = document.querySelector(".announcer");

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "O"; // Human player starts
  let isGameActive = true;

  const PLAYERX_WON = "PLAYERX_WON";
  const PLAYERO_WON = "PLAYERO_WON";
  const TIE = "TIE";

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
      const winCondition = winningConditions[i];
      const a = board[winCondition[0]];
      const b = board[winCondition[1]];
      const c = board[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON);
      isGameActive = false;
      return;
    }

    if (!board.includes("")) announce(TIE);
  }

  const announce = (type) => {
    switch (type) {
      case PLAYERO_WON:
        announcer.innerHTML =
          'Congratulations!! Player <span class="playerO">"O"</span> Won...';
        break;
      case PLAYERX_WON:
        announcer.innerHTML =
          'Congratulations!! Player <span class="playerX">"X"</span> Won...';
        break;
      case TIE:
        announcer.innerText = "It's a Tie!!";
    }
    announcer.classList.remove("hide");
  };

  const isValidAction = (tile) => {
    return tile.innerText === "" && isGameActive;
  };

  const updateBoard = (index) => {
    board[index] = currentPlayer;
  };

  const changePlayer = () => {
    playerDisplay.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === "O" ? "X" : "O";
    playerDisplay.innerText = currentPlayer;
    playerDisplay.classList.add(`player${currentPlayer}`);

    if (currentPlayer === "X" && isGameActive) {
      // Computer's turn
      setTimeout(() => computerTurn(), 500);
    }
  };

  const userAction = (tile, index) => {
    if (isValidAction(tile)) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index);
      handleResultValidation();
      changePlayer();
    }
  };

  const computerTurn = () => {
    // Get empty tiles
    const emptyTiles = tiles.filter((tile) => tile.innerText === "");
    if (emptyTiles.length > 0) {
      // Randomly select an empty tile for the computer's move
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const computerTile = emptyTiles[randomIndex];
      const computerIndex = tiles.indexOf(computerTile);

      // Simulate the computer's click after a delay
      setTimeout(() => userAction(computerTile, computerIndex), 500);
    }
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    announcer.classList.add("hide");

    if (currentPlayer === "O") {
      // If the last game ended with the computer's move, start with human player
      changePlayer();
    }

    tiles.forEach((tile) => {
      tile.innerText = "";
      tile.classList.remove("playerX");
      tile.classList.remove("playerO");
    });
  };

  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => userAction(tile, index));
  });

  resetButton.addEventListener("click", resetBoard);
});
