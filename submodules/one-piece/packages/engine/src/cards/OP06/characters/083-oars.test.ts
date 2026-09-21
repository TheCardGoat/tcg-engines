import { describe, test } from "vite-plus/test";
import { op06Oars083 } from "../../../../../cards/src/cards/characters/op06-083-oars.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-083 Oars", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Oars083);
  });
});
