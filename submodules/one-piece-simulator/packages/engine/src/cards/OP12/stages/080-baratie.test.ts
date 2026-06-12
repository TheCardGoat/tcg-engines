import { describe, test } from "vite-plus/test";
import { op12Baratie080 } from "../../../../../cards/src/cards/OP12/stages/080-baratie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-080 Baratie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Baratie080);
  });
});
