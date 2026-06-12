import { describe, test } from "vite-plus/test";
import { op14eb04Rindo115 } from "../../../../../cards/src/cards/OP14EB04/characters/115-rindo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-115 Rindo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Rindo115);
  });
});
