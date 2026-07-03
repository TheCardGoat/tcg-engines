import { describe, test } from "vite-plus/test";
import { op02Jango100 } from "../../../../../cards/src/cards/OP02/characters/100-jango.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-100 Jango", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Jango100);
  });
});
