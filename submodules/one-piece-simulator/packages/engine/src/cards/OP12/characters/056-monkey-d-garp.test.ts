import { describe, test } from "vite-plus/test";
import { op12MonkeyDGarp056 } from "../../../../../cards/src/cards/OP12/characters/056-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-056 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12MonkeyDGarp056);
  });
});
