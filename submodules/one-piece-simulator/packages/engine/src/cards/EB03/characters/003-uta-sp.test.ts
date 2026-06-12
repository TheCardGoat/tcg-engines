import { describe, test } from "vite-plus/test";
import { eb03UtaSp003 } from "../../../../../cards/src/cards/EB03/characters/003-uta-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-003 Uta (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03UtaSp003);
  });
});
