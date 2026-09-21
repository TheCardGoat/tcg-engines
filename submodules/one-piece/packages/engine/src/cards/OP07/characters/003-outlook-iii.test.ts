import { describe, test } from "vite-plus/test";
import { op07OutlookIii003 } from "../../../../../cards/src/cards/characters/op07-003-outlook-iii.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-003 Outlook III", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07OutlookIii003);
  });
});
