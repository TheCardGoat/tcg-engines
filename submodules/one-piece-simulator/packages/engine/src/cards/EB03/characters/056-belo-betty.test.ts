import { describe, test } from "vite-plus/test";
import { eb03BeloBetty056 } from "../../../../../cards/src/cards/EB03/characters/056-belo-betty.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-056 Belo Betty", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03BeloBetty056);
  });
});
