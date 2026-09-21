import { describe, test } from "vite-plus/test";
import { op04Olin099 } from "../../../../../cards/src/cards/characters/op04-099-olin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-099 Olin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Olin099);
  });
});
