import { describe, test } from "vite-plus/test";
import { eb01Fourtricks025 } from "../../../../../cards/src/cards/EB01/characters/025-fourtricks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-025 Fourtricks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Fourtricks025);
  });
});
