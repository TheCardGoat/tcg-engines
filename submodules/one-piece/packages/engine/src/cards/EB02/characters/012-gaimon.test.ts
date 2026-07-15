import { describe, test } from "vite-plus/test";
import { eb02Gaimon012 } from "../../../../../cards/src/cards/EB02/characters/012-gaimon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-012 Gaimon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Gaimon012);
  });
});
