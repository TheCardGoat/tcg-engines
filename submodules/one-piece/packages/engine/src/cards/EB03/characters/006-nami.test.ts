import { describe, test } from "vite-plus/test";
import { eb03Nami006 } from "../../../../../cards/src/cards/EB03/characters/006-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-006 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Nami006);
  });
});
