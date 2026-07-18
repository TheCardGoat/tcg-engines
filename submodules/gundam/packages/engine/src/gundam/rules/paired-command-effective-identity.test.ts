import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

describe("paired Command effective identity", () => {
  it("lets public card behavior recognize the Command's Pilot type and Pilot name", () => {
    const host = createMockUnit();
    const commandPilot = createMockCommand({
      name: "Pilot-mode Command",
      pilotName: "Xavier Olivette",
      level: 1,
      cost: 1,
      apBonus: 1,
      hpBonus: 0,
    });
    const identityProbe = createMockCommand({
      name: "Pilot identity probe",
      level: 0,
      cost: 0,
      effects: [
        {
          type: "command",
          activation: {
            timing: ["main"],
            conditions: [
              {
                type: "cardInZone",
                owner: "friendly",
                zone: "battleArea",
                cardType: "pilot",
                hasName: "Xavier Olivette",
                comparison: "gte",
                count: 1,
              },
            ],
          },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "If Xavier Olivette is in play, draw 1.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [commandPilot, identityProbe],
      play: [host],
      resourceArea: activeResources(2),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [pilotId, probeId] = p1.getHand();

    expectSuccess(p1.playCommandAsPilot(pilotId!, hostId));
    expectSuccess(p1.playCommand(probeId!));

    expect(p1.getPilotId(hostId)).toBe(pilotId);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
  });
});
