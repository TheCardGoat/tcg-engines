import { describe, test } from "vite-plus/test";
import { op07GeckoMoria042 } from "../../../../../cards/src/cards/OP07/characters/042-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-042 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07GeckoMoria042);
  });
});
