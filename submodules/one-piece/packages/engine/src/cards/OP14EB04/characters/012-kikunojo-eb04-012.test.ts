import { describe, test } from "vite-plus/test";
import { op14eb04KikunojoEb04012012 } from "../../../../../cards/src/cards/OP14EB04/characters/012-kikunojo-eb04-012.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-012 Kikunojo - EB04-012", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04KikunojoEb04012012);
  });
});
