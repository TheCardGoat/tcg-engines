import { describe, test } from "vite-plus/test";
import { op02RoronoaZoro043 } from "../../../../../cards/src/cards/OP02/characters/043-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-043 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02RoronoaZoro043);
  });
});
