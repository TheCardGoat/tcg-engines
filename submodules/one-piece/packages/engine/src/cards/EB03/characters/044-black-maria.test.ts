import { describe, test } from "vite-plus/test";
import { eb03BlackMaria044 } from "../../../../../cards/src/cards/EB03/characters/044-black-maria.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-044 Black Maria", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03BlackMaria044);
  });
});
