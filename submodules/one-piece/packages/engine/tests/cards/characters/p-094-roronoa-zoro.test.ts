import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-094 Roronoa Zoro", () => {
  test("On Play KOs rested cost 2, excludes active cost 2 and rested cost 3", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-094"], activeDon: 4 },
      {
        character: [
          { cardId: "ST01-009", rested: true },
          "ST01-009",
          { cardId: "ST01-008", rested: true },
        ],
      },
    );
    const id = e.getView("north").players.north.characters[0]!.instanceId;
    if (!id) throw Error("Missing target");
    e.asSouth().play("P-094");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(2);
  });
  test("declines optional up-to-one KO with legal target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-094"], activeDon: 4 },
      { character: [{ cardId: "ST01-009", rested: true }] },
    );
    e.asSouth().play("P-094");
    e.asSouth().chooseTargets();
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
});
