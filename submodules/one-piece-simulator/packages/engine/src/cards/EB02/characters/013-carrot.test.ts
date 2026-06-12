import { describe, test } from "vite-plus/test";
import { eb02Carrot013 } from "../../../../../cards/src/cards/EB02/characters/013-carrot.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-013 Carrot", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Carrot013);
  });
});
