import { describe, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039 } from "../../../../../cards/src/cards/EB01/events/039-conquerer-of-three-worlds-ragnaraku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-039 Conquerer of Three Worlds Ragnaraku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01ConquererOfThreeWorldsRagnaraku039);
  });
});
