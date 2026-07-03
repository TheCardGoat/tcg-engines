import { describe, test } from "vite-plus/test";
import { op04DaddyMasterson027 } from "../../../../../cards/src/cards/OP04/characters/027-daddy-masterson.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-027 Daddy Masterson", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04DaddyMasterson027);
  });
});
