import { describe, test } from "vite-plus/test";
import { op06Kumacy085 } from "../../../../../cards/src/cards/OP06/characters/085-kumacy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-085 Kumacy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Kumacy085);
  });
});
