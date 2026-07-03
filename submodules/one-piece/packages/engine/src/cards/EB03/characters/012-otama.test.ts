import { describe, test } from "vite-plus/test";
import { eb03Otama012 } from "../../../../../cards/src/cards/EB03/characters/012-otama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-012 Otama", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Otama012);
  });
});
