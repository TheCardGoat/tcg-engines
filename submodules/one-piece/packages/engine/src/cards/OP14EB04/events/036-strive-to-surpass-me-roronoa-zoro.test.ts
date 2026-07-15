import { describe, test } from "vite-plus/test";
import { op14eb04StriveToSurpassMeRoronoaZoro036 } from "../../../../../cards/src/cards/OP14EB04/events/036-strive-to-surpass-me-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-036 Strive to Surpass me, Roronoa Zoro!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04StriveToSurpassMeRoronoaZoro036);
  });
});
