import { describe, test } from "vite-plus/test";
import { op10JesusBurgess085 } from "../../../../../cards/src/cards/OP10/characters/085-jesus-burgess.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-085 Jesus Burgess", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10JesusBurgess085);
  });
});
