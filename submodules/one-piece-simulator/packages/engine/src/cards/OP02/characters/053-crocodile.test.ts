import { describe, test } from "vite-plus/test";
import { op02Crocodile053 } from "../../../../../cards/src/cards/OP02/characters/053-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-053 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Crocodile053);
  });
});
