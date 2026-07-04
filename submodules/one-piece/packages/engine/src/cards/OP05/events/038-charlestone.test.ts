import { describe, test } from "vite-plus/test";
import { op05Charlestone038 } from "../../../../../cards/src/cards/OP05/events/038-charlestone.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-038 Charlestone", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Charlestone038);
  });
});
