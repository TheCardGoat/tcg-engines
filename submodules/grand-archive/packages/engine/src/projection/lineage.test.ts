import { describe, expect, it } from "vitest";
import {
  gateOfAlterity,
  spiritOfFire,
  spiritOfWind,
  raiSpellcrafter,
  raiArchmage,
  alicePhantomMonarch,
  aliceDistortedQueen,
  aliceWhimsMonarch,
  maledictumVitae,
  woodlandSquirrels,
} from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";

describe("viewer-visible physical lineage ordering", () => {
  it("orders an opposing owner's card beneath its host's base and champion levels", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: spiritOfFire,
        lineage: [aliceDistortedQueen, aliceWhimsMonarch, alicePhantomMonarch],
        zones: { hand: [maledictumVitae, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion: spiritOfWind, lineage: [raiSpellcrafter, raiArchmage] },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const host = opponent.card(spiritOfWind, { zone: "field" });
    player.activate(maledictumVitae, {
      targets: { "target-champion": [host.objectId] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    player.pass();
    opponent.pass();
    for (const viewer of [player, opponent]) {
      const cards = viewer
        .view()
        .players.flatMap((seat) =>
          Object.values(seat.zones).flatMap((zone) =>
            zone.visibility === "visible" ? zone.objects : [],
          ),
        )
        .filter((card) => card.id === host.objectId || card.hostId === host.objectId)
        .sort((left, right) => left.lineagePosition! - right.lineagePosition!);
      expect(cards.map((card) => card.definitionId)).toEqual([
        maledictumVitae.canonicalId,
        spiritOfWind.canonicalId,
        raiSpellcrafter.canonicalId,
        raiArchmage.canonicalId,
      ]);
      expect(cards[0]?.ownerId).toBe(player.id);
      expect(cards[0]?.hostId).toBe(host.objectId);
    }
  });
  it("places a bottom attachment beneath the original Spirit and successive levels", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: spiritOfFire,
        lineage: [raiSpellcrafter, raiArchmage],
        zones: { field: [gateOfAlterity] },
      },
      playerTwo: { champion: spiritOfWind },
    });
    const player = game.player("player-one");
    player.activateAbility(gateOfAlterity, "j9s7xQdpf1-a1");
    player.pass();
    game.player("player-two").pass();
    const view = player.view().players.find((entry) => entry.id === player.id)!;
    const field = view.zones.field;
    const lineage = view.zones["inner-lineage"];
    if (field.visibility !== "visible" || lineage.visibility !== "visible")
      throw new Error("Expected public zones");
    const physicalCards = [...field.objects, ...lineage.objects]
      .filter((card) => card.lineagePosition !== undefined)
      .sort((left, right) => left.lineagePosition! - right.lineagePosition!);
    expect(physicalCards.map((card) => card.definitionId)).toEqual([
      gateOfAlterity.canonicalId,
      spiritOfFire.canonicalId,
      raiSpellcrafter.canonicalId,
      raiArchmage.canonicalId,
    ]);
  });
});
