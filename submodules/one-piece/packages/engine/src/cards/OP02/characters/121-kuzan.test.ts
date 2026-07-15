import { describe, test } from "vite-plus/test";
import { op02Kuzan121 } from "../../../../../cards/src/cards/OP02/characters/121-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-121 Kuzan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Kuzan121);
  });
});
