import { describe, test } from "vite-plus/test";
import { op01BeBeng059 } from "../../../../../cards/src/cards/events/op01-059-be-beng.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-059 BE-BENG!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BeBeng059);
  });
});
