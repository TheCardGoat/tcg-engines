import { describe, test } from "vite-plus/test";
import { eb02Arlong011 } from "../../../../../cards/src/cards/EB02/characters/011-arlong.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-011 Arlong", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Arlong011);
  });
});
