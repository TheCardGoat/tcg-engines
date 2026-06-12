import { describe, test } from "vite-plus/test";
import { op06DouglasBullet010 } from "../../../../../cards/src/cards/OP06/characters/010-douglas-bullet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-010 Douglas Bullet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06DouglasBullet010);
  });
});
