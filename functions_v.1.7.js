// starting position - checkers, turn
const checkers_default = JSON.stringify([
    {"type": "man", "color": "white", "x": 1, "y": 1},
    {"type": "man", "color": "white", "x": 3, "y": 1},
    {"type": "man", "color": "white", "x": 5, "y": 1},
    {"type": "man", "color": "white", "x": 7, "y": 1},
    {"type": "man", "color": "white", "x": 2, "y": 2},
    {"type": "man", "color": "white", "x": 4, "y": 2},
    {"type": "man", "color": "white", "x": 6, "y": 2},
    {"type": "man", "color": "white", "x": 8, "y": 2},
    {"type": "man", "color": "white", "x": 1, "y": 3},
    {"type": "man", "color": "white", "x": 3, "y": 3},
    {"type": "man", "color": "white", "x": 5, "y": 3},
    {"type": "man", "color": "white", "x": 7, "y": 3},

    {"type": "man", "color": "black", "x": 2, "y": 6},
    {"type": "man", "color": "black", "x": 4, "y": 6},
    {"type": "man", "color": "black", "x": 6, "y": 6},
    {"type": "man", "color": "black", "x": 8, "y": 6},
    {"type": "man", "color": "black", "x": 1, "y": 7},
    {"type": "man", "color": "black", "x": 3, "y": 7},
    {"type": "man", "color": "black", "x": 5, "y": 7},
    {"type": "man", "color": "black", "x": 7, "y": 7},
    {"type": "man", "color": "black", "x": 2, "y": 8},
    {"type": "man", "color": "black", "x": 4, "y": 8},
    {"type": "man", "color": "black", "x": 6, "y": 8},
    {"type": "man", "color": "black", "x": 8, "y": 8}
]);
const turn_default = "white"; // defines who makes next move


// cookie_name should be passed as a string in quotes;
// value of the cookie is expected to be stored as JSON.stringify(cookie_name)
function read_cookie_value(cookie_name) {
    cookie_name += "=";
    let items = document.cookie.split(';');
    for (let i=0; i<items.length; i++) {
        if (items[i].indexOf(cookie_name) !== -1) { //check if cookie_name is in items[i]
            while (items[i][0] == " ") { //remove possible " " from the beginning;
                items[i] = items[i].substring(1);
            };
            let output = items[i].slice(cookie_name.length);
            try {
                output = JSON.parse(output); 
            } catch {
                return undefined;
            }
            return output;
        };
    };
    return undefined;
};

// cookie_name should be passed as a string in quotes;
// value of the cookie is stored as JSON.stringify(cookie_name)
function write_cookie(cookie_name, var_value, days_valid) {
    let date = new Date();
    date.setTime(date.getTime() + (days_valid * 24 * 60 * 60 * 1000));
    document.cookie = cookie_name + "=" + JSON.stringify(var_value) + 
            "; expires=" + date.toUTCString() + 
            "; path=/; SameSite=Strict";
};

function move_nw(id) {
    let nw = {"x": id.x - 1, "y": id.y + 1, "color": id.color, "type": id.type, "index": 1};
    return nw;
};
function move_ne(id) {
    let ne = {"x": id.x + 1, "y": id.y + 1, "color": id.color, "type": id.type, "index": 2};
    return ne;
};
function move_sw(id) {
    let sw = {"x": id.x - 1, "y": id.y - 1, "color": id.color, "type": id.type, "index": 4};
    return sw;
};
function move_se(id) {
    let se = {"x": id.x + 1, "y": id.y - 1, "color": id.color, "type": id.type, "index": 3};
    return se;
};
////
function move_w(id) {
    let w;
    if (id.color === "white") {
        w = {"x": id.x - 1, "y": id.y + 1, "color": id.color, "type": id.type};
    } else {
        w = {"x": id.x - 1, "y": id.y - 1, "color": id.color, "type": id.type};
    }
    return w;
};
function move_e(id) {
    let e;
    if (id.color === "white") {
        e = {"x": id.x + 1, "y": id.y + 1, "color": id.color, "type": id.type};
    } else {
        e = {"x": id.x + 1, "y": id.y - 1, "color": id.color, "type": id.type};
    }
    return e;
};

