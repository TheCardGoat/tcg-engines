import { describe, test } from "vite-plus/test";
import { op01MsAllSunday079 } from "../../../../../cards/src/cards/OP01/characters/079-ms-all-sunday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-079 Ms. All Sunday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01MsAllSunday079);
  });
});
