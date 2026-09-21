import { describe, test } from "vite-plus/test";
import { op04TruenoBastardo094 } from "../../../../../cards/src/cards/events/op04-094-trueno-bastardo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-094 Trueno Bastardo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04TruenoBastardo094);
  });
});
