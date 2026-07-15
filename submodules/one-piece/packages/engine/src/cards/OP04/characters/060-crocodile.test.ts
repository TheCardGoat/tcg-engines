import { describe, test } from "vite-plus/test";
import { op04Crocodile060 } from "../../../../../cards/src/cards/OP04/characters/060-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-060 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Crocodile060);
  });
});
