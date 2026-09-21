import { describe, test } from "vite-plus/test";
import { op10EustassCaptainKid099 } from "../../../../../cards/src/cards/leaders/op10-099-eustass-captain-kid.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-099 099-eustass-captain-kid", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10EustassCaptainKid099);
  });
});
