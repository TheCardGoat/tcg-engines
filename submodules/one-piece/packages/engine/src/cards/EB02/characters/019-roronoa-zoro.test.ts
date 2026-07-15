import { describe, test } from "vite-plus/test";
import { eb02RoronoaZoro019 } from "../../../../../cards/src/cards/EB02/characters/019-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-019 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02RoronoaZoro019);
  });
});
