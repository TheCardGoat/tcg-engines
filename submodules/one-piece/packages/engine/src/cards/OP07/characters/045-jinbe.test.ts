import { describe, test } from "vite-plus/test";
import { op07Jinbe045 } from "../../../../../cards/src/cards/OP07/characters/045-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-045 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Jinbe045);
  });
});
