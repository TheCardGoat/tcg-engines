import { describe, test } from "vite-plus/test";
import { eb02DonAccino004 } from "../../../../../cards/src/cards/characters/eb02-004-don-accino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-004 Don Accino", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02DonAccino004);
  });
});
