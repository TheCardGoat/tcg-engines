import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08ClovenRose018,
  op08HikingBear010,
  op08TonyTonyChopper007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveAnimalSearch(trigger: "onPlay" | "whenAttacking") {
  const deck = [
    op08HikingBear010,
    op08TonyTonyChopper007,
    eb01Doma005,
    op08ClovenRose018,
    eb01Fourtricks025,
    eb01MountainGod018,
  ];
  const engine =
    trigger === "onPlay"
      ? OnePieceTestEngine.create({
          hand: [op08TonyTonyChopper007],
          deck,
          activeDon: op08TonyTonyChopper007.cost,
        })
      : OnePieceTestEngine.create(
          {
            character: [{ card: op08TonyTonyChopper007, playedOnTurn: 0 }],
            deck,
          },
          {},
          { firstPlayer: "north", activeSeat: "south" },
        );
  const eligibleId = engine.findCardInZone("south", "deck", op08HikingBear010);
  const highPowerId = engine.findCardInZone("south", "deck", op08TonyTonyChopper007);
  const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
  const eventId = engine.findCardInZone("south", "deck", op08ClovenRose018);
  const untouchedId = engine.getState().players.south.deck[5]!;

  if (trigger === "onPlay") {
    engine.playCard(op08TonyTonyChopper007, "south");
  } else {
    const chopperId = engine.findCardInZone("south", "character", op08TonyTonyChopper007);
    engine.declareAttack(chopperId, engine.leader("north"), "south");
  }

  const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
  expect(search?.kind).toBe("selectEntity");
  if (search?.kind !== "selectEntity") throw new Error("Expected Chopper's Animal search.");
  expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(true);
  for (const excludedId of [highPowerId, wrongTraitId, eventId]) {
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
  }
  engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

  const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
  expect(remainder?.kind).toBe("orderItems");
  if (remainder?.kind !== "orderItems") throw new Error("Expected Chopper's remainder order.");
  const bottomOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
  engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: bottomOrder }, "south");

  const view = engine.getView("south");
  expect(
    view.players.south.characters.find((card) => card?.instanceId === eligibleId),
  ).toMatchObject({ rested: true });
  expect(engine.getState().players.south.deck).toEqual([untouchedId, ...bottomOrder]);
  expect(view.prompts).toHaveLength(0);
}

describe("OP08-007 Tony Tony.Chopper", () => {
  test("on play searches and plays only a low-power Animal Character rested", () => {
    proveAnimalSearch("onPlay");
  });

  test("when attacking searches and plays only a low-power Animal Character rested", () => {
    proveAnimalSearch("whenAttacking");
  });
});
