import { describe, test } from "vite-plus/test";
import { op06GeckoMoria086 } from "../../../../../cards/src/cards/OP06/characters/086-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-086 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06GeckoMoria086);
  });
});
