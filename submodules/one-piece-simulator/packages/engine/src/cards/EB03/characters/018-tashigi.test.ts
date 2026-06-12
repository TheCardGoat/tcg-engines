import { describe, test } from "vite-plus/test";
import { eb03Tashigi018 } from "../../../../../cards/src/cards/EB03/characters/018-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-018 Tashigi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Tashigi018);
  });
});
