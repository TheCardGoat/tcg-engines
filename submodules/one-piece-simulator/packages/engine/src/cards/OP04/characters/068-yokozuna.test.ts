import { describe, test } from "vite-plus/test";
import { op04Yokozuna068 } from "../../../../../cards/src/cards/OP04/characters/068-yokozuna.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-068 Yokozuna", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Yokozuna068);
  });
});
