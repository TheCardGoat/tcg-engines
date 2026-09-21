import { describe, test } from "vite-plus/test";
import { op04Orlumbus079 } from "../../../../../cards/src/cards/characters/op04-079-orlumbus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-079 Orlumbus", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Orlumbus079);
  });
});
