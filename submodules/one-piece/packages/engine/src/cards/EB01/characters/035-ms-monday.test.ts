import { describe, test } from "vite-plus/test";
import { eb01MsMonday035 } from "../../../../../cards/src/cards/EB01/characters/035-ms-monday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-035 Ms. Monday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01MsMonday035);
  });
});
