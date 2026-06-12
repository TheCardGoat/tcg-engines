import { describe, test } from "vite-plus/test";
import { eb03Kaya023 } from "../../../../../cards/src/cards/EB03/characters/023-kaya.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-023 Kaya", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Kaya023);
  });
});
