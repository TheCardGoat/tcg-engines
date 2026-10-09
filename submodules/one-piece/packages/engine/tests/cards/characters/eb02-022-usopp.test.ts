import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02FakeStrawHatCrew005,
  eb02Usopp022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-022 Usopp", () => {
  test("counts itself and plays only a power-6000-or-less Character with no base effect", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Usopp022, eb01Doma005, eb02FakeStrawHatCrew005, eb01MountainGod018],
      character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }],
      activeDon: 4,
    });
    const vanillaId = engine.findCardInZone("south", "hand", eb01Doma005);
    const effectfulId = engine.findCardInZone("south", "hand", eb02FakeStrawHatCrew005);
    const tooPowerfulId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.playCard(eb02Usopp022, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Usopp's effectless play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([vanillaId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(effectfulId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [vanillaId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(vanillaId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not activate after Usopp becomes the third power-5000-or-more Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Usopp022, eb01Doma005],
      character: [
        { card: eb01Fourtricks025, playedOnTurn: 0 },
        { card: eb01MountainGod018, playedOnTurn: 0 },
      ],
      activeDon: 4,
    });
    const vanillaId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(eb02Usopp022, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      vanillaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("FAQ: Shanks reduces Usopp below 5000 so two other large Characters still permit play", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["EB02-022", "EB01-005"], activeDon: 4, character: ["ST02-009", "EB01-018"] },
      { character: ["OP09-004"] },
    );
    const played = e.findCardInZone("south", "hand", "EB01-005");
    e.asSouth().play("EB02-022");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "EB02-022")?.power,
    ).toBe(4000);
    expect(
      e
        .getView("south")
        .players.south.characters.filter((c) => c && c.power !== null && c.power >= 5000),
    ).toHaveLength(2);
    e.resolveDecision("effectPlaySelection", { selectedIds: [played] }, "south");
    expect(e.findCardInZone("south", "character", "EB01-005")).toBe(played);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
