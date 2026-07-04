import { describe, test } from "vite-plus/test";
import { op05MissDoublefingerZala073 } from "../../../../../cards/src/cards/OP05/characters/073-miss-doublefinger-zala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-073 Miss Doublefinger(Zala)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05MissDoublefingerZala073);
  });
});
