import { describe, test } from "vite-plus/test";
import { op07RoronoaZoro034 } from "../../../../../cards/src/cards/characters/op07-034-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-034 Roronoa Zoro", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07RoronoaZoro034);
  });
});
