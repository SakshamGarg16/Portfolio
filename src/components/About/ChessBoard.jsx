"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Chess } from "chess.js";

const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [playerSide, setPlayerSide] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(null);



  // ✅ AI only plays for the opposite side
  const aiSide = playerSide === "w" ? "b" : "w";

  useEffect(() => {
    if (playerSide && game.turn() === aiSide) {
      setTimeout(aiMove, 300);
    }
  }, [game, playerSide]);

  // ✅ Handle player side selection
  const handleSideSelection = (side) => {
    setPlayerSide(side);
    setShowModal(false);
  };

  // ✅ Handle square click
  const handleSquareClick = (row, col) => {
    if (!playerSide) return;
  
    // Prevent playing the AI's side
    if (game.turn() !== playerSide) return;
  
    const square = String.fromCharCode(97 + col) + (8 - row);
  
    // ✅ If clicking on a new piece (switch selection)
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }).map((move) => move.to);
      setValidMoves(moves);
      setMessage(""); // ✅ Clear error message when valid piece is selected
      return;
    }
  
    // ✅ If trying to make a valid move
    if (selectedSquare) {
      const isPawnPromotion =
        game.get(selectedSquare)?.type === "p" &&
        (square[1] === "1" || square[1] === "8");
  
      const move = {
        from: selectedSquare,
        to: square,
        promotion: isPawnPromotion ? "q" : undefined, // ✅ Only promote for pawns at the last rank
      };
  
      const newGame = new Chess(game.fen());
      const legalMoves = newGame.moves({ verbose: true }).map((m) => m.to);
  
      if (legalMoves.includes(square)) {
        if (newGame.move(move)) {
          setGame(new Chess(newGame.fen()));
          setSelectedSquare(null);
          setValidMoves([]);
          setMessage(""); // ✅ Clear error message for valid moves
          checkGameOver(newGame);
        }
      } else {
        setMessage("Invalid move!"); // ✅ Display only for true invalid moves
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };
  

// ✅ Evaluation function based on material value
const evaluateBoard = () => {
    const pieceValue = {
      p: 10,
      n: 30,
      b: 30,
      r: 50,
      q: 90,
      k: 900,
    };
  
    let evaluation = 0;
    const board = game.board();
  
    for (let row of board) {
      for (let piece of row) {
        if (piece) {
          let value = pieceValue[piece.type];
          evaluation += piece.color === "w" ? value : -value;
        }
      }
    }
  
    return evaluation;
  };
  
// ✅ Minimax with Alpha-Beta Pruning
const minimax = (depth, isMaximizing, alpha, beta) => {
    if (depth === 0 || game.isGameOver()) {
      return evaluateBoard();
    }
  
    const moves = game.moves();
  
    if (isMaximizing) {
      let bestValue = -Infinity;
      for (let move of moves) {
        game.move(move);
        bestValue = Math.max(
          bestValue,
          minimax(depth - 1, false, alpha, beta)
        );
        game.undo();
  
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) break;
      }
      return bestValue;
    } else {
      let bestValue = Infinity;
      for (let move of moves) {
        game.move(move);
        bestValue = Math.min(
          bestValue,
          minimax(depth - 1, true, alpha, beta)
        );
        game.undo();
  
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) break;
      }
      return bestValue;
    }
  };
  
  
  // ✅ AI Move (uses minimax)
  const aiMove = () => {
    if (game.turn() === aiSide && !gameOver) {
      const moves = game.moves();
      let bestMove = null;
      let bestValue = -Infinity;
  
      for (let move of moves) {
        game.move(move);
        const value = minimax(3, false, -Infinity, Infinity);
        game.undo();
  
        if (value > bestValue) {
          bestValue = value;
          bestMove = move;
        }
      }
  
      if (bestMove) {
        game.move(bestMove);
        setGame(new Chess(game.fen()));
        checkGameOver(game);
      }
    }
  };
  


  // ✅ Check for win or stalemate
  const checkGameOver = (currentGame) => {
    if (currentGame.isCheckmate()) {
      setGameOver(true);
      setWinner(currentGame.turn() === "w" ? "Black" : "White");
    } else if (currentGame.isDraw()) {
      setGameOver(true);
      setWinner("Draw");
    }
  };

  // ✅ Reset game
  const resetGame = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setValidMoves([]);
    setGameOver(false);
    setWinner(null);
    setShowModal(true);
  };
  

  // ✅ Render board with valid moves highlighting
  const renderSquare = (row, col) => {
    const square = String.fromCharCode(97 + col) + (8 - row);
    const isHighlighted = validMoves.includes(square);

    const color = (row + col) % 2 === 0 ? "#b58863" : "#f0d9b5";
    const highlightColor = isHighlighted ? "rgba(0, 255, 0, 0.4)" : color;

    return (
      <mesh
        key={`${row}-${col}`}
        position={[col - 3.5, 0, row - 3.5]}
        onClick={() => handleSquareClick(row, col)}
      >
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={highlightColor} />
      </mesh>
    );
  };

  // ✅ Render different shapes for pieces
  const renderPiece = (piece, row, col) => {
    if (!piece) return null;

    const pieceColor = piece.color === "w" ? "#ffffff" : "#000000";
    const position = [col - 3.5, 0.5, row - 3.5];

    // ✅ Unique shapes for different pieces
    const geometry = (() => {
      switch (piece.type) {
        case "p":
          return <sphereGeometry args={[0.3, 32, 32]} />; // Pawn
        case "r":
          return <boxGeometry args={[0.5, 0.5, 0.5]} />; // Rook
        case "n":
          return <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />; // Knight
        case "b":
          return <coneGeometry args={[0.3, 0.5, 32]} />; // Bishop
        case "q":
          return <torusGeometry args={[0.25, 0.1, 16, 32]} />; // Queen
        case "k":
          return <tetrahedronGeometry args={[0.4]} />; // King
        default:
          return null;
      }
    })();

    return (
      <mesh
        key={`${piece.type}-${row}-${col}`}
        position={position}
        onClick={() => handleSquareClick(row, col)}
      >
        {geometry}
        <meshStandardMaterial color={pieceColor} />
      </mesh>
    );
  };

  return (
    <>
      {/* ✅ Side selection modal */}
      {message && <div className="text-red-500 mt-2">{message}</div>}

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-black">
              Choose Your Side
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleSideSelection("w")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Play as White
              </button>
              <button
                onClick={() => handleSideSelection("b")}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                Play as Black
              </button>
            </div>
          </div>
        </div>
      )}

{gameOver && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-black">
        {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
      </h2>
      <button
        onClick={resetGame}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Restart Game
      </button>
    </div>
  </div>
)}


      {/* ✅ Chessboard */}
      {playerSide && (
        <div className="flex">
          <Canvas camera={{ position: [0, 8, 8] }} style={{ width: "70vw", height: "80vh" }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 10, 10]} intensity={1} />
            <OrbitControls />

            {/* Render board */}
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => renderSquare(row, col))
            )}

            {/* Render pieces */}
            {game.board().map((row, rowIndex) =>
              row.map((piece, colIndex) =>
                renderPiece(piece, rowIndex, colIndex)
              )
            )}
          </Canvas>
          

          {/* ✅ Piece Guide */}
          <div className="ml-4 text-white">
            <h3 className="text-lg font-bold mb-2">Piece Guide:</h3>
            <ul>
              <li>🔴 Pawn - Sphere</li>
              <li>🔲 Rook - Cube</li>
              <li>🔹 Knight - Cylinder</li>
              <li>🔺 Bishop - Cone</li>
              <li>⭕ Queen - Torus</li>
              <li>🔼 King - Tetrahedron</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ChessBoard;
