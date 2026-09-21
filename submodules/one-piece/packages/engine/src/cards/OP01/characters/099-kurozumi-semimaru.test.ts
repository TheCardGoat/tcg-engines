import { describe, test } from "vite-plus/test";
import { op01KurozumiSemimaru099 } from "../../../../../cards/src/cards/characters/op01-099-kurozumi-semimaru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-099 Kurozumi Semimaru", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01KurozumiSemimaru099);
  });
});
