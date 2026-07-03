import { describe, test } from "vite-plus/test";
import { op07TempestKick096 } from "../../../../../cards/src/cards/OP07/events/096-tempest-kick.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-096 Tempest Kick", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07TempestKick096);
  });
});
