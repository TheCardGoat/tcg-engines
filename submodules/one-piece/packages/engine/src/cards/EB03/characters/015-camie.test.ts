import { describe, test } from "vite-plus/test";
import { eb03Camie015 } from "../../../../../cards/src/cards/EB03/characters/015-camie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-015 Camie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Camie015);
  });
});
