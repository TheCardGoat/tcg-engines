import { describe, test } from "vite-plus/test";
import { op09GeckoMoria085 } from "../../../../../cards/src/cards/OP09/characters/085-gecko-moria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-085 Gecko Moria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09GeckoMoria085);
  });
});
