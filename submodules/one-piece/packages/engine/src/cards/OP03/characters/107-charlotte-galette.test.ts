import { describe, test } from "vite-plus/test";
import { op03CharlotteGalette107 } from "../../../../../cards/src/cards/characters/op03-107-charlotte-galette.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-107 Charlotte Galette", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteGalette107);
  });
});
