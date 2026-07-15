import { describe, test } from "vite-plus/test";
import { op04Rebecca039 } from "../../../../../cards/src/cards/OP04/leaders/039-rebecca.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-039 Rebecca", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Rebecca039);
  });
});
