import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st23-005-yasopp", () => {
  test.each(["leader", "character"])("gives one rested DON to %s and spends OPT", (kind) => {
    const e = OnePieceTestEngine.create({ character: ["ST23-005"], restedDon: 1 });
    const y = e.findCardInZone("south", "character", "ST23-005");
    e.activateEffect(y, "activateMain");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.asSouth().chooseTargets(kind === "leader" ? e.leader("south") : y);
    expect(
      kind === "leader"
        ? e.getView("south").players.south.leader.attachedDon
        : e.getView("south").players.south.characters[0]?.attachedDon,
    ).toBe(1);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: y,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });
  test("declines optional DON grant while rested DON is available", () => {
    const e = OnePieceTestEngine.create({ character: ["ST23-005"], restedDon: 1 });
    e.activateEffect(e.findCardInZone("south", "character", "ST23-005"), "activateMain");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
});
