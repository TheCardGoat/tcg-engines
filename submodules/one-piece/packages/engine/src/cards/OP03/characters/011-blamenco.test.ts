import { describe, test } from "vite-plus/test";
import { op03Blamenco011 } from "../../../../../cards/src/cards/OP03/characters/011-blamenco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-011 Blamenco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Blamenco011);
  });
});
