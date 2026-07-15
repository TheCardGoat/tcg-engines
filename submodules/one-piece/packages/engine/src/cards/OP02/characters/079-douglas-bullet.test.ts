import { describe, test } from "vite-plus/test";
import { op02DouglasBullet079 } from "../../../../../cards/src/cards/OP02/characters/079-douglas-bullet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-079 Douglas Bullet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DouglasBullet079);
  });
});
