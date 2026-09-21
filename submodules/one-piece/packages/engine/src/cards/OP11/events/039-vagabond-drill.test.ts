import { describe, test } from "vite-plus/test";
import { op11VagabondDrill039 } from "../../../../../cards/src/cards/events/op11-039-vagabond-drill.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-039 Vagabond Drill", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11VagabondDrill039);
  });
});
