import { describe, test } from "vite-plus/test";
import { eb02Klabautermann033 } from "../../../../../cards/src/cards/EB02/characters/033-klabautermann.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-033 Klabautermann", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Klabautermann033);
  });
});
