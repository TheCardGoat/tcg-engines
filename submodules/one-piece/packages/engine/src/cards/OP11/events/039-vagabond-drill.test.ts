import { describe, test } from "vite-plus/test";
import { op11VagabondDrill039 } from "../../../../../cards/src/cards/OP11/events/039-vagabond-drill.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-039 Vagabond Drill", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11VagabondDrill039);
  });
});
