//1 indexed instead of 0.
function getColumn(n) {
  const headers = document.querySelectorAll("th");
  const bodCells = document.querySelectorAll("td");
  const answer = [];
  const numcol = numColumns();
  answer.push(headers[n]);
  for (let i = n - 1; i < bodCells.length; i += numcol - 1) {
    answer.push(bodCells[i]);
  }
  return answer;
}
function numRows() {
  return document.querySelectorAll("tr").length;
}
function numColumns() {
  const rows = numRows();
  const cells =
    document.querySelectorAll("td").length +
    document.querySelectorAll("th").length;
  return cells / rows;
}

//instructions is of form [[5,1],[3,2]]. 5th should be 1st, 3rd should be 2nd.
function reorder(source, instructions) {
  const answer = [...source]; //copy references.
  instructions.sort((a, b) => a[1] - b[1]); //ensures we insert and end up correct order.
  instructions.forEach((x) => {
    //first remove it. then move it.
    answer.splice(answer.indexOf(source[x[0]]), 1);
    answer.splice(x[1], 0, source[x[0]]);
  });

  return answer;
}
function orderColumns(instructionArr) {
  const headerRow = document.querySelector("thead>tr");
  const headers = headerRow.querySelectorAll("th");

  const newHeaders = reorder(headers, instructionArr);
  headerRow.replaceChildren(...newHeaders);

  //now do each row of grades.
  const gradeRows = document.querySelectorAll("tbody>tr");
  for (let i = 0; i < gradeRows.length; i++) {
    const tr = gradeRows[i];
    // let cells = tr.
    tr.replaceChildren(...reorder(tr.children, instructionArr));
  }
}
function addNums() {
  console.log("in addNums");
  const thead = document.querySelector("thead");
  const len = thead.querySelectorAll("th").length;
  console.log("thead length:", len);
  const tr = document.createElement("tr");
  for (let i = 0; i < len; i++) {
    const td = document.createElement("td");
    td.onmousedown = (evt) => {
      fromtd = td;
      console.log("mouse down: ", i, evt);
    };
    td.onmouseup = (evt) => {
      console.log("mouse up:", evt);
      const cells = document.querySelector("thead").querySelectorAll("td");
      const cellsArr = [];
      for (let i = 0; i < cells.length; i++) {
        cellsArr.push(cells[i]);
      }
      const from = cellsArr.indexOf(fromtd);
      const to = cellsArr.indexOf(td);
      console.log("from to:", from, to);
      orderColumns([[from, to]]);
    };
    td.innerHTML = i;
    //webkit-user-select: none;
    td.style.userSelect = "none";
    td.style.cursor = "move";
    td.onmouseover = (evt) => {
      td.style.background = "red";
    };
    td.onmouseleave = (evt) => {
      td.style.background = "none";
    };
    td.originalI = i;
    tr.appendChild(td);
  }
  thead.appendChild(tr);
  console.log("addNums done");
}
let fromtd;

function init() {
  addNums();
}
console.log("reordered running");

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
  function addListener() {
    const e = document.querySelector('[guidedhelpid="gradebookTab"]');
    if (e) {
      e.addEventListener("click", () => {
        console.log("clicked");
        setTimeout(() => {
          const header = document.querySelector("thead");
          if (header.querySelectorAll("td").length > 0) return;
          setTimeout(addNums, 100);
        }, 100);
      });
      console.log("listener added");
    } else {
      console.log("not yet");
      setTimeout(addListener, 500);
    }
  }
  addListener();
});
