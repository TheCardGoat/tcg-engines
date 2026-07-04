import { describe, test } from "vite-plus/test";
import { op12Kuzan040 } from "../../../../../cards/src/cards/OP12/leaders/040-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-040 Kuzan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Kuzan040);
  });
});
