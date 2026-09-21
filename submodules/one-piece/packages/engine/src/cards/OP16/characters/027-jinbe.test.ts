import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

function jinbePower(attachedDon: number) {
  const engine = OnePieceTestEngine.create(
    { character: [{ cardId: "OP16-027", attachedDon }] },
    {},
  );
  return engine
    .getView("south")
    .players.south.characters.flatMap((card) =>
      card?.cardId === "OP16-027" ? [card.power] : [],
    )[0];
}

describe("OP16-027 Jinbe", () => {
  test("[DON!! x1] gains +2000 power while a DON!! is attached", () => {
    expect(jinbePower(1)).toBe(5000);
  });

  test("without an attached DON!! the power bonus does not apply", () => {
    expect(jinbePower(0)).toBe(2000);
  });
});
