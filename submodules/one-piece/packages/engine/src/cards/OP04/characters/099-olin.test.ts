import { describe, test } from "vite-plus/test";
import { op04Olin099 } from "../../../../../cards/src/cards/OP04/characters/099-olin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-099 Olin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Olin099);
  });
});
