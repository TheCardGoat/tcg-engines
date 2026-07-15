import { describe, test } from "vite-plus/test";
import { op13ButAceHereSaidYouDeservedIt019 } from "../../../../../cards/src/cards/OP13/events/019-but-ace-here-said-you-deserved-it.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-019 But Ace Here Said You Deserved It!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13ButAceHereSaidYouDeservedIt019);
  });
});
