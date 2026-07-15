import { describe, test } from "vite-plus/test";
import { op05PunkRotten078 } from "../../../../../cards/src/cards/OP05/events/078-punk-rotten.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-078 Punk Rotten", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05PunkRotten078);
  });
});
