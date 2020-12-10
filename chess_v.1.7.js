"use strict";
const html = document.querySelector("html");

let checkers;
let turn;

// Check if cookies stored in browser and user their values
let cookie_checkers = read_cookie_value("checkers");
if (read_cookie_value("checkers") === undefined) {
    checkers = JSON.parse(checkers_default);
    turn = turn_default;
    write_cookie("checkers", checkers, 365);
    write_cookie("turn", turn, 365);
} else {
    checkers = cookie_checkers;
    turn = read_cookie_value("turn");
}

window.onload = () => {

    function run_checkers () {
        console.log(checkers);
        clean_board();
        // calculate_moves();

    //// Render all checkers
        for (let i=0; i<checkers.length; i++) {
            const checker_id = checkers[i];
            // Convert to Men to Kings
            if (checker_id.type === "man"
                    && checker_id.color === "white" 
                    && checker_id.y === 8) {
                checker_id.type = "king";
            } else if (checker_id.type === "man"
                    && checker_id.color === "black" 
                    && checker_id.y === 1) {
                checker_id.type = "king";
            };
            // if (checker_id.color !== turn) {
            //     continue;
            // }
            // Calculate moves
            checker_id.moves = undefined;
            let m = define_moves(checker_id);
            if (m[0] !== undefined) {checker_id.moves = m};
            // Render checkers
            const divs = cell_action(checkers[i], render_checker);
            const checker_div = divs[0];
            const cell_div = divs[1];
            
            if (checker_id.moves !== undefined 
                        && checker_id.color === turn 
                        && checker_id.type !== "captured") {
                checker_div.addEventListener("pointerdown", e => {
                //// Functions
                    function move(e) {
                        checker_div.style.left = `${e.pageX - x}px`;
                        checker_div.style.top = `${e.pageY - y}px`;
                        let placement = document.elementFromPoint(e.clientX, e.clientY)
                                                    .closest('[data-cell-black]');
                        let placement_taken = document.elementFromPoint(e.clientX, e.clientY)
                                                    .closest('[data-cell-taken]');
                        let placement_good = document.elementFromPoint(e.clientX, e.clientY)
                                                    .closest('[data-cell-good]');
                        if (placement !== null && placement_taken === null && placement_good !== null) {
                            placement.append(shadow);
                        };
                    };
                    function drop(e) {
                        html.removeEventListener("pointermove", move);
                        html.removeEventListener("pointerup", drop);
                        shadow.parentElement.setAttribute("data-cell-taken", "");
                        shadow.before(checker_div);
                        checker_div.classList.remove("picked");
                        checker_div.style.left = "";
                        checker_div.style.top = "";
                        shadow.remove();
                        const goods = document.querySelectorAll("[data-cell-good]");
                        [...goods].forEach((good) => {
                            good.removeAttribute("data-cell-good");
                        });
                        const targets = document.querySelectorAll(".targeted");
                        [...targets].forEach((trgt) => {
                            trgt.classList.remove("targeted");
                        });
                        // const movables = document.querySelectorAll(".movable");
                        // [...movables].forEach((mvbl) => {
                        //     mvbl.classList.remove("movable");
                        // });
                        // Overwrite coordinates in the array
                        let checker_id_new = {"x": +checker_div.parentElement.dataset.x, "y": +checker_div.parentElement.dataset.y};
                        if (checker_id_new.x !== checker_id.x 
                                    || checker_id_new.y !== checker_id.y) {
                            const ind = find_move(checker_id_new, checker_id);
                            const captures = checker_id.moves[ind].captures;
                            if (captures !== undefined) {
                                captures.forEach(capt => {
                                    checkers.splice(find_checker(capt),1);
                                    // checkers[find_checker(capt)].type = "captured";
                                    // delete checkers[find_checker(capt)];
                                });
                            };
                            record_move(checker_id, checker_id_new);
                            // Capture
                            if (turn === "white") {
                                turn = "black";
                            } else {
                                turn = "white";
                            };
                            write_cookie("checkers", checkers, 365);
                            write_cookie("turn", turn, 365);
                            run_checkers();
                        };
                    };
                    
                //// Calls
                    // let checker_id = {"color": checker_div.classList.value, "x": +checker_div.parentElement.dataset.x, "y": +checker_div.parentElement.dataset.y};
                    // let moves = define_moves(checker_id);
                    let moves = [].concat(checker_id.moves);
                    moves.push(checker_id);
                    moves.forEach(move => {
                        const good = document.querySelector(`[data-x='${move.x}'][data-y='${move.y}']`);
                        if (good !== null) {
                            good.setAttribute("data-cell-good", "");
                        };
                        if (move.captures !== undefined) {
                            move.captures.forEach(capt => {
                                checker_select(capt).classList.add("targeted");
                            });
                        };
                    })
        
                    const x = e.pageX;
                    const y = e.pageY;
        
                    const shadow = checker_div.cloneNode();
                    checker_div.before(shadow);
                    shadow.parentElement.removeAttribute("data-cell-taken");
                    shadow.classList.add("checker_shadow");
                    shadow.removeAttribute("data-checker");
                    
                    checker_div.classList.add("picked");
        
                //// Listeners
                    html.addEventListener("pointermove", move);
                    html.addEventListener("pointerup", drop);
                });
            };
        };
    };
    function reset_board() {
        checkers = JSON.parse(checkers_default);
        turn = turn_default;
        write_cookie("checkers", checkers, 365);
        write_cookie("turn", turn, 365);
        run_checkers();
    };

    const reset = document.querySelector("#reset");
    reset.onclick = reset_board;

    run_checkers();


}; //window.onload