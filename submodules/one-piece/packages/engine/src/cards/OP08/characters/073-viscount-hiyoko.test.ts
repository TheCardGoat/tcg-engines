import { describe, test } from "vite-plus/test";
import { op08ViscountHiyoko073 } from "../../../../../cards/src/cards/OP08/characters/073-viscount-hiyoko.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-073 Viscount Hiyoko", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08ViscountHiyoko073);
  });
});
