import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12Mizerka092 } from "../../../../../cards/src/cards/OP12/characters/092-mizerka.ts";
import { op12Poker091 } from "../../../../../cards/src/cards/OP12/characters/091-poker.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-091 Poker", () => {
  test("orders three trash cards as cost and boosts up to two included SMILE Characters once", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12Poker091, op12Mizerka092, eb01Doma005],
      trash: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
    });
    const pokerId = engine.findCardInZone("south", "character", op12Poker091);
    const mizerkaId = engine.findCardInZone("south", "character", op12Mizerka092);
    const nonSmileId = engine.findCardInZone("south", "character", eb01Doma005);
    const trashBefore = engine
      .getView("south")
      .players.south.trash.map((card) => card.instanceId)
      .filter((id): id is string => Boolean(id));
    const deckBefore = engine.getView("south").players.south.deckCount;
    const pokerPower = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === pokerId)?.power;
    const mizerkaPower = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === mizerkaId)?.power;
    if (
      pokerPower === null ||
      pokerPower === undefined ||
      mizerkaPower === null ||
      mizerkaPower === undefined
    ) {
      throw new Error("Expected SMILE Character power.");
    }

    engine.activateEffect(pokerId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Poker's ordered trash cost.");
    const paymentOrder = trashBefore.slice(0, 3).reverse();
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentOrder }, "south");
    const targets = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (targets?.kind !== "selectEntity") throw new Error("Expected Poker's SMILE targets.");
    expect(targets.candidates.map((candidate) => candidate.ref.id)).toContain(pokerId);
    expect(targets.candidates.map((candidate) => candidate.ref.id)).toContain(mizerkaId);
    expect(targets.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonSmileId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [pokerId, mizerkaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore + 3);
    expect(view.players.south.characters.find((card) => card?.instanceId === pokerId)?.power).toBe(
      pokerPower + 2000,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mizerkaId)?.power,
    ).toBe(mizerkaPower + 2000);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: pokerId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
