import { describe, test } from "vite-plus/test";
import { op07Sabo118 } from "../../../../../cards/src/cards/OP07/characters/118-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-118 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Sabo118);
  });
});
