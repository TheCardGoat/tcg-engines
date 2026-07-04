import { describe, test } from "vite-plus/test";
import { op14eb04CoffinBoat039 } from "../../../../../cards/src/cards/OP14EB04/stages/039-coffin-boat.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-039 Coffin Boat", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04CoffinBoat039);
  });
});
