import sumCoordinates from 'utils/sumCoordinates';


//función para que si la suma de las coordenadas sea 0 no lo permita, no deja cambiar de dirección para retroceder.
export default function playerCanChangeToDirection(
  currentDirection,
  nextDirection
) {
  const result = sumCoordinates(currentDirection, nextDirection);
  return (
    Object.keys(result).filter((coordinate) => result[coordinate] !== 0)
      .length > 0
  );
}
