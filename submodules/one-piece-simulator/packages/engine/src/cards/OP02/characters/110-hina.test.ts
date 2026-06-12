import { describe, test } from "vite-plus/test";
import { op02Hina110 } from "../../../../../cards/src/cards/OP02/characters/110-hina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-110 Hina", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Hina110);
  });
});
