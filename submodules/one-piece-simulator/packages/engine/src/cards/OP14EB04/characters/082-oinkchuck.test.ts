import { describe, test } from "vite-plus/test";
import { op14eb04Oinkchuck082 } from "../../../../../cards/src/cards/OP14EB04/characters/082-oinkchuck.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-082 Oinkchuck", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Oinkchuck082);
  });
});
