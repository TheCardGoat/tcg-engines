import { describe, test } from "vite-plus/test";
import { op04Spiderweb035 } from "../../../../../cards/src/cards/events/op04-035-spiderweb.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-035 Spiderweb", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Spiderweb035);
  });
});
