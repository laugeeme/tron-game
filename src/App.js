import React, { useEffect, useReducer, Fragment } from 'react';
import './App.css';
import Board from 'components/Board';
import Start from 'components/Start';
import Result from 'components/Result';
import {
  BOARD_SIZE,
  GAME_ENDED,
  GAME_PLAYING,
  GAME_READY,
  PLAYER_ONE,
  PLAYER_TWO,
  UNIT,
} from 'config/const';
import useInterval from 'hooks/useInterval';
import sumCoordinates from 'utils/sumCoordinates';
import playerCanChangeToDirection from 'utils/playerCanChangeToDirection';
import getPlayableCells from 'utils/getPlayableCells';
import getCellKey from './utils/getCellKey';

const players = [PLAYER_ONE, PLAYER_TWO];

const initialState = {
  //en el estado inicial no está solo los jugadores, sino las celdas jugables
  players,
  playableCells: getPlayableCells(
    BOARD_SIZE,
    UNIT,
    players.map((player) => getCellKey(player.position.x, player.position.y))
  ),
  gameStatus: GAME_READY,
};

function updateGame(game, action) {
  if (action.type === 'start') {
    return {
      ...initialState,
      gameStatus: GAME_PLAYING,
    };
  }

  if (action.type === 'restart') {
    return {
      ...initialState,
      gameStatus: GAME_READY,
    };
  }

  //calculamos primero la posición de los nuevos jugadores
  if (action.type === 'move') {
    //actualización del estado del jugador
    const newPlayers = game.players.map((player) => ({
      ...player,
      position: sumCoordinates(player.position, player.direction),
    }));

    //actualizamos la posición de los jugadores en base a hasDied, si ha muerto o no
    const newPlayersWithCollision = newPlayers.map((player) => {
      const myCellKey = getCellKey(player.position.x, player.position.y);
      return {
        ...player,
        hasDied:
          !game.playableCells.includes(myCellKey) ||
          newPlayers
            .filter((p) => p.id !== player.id)
            .map((p) => getCellKey(p.position.x, p.position.y))
            .includes(myCellKey),
      };
    });

    //modificar las celdas que son jugables quitando las nuevas posiciones
    const newOcupiedCells = game.players.map((player) =>
      getCellKey(player.position.x, player.position.y)
    );

    const playableCells = game.playableCells.filter((playableCell) => {
      return !newOcupiedCells.includes(playableCell);
    });

    return {
      players: newPlayersWithCollision,
      playableCells: playableCells,
      gameStatus:
        newPlayersWithCollision.filter((player) => player.hasDied).length === 0
          ? GAME_PLAYING
          : GAME_ENDED,
    };
  }
  if (action.type === 'changeDirection') {
    const newPlayers = game.players.map((player) => ({
      ...player,
      direction:
        player.keys[action.key] &&
        playerCanChangeToDirection(player.direction, player.keys[action.key])
          ? player.keys[action.key]
          : player.direction,
    }));
    return {
      players: newPlayers,
      playableCells: game.playableCells,
      gameStatus: game.gameStatus,
    };
  }
}

function App() {
  let result = null;
  const [game, gameDispatch] = useReducer(updateGame, initialState);

  //creamos el contador cada vez que uno muera
  const players = game.players;
  const diedPlayers = players.filter((player) => player.hasDied);
  if (diedPlayers.length > 0) {
  }

  useInterval(
    function () {
      gameDispatch({ type: 'move' });
    },
    game.gameStatus !== GAME_PLAYING ? null : 100 //si muere alguien (null) paramos el juego
  );

  //escuchamos el evento de la escucha de teclas, solo para la primera vez, no queremos que lo haga cada vez que renderice, por eso luego hacemos un cleanup.
  useEffect(
    function () {
      function handleKeyPress(event) {
        const key = `${event.keyCode}`;
        if (key === '13') {
          if (game.gameStatus === GAME_READY) {
            handleStart();
          }
          if (game.gameStatus === GAME_ENDED) {
            handleRestart();
          }
        }
        gameDispatch({ type: 'changeDirection', key });
      }

      document.addEventListener('keydown', handleKeyPress);

      return function cleanUp() {
        document.removeEventListener('keydown', handleKeyPress);
      };
    },
    [game.gameStatus]
  );

  function handleStart() {
    gameDispatch({ type: 'start' });
  }

  function handleRestart() {
    gameDispatch({ type: 'restart' });
  }

  if (game.gameStatus === GAME_ENDED) {
    const winningPlayers = game.players.filter((player) => !player.hasDied);
    if (winningPlayers.length === 0) {
      result = 'Empate';
    } else {
      result = `Ganador: ${winningPlayers
        .map((player) => `Jugador ${player.id}`)
        .join('.')}`;
    }
  }

  return (
    <Fragment>
      <Board players={game.players} gameStatus={game.gameStatus} />
      {game.gameStatus === GAME_ENDED && (
        <Result onClick={handleRestart} result={result} />
      )}
      {game.gameStatus === GAME_READY && <Start onClick={handleStart} />}
    </Fragment>
  );
}

export default App;
