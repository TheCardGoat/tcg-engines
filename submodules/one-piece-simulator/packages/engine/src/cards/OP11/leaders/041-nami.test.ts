import { describe, test } from "vite-plus/test";
import { op11Nami041 } from "../../../../../cards/src/cards/OP11/leaders/041-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-041 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Nami041);
  });
});
