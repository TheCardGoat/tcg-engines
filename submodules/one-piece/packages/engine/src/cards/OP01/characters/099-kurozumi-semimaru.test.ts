import { describe, test } from "vite-plus/test";
import { op01KurozumiSemimaru099 } from "../../../../../cards/src/cards/OP01/characters/099-kurozumi-semimaru.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-099 Kurozumi Semimaru", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01KurozumiSemimaru099);
  });
});
