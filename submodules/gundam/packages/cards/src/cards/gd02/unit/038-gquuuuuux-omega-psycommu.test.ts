import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GquuuuuuxOmegaPsycommu038 } from "./038-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (GD02-038)", () => {
  it("data keeps the printed top-3 deploy-from-deck text visible", () => {
    const effect = gd02GquuuuuuxOmegaPsycommu038.effects?.[0];

    expect(effect?.activation.timing).toEqual(["deploy"]);
    expect(effect?.sourceText).toContain("Look at the top 3 cards of your deck");
    expect(effect?.sourceText).toContain("deploy 1 (Clan) Unit card");
  });

  it("deploys a matching Clan Unit with Lv.4 or lower from the top 3 cards", () => {
    const clanUnit = createMockUnit({ traits: ["clan"], level: 4, cost: 2 });
    const nonClanUnit = createMockUnit({ traits: ["earth federation"], level: 3, cost: 2 });
    const highLevelClanUnit = createMockUnit({ traits: ["clan"], level: 5, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd02GquuuuuuxOmegaPsycommu038],
      resourceArea: activeResources(7),
      deck: [nonClanUnit, clanUnit, highLevelClanUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [nonClanId, clanId, highLevelClanId] = p1.getCardsInZone("deck");

    expectSuccess(p1.deployUnit(gd02GquuuuuuxOmegaPsycommu038));

    const choice = p1.getBoardView().pendingChoice;
    expect(choice?.kind).toBe("deckLook");
    if (choice?.kind !== "deckLook") return;
    expect(choice.legalTutorCardIds).toEqual([clanId]);
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: { tutorCardId: clanId, toBottom: [nonClanId!, highLevelClanId!] },
        },
      }),
    );

    const battleArea = p1.getCardsInZone("battleArea");
    expect(battleArea).toContain(clanId);
    expect(p1.getHand()).not.toContain(clanId);
  });

  it("does not deploy a Unit when the top cards have no matching Clan Lv.4 or lower Unit", () => {
    const nonClanUnit = createMockUnit({ traits: ["earth federation"], level: 3, cost: 2 });
    const highLevelClanUnit = createMockUnit({ traits: ["clan"], level: 5, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd02GquuuuuuxOmegaPsycommu038],
      resourceArea: activeResources(7),
      deck: [nonClanUnit, highLevelClanUnit],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd02GquuuuuuxOmegaPsycommu038));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getHand()).toHaveLength(0);
  });
});
