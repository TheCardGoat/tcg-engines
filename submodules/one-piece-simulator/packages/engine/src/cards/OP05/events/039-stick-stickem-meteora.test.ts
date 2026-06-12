import { describe, test } from "vite-plus/test";
import { op05StickStickemMeteora039 } from "../../../../../cards/src/cards/OP05/events/039-stick-stickem-meteora.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-039 Stick-Stickem Meteora", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05StickStickemMeteora039);
  });
});
