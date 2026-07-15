import { describe, test } from "vite-plus/test";
import { op03CharlottePraline111 } from "../../../../../cards/src/cards/OP03/characters/111-charlotte-praline.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-111 Charlotte Praline", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlottePraline111);
  });
});
