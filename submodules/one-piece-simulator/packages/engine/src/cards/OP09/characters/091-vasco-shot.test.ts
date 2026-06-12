import { describe, test } from "vite-plus/test";
import { op09VascoShot091 } from "../../../../../cards/src/cards/OP09/characters/091-vasco-shot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-091 Vasco Shot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09VascoShot091);
  });
});
