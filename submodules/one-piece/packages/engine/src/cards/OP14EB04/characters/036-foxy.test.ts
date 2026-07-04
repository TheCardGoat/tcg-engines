import { describe, test } from "vite-plus/test";
import { op14eb04Foxy036 } from "../../../../../cards/src/cards/OP14EB04/characters/036-foxy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-036 Foxy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Foxy036);
  });
});
