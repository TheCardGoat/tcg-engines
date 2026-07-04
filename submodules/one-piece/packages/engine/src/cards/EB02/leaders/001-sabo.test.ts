import { describe, test } from "vite-plus/test";
import { eb02Sabo001 } from "../../../../../cards/src/cards/EB02/leaders/001-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-001 Sabo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Sabo001);
  });
});
