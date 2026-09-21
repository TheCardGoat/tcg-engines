import { describe, test } from "vite-plus/test";
import { op05PunkRotten078 } from "../../../../../cards/src/cards/events/op05-078-punk-rotten.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-078 Punk Rotten", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05PunkRotten078);
  });
});
