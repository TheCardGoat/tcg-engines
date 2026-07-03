import { describe, test } from "vite-plus/test";
import { eb02Usopp022 } from "../../../../../cards/src/cards/EB02/characters/022-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-022 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Usopp022);
  });
});
