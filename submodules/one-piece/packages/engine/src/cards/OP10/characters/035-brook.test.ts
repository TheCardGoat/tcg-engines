import { describe, test } from "vite-plus/test";
import { op10Brook035 } from "../../../../../cards/src/cards/OP10/characters/035-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-035 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Brook035);
  });
});
