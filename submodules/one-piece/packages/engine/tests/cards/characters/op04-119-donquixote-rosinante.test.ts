import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01OffWhite019,
  op04DonquixoteRosinante119,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koThreeCharacters: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP04-119-KO-THREE",
  canonicalId: "TEST-OP04-119-KO-THREE",
  name: "Rosinante Protection Review",
  cost: 0,
  effect: "[Main] K.O. up to 3 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 3, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([koThreeCharacters]);

function resolveKoTargets(
  engine: OnePieceTestEngine,
  selectedIds: string[],
  excludedIds: string[] = [],
) {
  const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  expect(target?.kind).toBe("selectEntity");
  if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target choice.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
    expect.arrayContaining(selectedIds),
  );
  for (const excludedId of excludedIds) {
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
  }
  engine.resolveDecision("effectTargetSelection", { selectedIds }, "south");
}

describe("OP04-119 Donquixote Rosinante", () => {
  test("may rest itself on play to play only a green cost-5 Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04DonquixoteRosinante119, eb01MountainGod018, eb01Doma005],
      activeDon: op04DonquixoteRosinante119.cost,
    });
    const mountainGodId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const ineligibleId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op04DonquixoteRosinante119, "south");
    const rosinanteId = engine.findCardInZone("south", "character", op04DonquixoteRosinante119);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Rosinante's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([mountainGodId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [mountainGodId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === rosinanteId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === mountainGodId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("while rested on the opponent's turn protects only active base-cost-5 Characters from effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [koThreeCharacters] },
      {
        character: [
          { card: op04DonquixoteRosinante119, rested: true },
          eb01MountainGod018,
          { card: eb01MountainGod018, rested: true },
          eb01Doma005,
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const activeCostFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const northCharacters = engine.getView("south").players.north.characters;
    const restedCostFiveId = northCharacters.find(
      (card) => card?.cardId === eb01MountainGod018.id && card.rested,
    )?.instanceId;
    const activeWrongCostId = engine.findCardInZone("north", "character", eb01Doma005);
    if (!restedCostFiveId) throw new Error("Expected the rested cost-5 Character fixture.");

    engine.playCard(koThreeCharacters, "south");
    resolveKoTargets(engine, [restedCostFiveId, activeWrongCostId], [activeCostFiveId]);

    const view = engine.getView("south");
    expect(
      view.players.north.characters.some((card) => card?.instanceId === activeCostFiveId),
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([restedCostFiveId, activeWrongCostId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not protect an active base-cost-5 Character while Rosinante is active", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [koThreeCharacters] },
      { character: [op04DonquixoteRosinante119, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(koThreeCharacters, "south");
    resolveKoTargets(engine, [targetId]);

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
