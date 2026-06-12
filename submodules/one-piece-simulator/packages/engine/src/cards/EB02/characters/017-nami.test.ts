import { describe, test } from "vite-plus/test";
import { eb02Nami017 } from "../../../../../cards/src/cards/EB02/characters/017-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-017 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Nami017);
  });
});
