import { describe, test } from "vite-plus/test";
import { op04Mr13MsFriday073 } from "../../../../../cards/src/cards/OP04/characters/073-mr-13-ms-friday.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-073 Mr.13 & Ms.Friday", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Mr13MsFriday073);
  });
});
