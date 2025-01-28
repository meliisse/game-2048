var board; // Matrice 2D représentant le plateau de jeu
var score = 0; // Variable pour suivre le score actuel
var rows = 4; // Dimensions du plateau (4x4)
var highScore = localStorage.getItem("highScore") || 0; //Récupère le meilleur score mane stockage local initialise à 0
var columns = 4;

window.onload = function () { //Exécute ce bloc après le chargement de la page
 
  setGame(); //Initialise le plateau de jeu
  const retryButton = document.getElementById("new-game");  //Rend le bouton visible
  retryButton.style.display = "block";
  retryButton.addEventListener("click", restartGame);

  document.getElementById("high-score-value").innerText = highScore; //afficher la valeur du highScore 
};

function setGame() {
    //Initialise chaque case à 0
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  document.getElementById("board").innerHTML = ""; // Vide le plateau existant

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");   //Génère une case pour chaque position (r, c)
      tile.id = r.toString() + "-" + c.toString(); //Associe un ID unique basé sur les coordonnées
      let num = board[r][c]; 
      updateTile(tile, num); //Met à jour l'apparence
      document.getElementById("board").append(tile); //ajout cette tile a board 
    }
  }
   //Ajout de deux tuiles de valeur "2"
  setTwo();
  setTwo();
}

function hasEmptyTile() {    //verifi si la case et vide ou non 
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }
  return false;
}

function setTwo() {  
  if (!hasEmptyTile()) {   //Vérifie si une case est libre
    return;  //si aucune case n'est pas libre donc return the fonction 
  }
 //sinon 
  let found = false;   //cette variable indique si une case vide est trouver  
  while (!found) { 
    // tant que une case vide n'est pas trouver doo ..
    let r = Math.floor(Math.random() * rows);  //choisit une case libre aléatoirement et arrondit ce nombre
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {  //Si la case à la position (r, c) dans board contient 0 donc elle est vide on peut placer une nouvelle tuile
      board[r][c] = 2; //Placement de la valeur 2 dans la case vide 
      let tile = document.getElementById(r.toString() + "-" + c.toString()); //forme un id like Si r = 1 et c = 3, l'ID serait "1-3"
      tile.innerText = "2"; //Affichage de la valeur 2
      tile.classList.add("x2"); //Ajout d'une classe CSS à la case
      found = true; //Une fois qu'une case vide a été trouvée la variable found est miss a true 
    }
  }

  if (!hasEmptyTile() && !canMove()) {  //the  end of game if aucune case et vide et aucune mouvement possible 
    showGameOver();
  }
}

function updateTile(tile, num) {  
  tile.innerText = "";  //efface le texte à l'intérieur de la tile
  tile.classList.value = ""; //réinitialise les styles existants
  tile.classList.add("tile"); //Cette ligne ajoute la classe "tile" à l'élément

  if (num > 0) {
    tile.innerText = num; //afficher num 
    if (num <= 4096) {  
      tile.classList.add("x" + num.toString()); //  ajouter la class a la tile 
    } else {
      tile.classList.add("x8192"); 
    }
  }
}
// mouvement pour le keybord 
document.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
    e.preventDefault();

    let moved = false;
    if (e.code === "ArrowLeft") {
      moved = slideLeft();
    } else if (e.code === "ArrowRight") {
      moved = slideRight();
    } else if (e.code === "ArrowUp") {
      moved = slideUp();
    } else if (e.code === "ArrowDown") {
      moved = slideDown();
    }

    if (moved) {
      setTwo();
      document.getElementById("score").innerText = score;
    }
  }
});
 
//mouvement pour le telephone 
let startX, startY, endX, endY;

document.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
  e.preventDefault();
});

document.addEventListener("touchend", (e) => {
  e.preventDefault();
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  let deltaX = endX - startX;
  let deltaY = endY - startY;

  let moved = false;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      moved = slideRight();
    } else {
      moved = slideLeft();
    }
  } else {
    if (deltaY > 0) {
      moved = slideDown();
    } else {
      moved = slideUp();
    }
  }

  if (moved) {
    setTwo();
    document.getElementById("score").innerText = score;
  }
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  row = filterZero(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  let moved = false;
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let newRow = slide(row);
    if (newRow.toString() !== row.toString()) {
      moved = true;
    }
    board[r] = newRow;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  return moved;
}

function slideRight() {
  let moved = false;
  for (let r = 0; r < rows; r++) {
    let row = board[r].slice().reverse();
    let newRow = slide(row).reverse();
    if (newRow.toString() !== board[r].toString()) {
      moved = true;
    }
    board[r] = newRow;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  return moved;
}

function slideUp() {
  let moved = false;
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let newRow = slide(row);
    for (let r = 0; r < rows; r++) {
      if (board[r][c] !== newRow[r]) {
        moved = true;
      }
      board[r][c] = newRow[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  return moved;
}

function slideDown() {
  let moved = false;
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
    let newRow = slide(row).reverse();
    for (let r = 0; r < rows; r++) {
      if (board[r][c] !== newRow[r]) {
        moved = true;
      }
      board[r][c] = newRow[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  return moved;
}

function canMove() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) return true;
      if (c < columns - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < rows - 1 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

//Affiche le message de fin de jeu
function showGameOver() {
  document.getElementById("game-over").style.display = "block";
  document.getElementById("final-score").innerText = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  document.getElementById("high-score-value").innerText = highScore;
}

function restartGame() {
  score = 0;
  document.getElementById("score").innerText = score;
  document.getElementById("game-over").style.display = "none";
  setGame();
}