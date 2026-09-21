import { describe, test } from "vite-plus/test";
import { op14eb04ChakaPellEb04023023 } from "../../../../../cards/src/cards/characters/eb04-023-chaka-pell-eb04-023.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-023 Chaka & Pell - EB04-023", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04ChakaPellEb04023023);
  });
});
