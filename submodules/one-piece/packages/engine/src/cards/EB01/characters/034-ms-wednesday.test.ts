import { describe, test } from "vite-plus/test";
import { eb01MsWednesday034 } from "../../../../../cards/src/cards/characters/eb01-034-ms-wednesday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-034 Ms. Wednesday", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01MsWednesday034);
  });
});
