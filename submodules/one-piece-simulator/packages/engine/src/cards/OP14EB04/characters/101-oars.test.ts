import { describe, test } from "vite-plus/test";
import { op14eb04Oars101 } from "../../../../../cards/src/cards/OP14EB04/characters/101-oars.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-101 Oars", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Oars101);
  });
});
