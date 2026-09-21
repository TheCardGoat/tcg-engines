import { describe, test } from "vite-plus/test";
import { op05EustassCaptainKid074 } from "../../../../../cards/src/cards/characters/op05-074-eustass-captain-kid.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-074 074-eustass-captain-kid", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05EustassCaptainKid074);
  });
});
