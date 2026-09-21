import { describe, test } from "vite-plus/test";
import { op02RoronoaZoro043 } from "../../../../../cards/src/cards/characters/op02-043-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-043 Roronoa Zoro", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02RoronoaZoro043);
  });
});
