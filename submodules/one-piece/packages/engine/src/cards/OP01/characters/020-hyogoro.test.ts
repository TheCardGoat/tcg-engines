import { describe, test } from "vite-plus/test";
import { op01Hyogoro020 } from "../../../../../cards/src/cards/OP01/characters/020-hyogoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-020 Hyogoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Hyogoro020);
  });
});
