import { describe, test } from "vite-plus/test";
import { op12RoronoaZoro036 } from "../../../../../cards/src/cards/OP12/characters/036-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-036 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12RoronoaZoro036);
  });
});
