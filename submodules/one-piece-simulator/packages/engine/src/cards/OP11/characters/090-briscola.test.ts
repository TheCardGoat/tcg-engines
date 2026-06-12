import { describe, test } from "vite-plus/test";
import { op11Briscola090 } from "../../../../../cards/src/cards/OP11/characters/090-briscola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-090 Briscola", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Briscola090);
  });
});
