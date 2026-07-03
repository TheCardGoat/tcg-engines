import { describe, test } from "vite-plus/test";
import { op07RoronoaZoro034 } from "../../../../../cards/src/cards/OP07/characters/034-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-034 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07RoronoaZoro034);
  });
});
