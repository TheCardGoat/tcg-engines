import { describe, test } from "vite-plus/test";
import { op11LordOfTheCoast028 } from "../../../../../cards/src/cards/OP11/characters/028-lord-of-the-coast.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-028 Lord of the Coast", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11LordOfTheCoast028);
  });
});
