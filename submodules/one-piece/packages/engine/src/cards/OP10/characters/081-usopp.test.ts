import { describe, test } from "vite-plus/test";
import { op10Usopp081 } from "../../../../../cards/src/cards/OP10/characters/081-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-081 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Usopp081);
  });
});
