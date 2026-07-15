import { describe, test } from "vite-plus/test";
import { op09Cabaji045 } from "../../../../../cards/src/cards/OP09/characters/045-cabaji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-045 Cabaji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Cabaji045);
  });
});
