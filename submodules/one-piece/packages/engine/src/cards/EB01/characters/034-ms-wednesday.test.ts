import { describe, test } from "vite-plus/test";
import { eb01MsWednesday034 } from "../../../../../cards/src/cards/EB01/characters/034-ms-wednesday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-034 Ms. Wednesday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01MsWednesday034);
  });
});
