import { describe, test } from "vite-plus/test";
import { op07OutlookIii003 } from "../../../../../cards/src/cards/OP07/characters/003-outlook-iii.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-003 Outlook III", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07OutlookIii003);
  });
});
