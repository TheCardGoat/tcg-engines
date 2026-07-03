import { describe, test } from "vite-plus/test";
import { op01UltiMortar118 } from "../../../../../cards/src/cards/OP01/events/118-ulti-mortar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-118 Ulti-Mortar", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01UltiMortar118);
  });
});
