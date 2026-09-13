import { describe, expect, it } from "vitest";
import { deathDealer } from "../../../../cards/src/cards/weapons/death-dealer.ts";
import { jubeelSpellbane } from "../../../../cards/src/cards/weapons/jubeel-spellbane.ts";
import { cintariSaber } from "../../../../cards/src/cards/weapons/cintari-saber.ts";
import { driftwoodQuiver } from "../../../../cards/src/cards/equipment/driftwood-quiver.ts";
import { riptideLurkerOfTheDeep } from "../../../../cards/src/cards/heroes/riptide-lurker-of-the-deep.ts";
import { zaneBroadlyBeloved } from "../../../../cards/src/cards/heroes/zane-broadly-beloved.ts";
import { rhinar } from "../../../../cards/src/cards/heroes/rhinar.ts";
import { FabTestEngine } from "../../testing/index.ts";
import type { FabCardDefinitionInput } from "../../cards.ts";
import { snapshotObject } from "../snapshots.ts";
import { nextFreeWeaponSlot } from "./shared.ts";

// Kernel contract: read actual runtime occupants and evaluate hero handedness.
function resolve(
  weapon: FabCardDefinitionInput | null,
  incoming: FabCardDefinitionInput,
  hero: FabCardDefinitionInput = riptideLurkerOfTheDeep,
  slot: "weapon1" | "weapon2" = "weapon1",
) {
  const game = FabTestEngine.start(
    { hero, [slot]: weapon ? [weapon] : [], inventory: [incoming], hand: [] },
    { hero: rhinar, hand: [] },
  );
  const playerId = game.as(hero).id;
  const state = game.getRuntime().getState();
  const id = state.containers.zonesByPlayerId[playerId]!.inventory[0]!;
  return nextFreeWeaponSlot(state, playerId, snapshotObject(state, id, playerId, "inventory"));
}

describe("runtime weapon-slot projection", () => {
  it("equips a quiver beside a bow, but not beside a two-handed sword", () => {
    expect(resolve(deathDealer, driftwoodQuiver)).toBe("weapon2");
    expect(resolve(jubeelSpellbane, driftwoodQuiver)).toBeNull();
  });
  it("does not treat the unoccupied zone of a reverse-seated bow as free for a sword", () => {
    expect(resolve(deathDealer, cintariSaber, riptideLurkerOfTheDeep, "weapon2")).toBeNull();
    expect(resolve(deathDealer, driftwoodQuiver, riptideLurkerOfTheDeep, "weapon2")).toBe(
      "weapon1",
    );
  });
  it("resolves effective handedness of the existing sword under Zane's live rule", () => {
    expect(resolve(jubeelSpellbane, cintariSaber, zaneBroadlyBeloved)).toBe("weapon2");
    expect(resolve(jubeelSpellbane, cintariSaber)).toBeNull();
  });
  it("requires both zones empty when equipping an incoming two-hander", () => {
    expect(resolve(null, deathDealer)).toBe("weapon1");
    expect(resolve(driftwoodQuiver, deathDealer)).toBeNull();
  });
});
