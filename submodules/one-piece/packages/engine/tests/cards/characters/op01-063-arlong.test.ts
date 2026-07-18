import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Arlong063,
  op01PunkGibson058,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function concealedRevealToken(engine: OnePieceTestEngine, instanceId: string) {
  const prompt = engine
    .getState()
    .promptQueue.find(
      (candidate) =>
        candidate.status === "pending" &&
        candidate.resolutionContext?.intent === "effectRevealFromHandSelection",
    );
  if (prompt?.resolutionContext?.intent !== "effectRevealFromHandSelection") {
    throw new Error("Expected a concealed reveal-from-hand prompt.");
  }
  const token = Object.entries(prompt.resolutionContext.opaqueCandidateIds ?? {}).find(
    ([, candidateId]) => candidateId === instanceId,
  )?.[0];
  if (!token) {
    throw new Error("Expected the concealed hand card to have an opaque prompt token.");
  }
  return token;
}

describe("OP01-063 Arlong", () => {
  test("lets its controller choose an opposing hand card to reveal, then bottom-decks Life when it is an Event", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Arlong063, attachedDon: 1 }] },
      {
        hand: [eb01Doma005, op01PunkGibson058],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const arlongId = engine.findCardInZone("south", "character", op01Arlong063);
    const characterId = engine.findCardInZone("north", "hand", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op01PunkGibson058);
    const chosenLifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);
    const keptLifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.activateEffect(arlongId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const reveal = engine.pendingDecision("effectRevealFromHandSelection", "south").steps[0];
    expect(reveal?.kind).toBe("selectEntity");
    if (reveal?.kind !== "selectEntity") {
      throw new Error("Expected Arlong's controller-owned opposing-hand reveal choice.");
    }
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).not.toContain(eventId);
    expect(reveal.candidates.every((candidate) => candidate.publicInfo === undefined)).toBe(true);
    engine.resolveDecision(
      "effectRevealFromHandSelection",
      { selectedIds: [concealedRevealToken(engine, eventId)] },
      "south",
    );

    const removeLife = engine.pendingDecision("effectRemoveFromLifeSelection", "south").steps[0];
    expect(removeLife?.kind).toBe("selectEntity");
    if (removeLife?.kind !== "selectEntity") {
      throw new Error("Expected Arlong's controller-owned Life choice.");
    }
    expect(removeLife.candidates).toHaveLength(3);
    expect(removeLife.candidates.map((candidate) => candidate.ref.id)).not.toContain(chosenLifeId);
    expect(removeLife.candidates.every((candidate) => candidate.publicInfo === undefined)).toBe(
      true,
    );
    const chosenLifeIndex = engine.getState().players.north.life.indexOf(chosenLifeId);
    const chosenLifeToken = removeLife.candidates[chosenLifeIndex]!.ref.id;
    engine.resolveDecision(
      "effectRemoveFromLifeSelection",
      { selectedIds: [chosenLifeToken] },
      "south",
    );

    expect(engine.getView("north").players.north.life).toHaveLength(2);
    expect(engine.getState().players.north.life).toContain(keptLifeId);
    expect(engine.getState().players.north.deck.at(-1)).toBe(chosenLifeId);
    for (const view of [engine.getView("south"), engine.getView("north")]) {
      const movementLog = view.logs.find((entry) => entry.message.includes("from Life to Deck"));
      expect(movementLog).toMatchObject({
        sourceCardId: null,
        sourceInstanceId: null,
        targetIds: [],
      });
      expect(movementLog?.message).not.toContain(eb01Fourtricks025.name);
    }
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not offer Life removal when the chosen opposing hand card is not an Event", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Arlong063, attachedDon: 1 }] },
      {
        hand: [eb01Doma005, op01PunkGibson058],
        life: [eb01Doma005],
      },
    );
    const arlongId = engine.findCardInZone("south", "character", op01Arlong063);
    const characterId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.activateEffect(arlongId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const reveal = engine.pendingDecision("effectRevealFromHandSelection", "south").steps[0];
    expect(reveal?.kind).toBe("selectEntity");
    if (reveal?.kind !== "selectEntity") {
      throw new Error("Expected Arlong's opposing-hand reveal choice.");
    }
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    engine.resolveDecision(
      "effectRevealFromHandSelection",
      { selectedIds: [concealedRevealToken(engine, characterId)] },
      "south",
    );

    expect(engine.getView("north").players.north.life).toHaveLength(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
