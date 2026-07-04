import { describe, test } from "vite-plus/test";
import { op09Killer064 } from "../../../../../cards/src/cards/OP09/characters/064-killer.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-064 Killer", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Killer064);
  });
});
