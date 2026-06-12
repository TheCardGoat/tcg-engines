import { describe, test } from "vite-plus/test";
import { op14eb04Trebol068 } from "../../../../../cards/src/cards/OP14EB04/characters/068-trebol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-068 Trebol", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Trebol068);
  });
});
