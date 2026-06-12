import { describe, test } from "vite-plus/test";
import { op06ONami101 } from "../../../../../cards/src/cards/OP06/characters/101-o-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-101 O-Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06ONami101);
  });
});
