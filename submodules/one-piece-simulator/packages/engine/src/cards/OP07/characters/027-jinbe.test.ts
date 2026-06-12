import { describe, test } from "vite-plus/test";
import { op07Jinbe027 } from "../../../../../cards/src/cards/OP07/characters/027-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-027 Jinbe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Jinbe027);
  });
});
