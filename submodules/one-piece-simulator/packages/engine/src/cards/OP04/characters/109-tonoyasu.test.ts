import { describe, test } from "vite-plus/test";
import { op04Tonoyasu109 } from "../../../../../cards/src/cards/OP04/characters/109-tonoyasu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-109 Tonoyasu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Tonoyasu109);
  });
});
