import { expect, test } from "vitest";
import { zonePerspective } from "./zone-perspective";

test("the drop surface follows all four projected table corners", () => {
  const corners = [
    { x: 20, y: 0 },
    { x: 80, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ] as const;
  const matrix = zonePerspective(corners, 100, 100).slice(9, -1).split(",").map(Number);
  for (const [index, [x, y]] of [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
  ].entries()) {
    const w = matrix[3] * x + matrix[7] * y + matrix[15];
    expect((matrix[0] * x + matrix[4] * y + matrix[12]) / w).toBeCloseTo(corners[index].x);
    expect((matrix[1] * x + matrix[5] * y + matrix[13]) / w).toBeCloseTo(corners[index].y);
  }
});
