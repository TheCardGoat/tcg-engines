import { describe, test } from "vite-plus/test";
import { op01RoronoaZoro001 } from "../../../../../cards/src/cards/OP01/leaders/001-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-001 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01RoronoaZoro001);
  });
});
