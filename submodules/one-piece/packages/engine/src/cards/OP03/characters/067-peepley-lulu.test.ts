import { describe, test } from "vite-plus/test";
import { op03PeepleyLulu067 } from "../../../../../cards/src/cards/OP03/characters/067-peepley-lulu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-067 Peepley Lulu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03PeepleyLulu067);
  });
});
