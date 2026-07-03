import { describe, test } from "vite-plus/test";
import { op08SShark111 } from "../../../../../cards/src/cards/OP08/characters/111-s-shark.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-111 S-Shark", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08SShark111);
  });
});
