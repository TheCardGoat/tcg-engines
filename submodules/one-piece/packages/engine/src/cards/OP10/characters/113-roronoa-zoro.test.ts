import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op10EustassCaptainKid099 } from "@tcg/op-cards";
import { op10RoronoaZoro113 } from "../../../../../cards/src/cards/OP10/characters/113-roronoa-zoro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-113 Roronoa Zoro", () => {
  test("gains Rush while its controller has fewer Life cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10RoronoaZoro113],
        life: [eb01Doma005],
        activeDon: op10RoronoaZoro113.cost,
      },
      { life: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op10RoronoaZoro113, "south");
    const zoroId = engine.findCardInZone("south", "character", op10RoronoaZoro113);
    engine.declareAttack(zoroId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === zoroId)
        ?.rested,
    ).toBe(true);
  });

  test("trashes a chosen hand card to play its resolving Trigger card for a Supernovas Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op10EustassCaptainKid099,
        life: [op10RoronoaZoro113],
        hand: [eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const zoroId = engine.findCardInZone("north", "life", op10RoronoaZoro113);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.characters.some((card) => card?.instanceId === zoroId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
