import { describe, test } from "vite-plus/test";
import { op06MsAllSundaySp064 } from "../../../../../cards/src/cards/OP06/characters/064-ms-all-sunday-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-064 Ms. All Sunday (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06MsAllSundaySp064);
  });
});
