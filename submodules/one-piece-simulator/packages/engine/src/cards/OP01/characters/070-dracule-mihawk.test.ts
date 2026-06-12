import { describe, test } from "vite-plus/test";
import { op01DraculeMihawk070 } from "../../../../../cards/src/cards/OP01/characters/070-dracule-mihawk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-070 Dracule Mihawk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01DraculeMihawk070);
  });
});
