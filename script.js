const gridContainer = document.getElementById("grid");
const runButton = document.getElementById("run");
const resetButton = document.getElementById("reset");

const ROWS = 20;
const COLS = 20;

let grid = [];
let startNode = null;
let endNode = null;

function createGrid() {
    gridContainer.innerHTML = '';
    grid = [];
    for (let row = 0; row < ROWS; row++) {
        let currentRow = [];
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", toggleCell);
            gridContainer.appendChild(cell);
            currentRow.push({
                row,
                col,
                distance: Infinity,
                visited: false,
                previous: null,
                cellElement: cell,
                wall: false
            });
        }
        grid.push(currentRow);
    }
}

function toggleCell(e) {
    const row = parseInt(this.dataset.row);
    const col = parseInt(this.dataset.col);

    const node = grid[row][col];

    if (!startNode) {
        startNode = node;
        this.classList.add("start");
    } else if (!endNode && node !== startNode) {
        endNode = node;
        this.classList.add("end");
    } else if (node !== startNode && node !== endNode) {
        node.wall = !node.wall;
        this.classList.toggle("wall");
    }
}


function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    const dirs = [
        [0,1], [1,0], [0,-1], [-1,0]
    ];
    for (const [dx, dy] of dirs) {
        const r = row + dx;
        const c = col + dy;
        if (r >=0 && r < ROWS && c >=0 && c < COLS) {
            const neighbor = grid[r][c];
            if (!neighbor.wall) neighbors.push(neighbor);
        }
    }
    return neighbors;
}


  async function dijkstra() {
    if (!startNode || !endNode) return alert("Select start and end nodes first!");
    
    let unvisited = [];
    for (const row of grid) {
        for (const node of row) {
            node.distance = Infinity;
            node.visited = false;
            node.previous = null;
            unvisited.push(node);
        }
    }

    startNode.distance = 0;

    while (unvisited.length > 0) {
        unvisited.sort((a,b)=> a.distance - b.distance);
        const closest = unvisited.shift();
        if (closest.wall) continue;
        if (closest.distance === Infinity) break;
        closest.visited = true;
        closest.cellElement.classList.add("visited");
        await sleep(20);

        if (closest === endNode) break;

        const neighbors = getNeighbors(closest);
        for (const neighbor of neighbors) {
            const alt = closest.distance + 1;
            if (alt < neighbor.distance) {
                neighbor.distance = alt;
                neighbor.previous = closest;
               }
          }
     }

    
      let current = endNode;
    const path = [];
    while (current.previous) {
        path.push(current);
        current = current.previous;
      }
    path.reverse();
    for (const node of path) {
        if (node !== startNode && node !== endNode) {
            node.cellElement.classList.add("path");
            await sleep(50);
        }
    }
}

   function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
}


function resetGrid() {
    startNode = null;
    endNode = null;
    createGrid();
}


   runButton.addEventListener("click", dijkstra);
 resetButton.addEventListener("click", resetGrid);

 createGrid();
