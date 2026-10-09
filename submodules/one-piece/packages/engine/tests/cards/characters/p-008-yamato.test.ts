import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P008 Yamato", () => {
  test("self-rest pays for exact one opponent cost<=2 target", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-008"] },
      { character: ["ST01-006", "ST29-011", "ST29-002"] },
    );
    const source = e.findCardInZone("south", "character", "P-008"),
      target = e.findCardInZone("north", "character", "ST29-011"),
      high = e.findCardInZone("north", "character", "ST29-002");
    e.asSouth().activateMain(source);
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.min).toBe(1);
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(high);
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
  });
  test("declines optional self-rest payment", () => {
    const e = OnePieceTestEngine.create({ character: ["P-008"] }, { character: ["ST29-011"] });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "P-008"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
  test("already rested source cannot pay", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-008", rested: true }] },
      { character: ["ST29-011"] },
    );
    const f = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "P-008"),
      trigger: "activateMain",
    });
    expect(
      OnePieceTestEngine.fromState(f.state).getView("north").players.north.characters[0]?.rested,
    ).toBe(false);
  });
  test("FAQ may pay self rest even with no eligible opposing Character", () => {
    const e = OnePieceTestEngine.create({ character: ["P-008"] }, { character: ["ST29-002"] });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "P-008"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
