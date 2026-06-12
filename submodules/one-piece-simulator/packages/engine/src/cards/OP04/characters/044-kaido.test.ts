import { describe, test } from "vite-plus/test";
import { op04Kaido044 } from "../../../../../cards/src/cards/OP04/characters/044-kaido.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-044 Kaido", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Kaido044);
  });
});
