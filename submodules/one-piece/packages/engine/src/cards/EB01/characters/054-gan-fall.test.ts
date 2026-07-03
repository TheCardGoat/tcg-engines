import { describe, test } from "vite-plus/test";
import { eb01GanFall054 } from "../../../../../cards/src/cards/EB01/characters/054-gan-fall.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-054 Gan.Fall", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01GanFall054);
  });
});
