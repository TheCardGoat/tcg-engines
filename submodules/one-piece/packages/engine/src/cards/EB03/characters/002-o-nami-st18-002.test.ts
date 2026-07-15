import { describe, test } from "vite-plus/test";
import { eb03ONamiSt18002002 } from "../../../../../cards/src/cards/EB03/characters/002-o-nami-st18-002.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-002 O-Nami - ST18-002", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03ONamiSt18002002);
  });
});
