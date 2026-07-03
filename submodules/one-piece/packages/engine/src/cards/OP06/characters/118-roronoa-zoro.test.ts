import { describe, test } from "vite-plus/test";
import { op06RoronoaZoro118 } from "../../../../../cards/src/cards/OP06/characters/118-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-118 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06RoronoaZoro118);
  });
});
