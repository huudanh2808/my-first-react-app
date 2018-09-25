import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const board_map = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
]
const sortVals = ["Descending sort", "Ascending sort"];

const isDraw = "draw";

function calculateWinner(squares) {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    if (squares.every(val => {return val != null;})){
        return isDraw;
    }
        return null;
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        var index = 0;
        var board_row = [];
        for (var i = 0; i < 3; i++) {
            var render_squares = [];
            for (var j = 0; j < 3; j++) {
                render_squares.push(this.renderSquare(index));
                index++;
            }
            board_row.push(<div className="board-row"> {render_squares}</div>)
        }
        return (
            <div>
                {board_row}
            </div>
        );
    }
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                moves: Array(2).fill(null),
            }],
            sortOption: -1,
            sortBtnVal: "Descending sort",
            stepNumber: 0,
            xIsNext: true
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const moves = current.moves.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        for (var j = 0; j < board_map.length; j++) {
            if (board_map[j].indexOf(i) !== -1) {
                moves[0] = board_map[j].indexOf(i);
                moves[1] = j;
            }
        }
        this.setState({
            history: history.concat([{
                squares: squares,
                moves: moves
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    sortMoveList(sortOption) {
        this.setState({
            sortOption: sortOption * -1,
            sortBtnVal: sortOption === -1 ? sortVals[1] : sortVals[0],
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        console.log(current);
        const winner = calculateWinner(current.squares);
        var moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + `- (${step.moves[0]},${step.moves[1]})` :
                'Go to game start';
            if (step.squares === current.squares) {
                return (
                    <li key={move}>
                        <button className="current-step" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
            else {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
        });
        if (this.state.sortOption === -1) {
            moves = moves.reverse();
        }
        moves = moves.reverse();
        let status;
        if (winner) {
            if(winner === isDraw){
                status = 'Game draw!';
            }
            else
            {
                status = 'Winner: ' + winner;
            }
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>

                    <ol>{moves}</ol>
                </div>
                <div className="game-button">
                    <SortButton value={this.state.sortBtnVal} onClick={() => this.sortMoveList(this.state.sortOption)}>

                    </SortButton>
                </div>
            </div>
        );
    }
}

class SortButton extends React.Component {
    render() {
        return (
            <button className="sort-button" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
