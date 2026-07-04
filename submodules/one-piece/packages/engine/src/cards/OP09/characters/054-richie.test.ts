import { describe, test } from "vite-plus/test";
import { op09Richie054 } from "../../../../../cards/src/cards/OP09/characters/054-richie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-054 Richie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Richie054);
  });
});
