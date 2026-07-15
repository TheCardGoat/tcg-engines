import { describe, test } from "vite-plus/test";
import { op01BeBeng059 } from "../../../../../cards/src/cards/OP01/events/059-be-beng.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-059 BE-BENG!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BeBeng059);
  });
});
