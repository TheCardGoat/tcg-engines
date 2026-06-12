import { describe, test } from "vite-plus/test";
import { op12DouglasBullet010 } from "../../../../../cards/src/cards/OP12/characters/010-douglas-bullet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-010 Douglas Bullet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12DouglasBullet010);
  });
});
