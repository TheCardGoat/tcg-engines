import { describe, test } from "vite-plus/test";
import { op04Usopp003 } from "../../../../../cards/src/cards/OP04/characters/003-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-003 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Usopp003);
  });
});