function define_moves(id, capts, index) {
    let moves = [];
    if (id.type === "man") {
        const directions = [move_w, move_e];
        directions.forEach(dir => {
            let step = dir(id)
            if (find_checker(step) === undefined) {
                if(step.x > 0 && step.x < 9 && step.y > 0 && step.y < 9) {
                    if (id.captures === undefined) {
                        moves.push(step);
                    };
                };
            } else if (checkers[find_checker(step)].color !== id.color 
                && find_checker(dir(step)) === undefined) { //
                let move = dir(step); //
                if(move.x > 0 && move.x < 9 && move.y > 0 && move.y < 9) {
                    move["captures"] = [].concat(step);
                    if (capts !== undefined) {
                        capts.forEach(capt => {
                            move.captures.push(capt);
                        });
                    };
                    moves.push(move);
                    moves = moves.concat(define_moves(move, move.captures));
                };
            };
        });
    } else if (id.type === "king") {
        const directions = [move_nw, move_ne, move_sw, move_se];
        directions.forEach(dir => {
            let step = dir(id)
            console.log(step.index, index)
            if (Math.abs(index - step.index) === 2 ) {return;};
            console.log(step);
            if (find_checker(step) === undefined) {
                if(step.x > 0 && step.x < 9 && step.y > 0 && step.y < 9) {
                    if (id.captures === undefined) {
                        moves.push(step);
                    };
                };
            } else if (checkers[find_checker(step)].color !== id.color 
                && find_checker(dir(step)) === undefined) { 
                let move = dir(step); //
                if(move.x > 0 && move.x < 9 && move.y > 0 && move.y < 9) {
                    move["captures"] = [].concat(step);
                    if (capts !== undefined) {
                        capts.forEach(capt => {
                            move.captures.push(capt);
                        });
                    };
                    moves.push(move);
                    console.log(move.captures);
                    moves = moves.concat(define_moves(move, move.captures, step.index)); // TODO: restrict coming back to the initial cell and restarting the process
                };
            };
        });
    };
    return moves;
};

function clean_board() {
    const che = document.querySelectorAll("[data-checker]");
    for (let i=0; i < che.length; i++) {
        che[i].remove();
    };
    const taken_cells = document.querySelectorAll("[data-cell-taken]");
    for (let i=0; i < taken_cells.length; i++) {
        taken_cells[i].removeAttribute("data-cell-taken");
    };
};

function render_checker(id, cell) {
    const new_che = document.createElement('div');
    new_che.classList.add(id.color); // removed "data_checker",
    new_che.setAttribute("data-checker", "");
    cell.append(new_che);
    cell.setAttribute("data-cell-taken", "");
    if (id.moves !== undefined && id.color === turn) {
        new_che.classList.add("movable");
    };
    if (id.type === "king") {
        new_che.innerHTML = "K"
    };
    return new_che;
};

// function calculate_moves() {
//     checkers.forEach(id => {
//         id.moves = undefined;
//         let m = define_moves(id);
//         if (m[0] !== undefined) {id.moves = m};
//     });
// };

function checker_select(id) {
    const che_div = document.querySelector(`[data-x='${id.x}'][data-y='${id.y}']`).childNodes[0];
    return che_div;
};
function cell_select(id) {
    const cell_div = document.querySelector(`[data-x='${id.x}'][data-y='${id.y}']`);
    return cell_div;
};
function cells_select(ids) {
    const cell_divs = Array();
    ids.forEach(id => cells.append(cell_selece(id)));
    return cell_divs
};

function cell_action(id, action) {
    const cell = document.querySelector(`[data-x='${id.x}'][data-y='${id.y}']`);
    return [action(id, cell), cell];
};
function cells_action(ids, action) {
    ids.forEach(id => cell_action(id, action));
};

function find_checker(id) { // returns "captures" array's index of the id based on x and y
    for (let i=0; i < checkers.length; i++) {
        if (checkers[i].x === id.x && checkers[i].y === id.y) {
            return i;
        };
    };
};
function find_move(move_id, che) {
    for (let i=0; i < che.moves.length; i++) {
        if (che.moves[i].x === move_id.x && che.moves[i].y === move_id.y) {
            return i;
        };
    };
};



function record_move(old_id, new_id) {
    const index = find_checker(old_id);
    checkers[index].x = new_id.x;
    checkers[index].y = new_id.y;
};

