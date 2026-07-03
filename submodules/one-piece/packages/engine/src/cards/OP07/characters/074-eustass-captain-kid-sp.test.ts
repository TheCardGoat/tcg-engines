import { describe, test } from "vite-plus/test";
import { op07EustassCaptainKidSp074 } from "../../../../../cards/src/cards/OP07/characters/074-eustass-captain-kid-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-074 074-eustass-captain-kid-sp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07EustassCaptainKidSp074);
  });
});
