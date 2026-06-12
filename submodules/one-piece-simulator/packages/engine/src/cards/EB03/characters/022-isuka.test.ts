import { describe, test } from "vite-plus/test";
import { eb03Isuka022 } from "../../../../../cards/src/cards/EB03/characters/022-isuka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-022 Isuka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Isuka022);
  });
});
