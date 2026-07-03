import { describe, test } from "vite-plus/test";
import { op11Jinbe031 } from "../../../../../cards/src/cards/OP11/characters/031-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-031 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Jinbe031);
  });
});
