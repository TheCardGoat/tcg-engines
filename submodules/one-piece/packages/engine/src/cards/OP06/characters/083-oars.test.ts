import { describe, test } from "vite-plus/test";
import { op06Oars083 } from "../../../../../cards/src/cards/OP06/characters/083-oars.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-083 Oars", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Oars083);
  });
});
