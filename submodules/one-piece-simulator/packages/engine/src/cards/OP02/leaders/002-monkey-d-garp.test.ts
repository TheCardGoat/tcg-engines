import { describe, test } from "vite-plus/test";
import { op02MonkeyDGarp002 } from "../../../../../cards/src/cards/OP02/leaders/002-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-002 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02MonkeyDGarp002);
  });
});
