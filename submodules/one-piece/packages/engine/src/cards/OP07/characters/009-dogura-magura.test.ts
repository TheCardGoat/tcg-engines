import { describe, test } from "vite-plus/test";
import { op07DoguraMagura009 } from "../../../../../cards/src/cards/characters/op07-009-dogura-magura.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-009 Dogura & Magura", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07DoguraMagura009);
  });
});
