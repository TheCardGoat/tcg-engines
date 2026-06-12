import { describe, test } from "vite-plus/test";
import { op04Kyros082 } from "../../../../../cards/src/cards/OP04/characters/082-kyros.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-082 Kyros", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Kyros082);
  });
});
