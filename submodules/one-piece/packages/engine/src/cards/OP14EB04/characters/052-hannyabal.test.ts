import { describe, test } from "vite-plus/test";
import { op14eb04Hannyabal052 } from "../../../../../cards/src/cards/OP14EB04/characters/052-hannyabal.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-052 Hannyabal", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Hannyabal052);
  });
});
