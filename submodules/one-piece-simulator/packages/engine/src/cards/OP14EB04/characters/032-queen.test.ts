import { describe, test } from "vite-plus/test";
import { op14eb04Queen032 } from "../../../../../cards/src/cards/OP14EB04/characters/032-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-032 Queen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Queen032);
  });
});
