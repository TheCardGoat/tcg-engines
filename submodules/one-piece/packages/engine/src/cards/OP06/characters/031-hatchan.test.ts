import { describe, test } from "vite-plus/test";
import { op06Hatchan031 } from "../../../../../cards/src/cards/OP06/characters/031-hatchan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-031 Hatchan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Hatchan031);
  });
});
