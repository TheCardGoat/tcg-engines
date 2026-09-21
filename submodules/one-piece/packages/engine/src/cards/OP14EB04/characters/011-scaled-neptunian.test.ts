import { describe, test } from "vite-plus/test";
import { op14eb04ScaledNeptunian011 } from "../../../../../cards/src/cards/characters/eb04-011-scaled-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-011 Scaled Neptunian", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04ScaledNeptunian011);
  });
});
