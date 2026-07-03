import { describe, test } from "vite-plus/test";
import { eb01Izo002 } from "../../../../../cards/src/cards/EB01/characters/002-izo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-002 Izo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Izo002);
  });
});
