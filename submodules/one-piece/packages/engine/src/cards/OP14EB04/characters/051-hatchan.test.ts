import { describe, test } from "vite-plus/test";
import { op14eb04Hatchan051 } from "../../../../../cards/src/cards/OP14EB04/characters/051-hatchan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-051 Hatchan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Hatchan051);
  });
});
