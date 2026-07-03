import { describe, test } from "vite-plus/test";
import { op01AshuraDoji032 } from "../../../../../cards/src/cards/OP01/characters/032-ashura-doji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-032 Ashura Doji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01AshuraDoji032);
  });
});
