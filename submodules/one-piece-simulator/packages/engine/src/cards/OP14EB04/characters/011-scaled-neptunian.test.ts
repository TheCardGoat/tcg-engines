import { describe, test } from "vite-plus/test";
import { op14eb04ScaledNeptunian011 } from "../../../../../cards/src/cards/OP14EB04/characters/011-scaled-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB04-011 Scaled Neptunian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04ScaledNeptunian011);
  });
});
