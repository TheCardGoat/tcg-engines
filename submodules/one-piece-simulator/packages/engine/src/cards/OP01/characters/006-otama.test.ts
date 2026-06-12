import { describe, test } from "vite-plus/test";
import { op01Otama006 } from "../../../../../cards/src/cards/OP01/characters/006-otama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-006 Otama", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Otama006);
  });
});
