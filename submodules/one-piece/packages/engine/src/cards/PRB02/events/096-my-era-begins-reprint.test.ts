import { describe, test } from "vite-plus/test";
import { prb02MyEraBeginsReprint096 } from "../../../../../cards/src/cards/PRB02/events/096-my-era-begins-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-096 My Era...Begins!! (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MyEraBeginsReprint096);
  });
});
