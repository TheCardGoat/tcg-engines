import { describe, test } from "vite-plus/test";
import { op04Bartolomeo089 } from "../../../../../cards/src/cards/characters/op04-089-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-089 Bartolomeo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Bartolomeo089);
  });
});
