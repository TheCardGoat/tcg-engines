import { describe, test } from "vite-plus/test";
import { eb01DidSomeoneSayKami060 } from "../../../../../cards/src/cards/EB01/events/060-did-someone-say-kami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-060 Did Someone Say...Kami?", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01DidSomeoneSayKami060);
  });
});
