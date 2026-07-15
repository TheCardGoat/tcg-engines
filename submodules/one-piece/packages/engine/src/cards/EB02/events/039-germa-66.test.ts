import { describe, test } from "vite-plus/test";
import { eb02Germa66039 } from "../../../../../cards/src/cards/EB02/events/039-germa-66.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-039 GERMA 66", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Germa66039);
  });
});
