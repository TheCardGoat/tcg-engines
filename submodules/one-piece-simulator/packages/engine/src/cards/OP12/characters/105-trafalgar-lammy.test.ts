import { describe, test } from "vite-plus/test";
import { op12TrafalgarLammy105 } from "../../../../../cards/src/cards/OP12/characters/105-trafalgar-lammy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-105 Trafalgar Lammy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12TrafalgarLammy105);
  });
});
