import { describe, test } from "vite-plus/test";
import { op13Blamenco048 } from "../../../../../cards/src/cards/OP13/characters/048-blamenco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-048 Blamenco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Blamenco048);
  });
});
