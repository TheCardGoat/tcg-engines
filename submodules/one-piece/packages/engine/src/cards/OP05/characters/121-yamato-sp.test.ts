import { describe, test } from "vite-plus/test";
import { op05YamatoSp121 } from "../../../../../cards/src/cards/OP05/characters/121-yamato-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-121 Yamato (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05YamatoSp121);
  });
});
