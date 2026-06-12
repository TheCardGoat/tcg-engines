import { describe, test } from "vite-plus/test";
import { op07Jinbe102 } from "../../../../../cards/src/cards/OP07/characters/102-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-102 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Jinbe102);
  });
});
