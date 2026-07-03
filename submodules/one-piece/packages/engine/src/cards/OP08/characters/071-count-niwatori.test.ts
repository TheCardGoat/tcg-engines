import { describe, test } from "vite-plus/test";
import { op08CountNiwatori071 } from "../../../../../cards/src/cards/OP08/characters/071-count-niwatori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-071 Count Niwatori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CountNiwatori071);
  });
});
