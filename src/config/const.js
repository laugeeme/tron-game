export const UNIT = 15; //define tamaño de la nave
export const BOARD_SIZE = 750; //define tamaño del tablero



//constantes para ver el estado inicial del juego
export const GAME_READY = 1;
export const GAME_PLAYING = 2;
export const GAME_ENDED = 3;




//objeto que va a almacenar las direcciones y la forma en que hay que actualizar la posición
export const DIRECTIONS = {
  LEFT: { x: -UNIT, y: 0 },
  RIGHT: { x: UNIT, y: 0 },
  UP: { x: 0, y: -UNIT },
  DOWN: { x: 0, y: UNIT },
};

export const PLAYER_ONE = {
  //definimos jugador 1
  color: '#AB1091',
  id: '1',
  keys: {
    38: DIRECTIONS.UP,
    39: DIRECTIONS.RIGHT,
    40: DIRECTIONS.DOWN,
    37: DIRECTIONS.LEFT,
  },
  direction: DIRECTIONS.RIGHT,
  position: { x: UNIT * 6, y: UNIT * 6 },
  hasDied: false,
  instructions: 'Usa las flechas de dirección'
};

export const PLAYER_TWO = {
  //definimos jugador 2
  color: '#0000CC',
  id: '2',
  keys: {
    87: DIRECTIONS.UP,
    68: DIRECTIONS.RIGHT,
    83: DIRECTIONS.DOWN,
    65: DIRECTIONS.LEFT,
  },
  direction: DIRECTIONS.LEFT,
  position: { x: UNIT * 43, y: UNIT * 43 },
  hasDied: false,
  instructions: 'Usa las teclas AWSD'
};
