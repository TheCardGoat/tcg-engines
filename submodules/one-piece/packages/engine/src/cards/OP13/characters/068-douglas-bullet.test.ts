import { describe, test } from "vite-plus/test";
import { op13DouglasBullet068 } from "../../../../../cards/src/cards/OP13/characters/068-douglas-bullet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-068 Douglas Bullet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13DouglasBullet068);
  });
});
