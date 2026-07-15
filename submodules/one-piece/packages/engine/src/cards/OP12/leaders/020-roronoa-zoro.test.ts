import { describe, test } from "vite-plus/test";
import { op12RoronoaZoro020 } from "../../../../../cards/src/cards/OP12/leaders/020-roronoa-zoro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-020 Roronoa Zoro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12RoronoaZoro020);
  });
});
