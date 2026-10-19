export type ScreenPoint = { x: number; y: number };

/** Map a DOM rectangle onto the table's projected corners, in clockwise order. */
export function zonePerspective(
  corners: readonly [ScreenPoint, ScreenPoint, ScreenPoint, ScreenPoint],
  width: number,
  height: number,
): string {
  const [a, b, c, d] = corners;
  const dx1 = b.x - c.x;
  const dx2 = d.x - c.x;
  const dx3 = a.x - b.x + c.x - d.x;
  const dy1 = b.y - c.y;
  const dy2 = d.y - c.y;
  const dy3 = a.y - b.y + c.y - d.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / determinant;
  const h = (dx1 * dy3 - dx3 * dy1) / determinant;
  return `matrix3d(${[
    (b.x - a.x + g * b.x) / width,
    (b.y - a.y + g * b.y) / width,
    0,
    g / width,
    (d.x - a.x + h * d.x) / height,
    (d.y - a.y + h * d.y) / height,
    0,
    h / height,
    0,
    0,
    1,
    0,
    a.x,
    a.y,
    0,
    1,
  ].join(",")})`;
}
