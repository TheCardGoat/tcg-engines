import { describe, test } from "vite-plus/test";
import { op12RoronoaZoro113 } from "../../../../../cards/src/cards/OP12/characters/113-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-113 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12RoronoaZoro113);
  });
});
