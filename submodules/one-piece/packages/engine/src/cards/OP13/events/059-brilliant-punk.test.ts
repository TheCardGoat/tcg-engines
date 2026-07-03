import { describe, test } from "vite-plus/test";
import { op13BrilliantPunk059 } from "../../../../../cards/src/cards/OP13/events/059-brilliant-punk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-059 Brilliant Punk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13BrilliantPunk059);
  });
});
