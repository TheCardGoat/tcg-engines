import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03PaptimusScirocco084 } from "./084-paptimus-scirocco.ts";

describe("Paptimus Scirocco (GD03-084)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03PaptimusScirocco084] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  function setup({ jupitrisFirst }: { jupitrisFirst: boolean }) {
    const host = createMockUnit({
      linkCondition: "[Paptimus Scirocco]",
      // biome-ignore lint/suspicious/noExplicitAny: linkCondition is outside createMockUnit's public type
    } as any);
    const jupitris = createMockUnit({ name: "Jupitris Unit", traits: ["jupitris"], hp: 4 });
    const nonJupitris = createMockUnit({ name: "Titans Unit", traits: ["titans"], hp: 4 });
    const deckCard = createMockUnit({ name: "Deck Card" });
    const engine = GundamTestEngine.create({
      hand: [gd03PaptimusScirocco084],
      play: jupitrisFirst ? [host, jupitris, nonJupitris] : [host, nonJupitris, jupitris],
      deck: [deckCard],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, firstOtherId, secondOtherId] = p1.getCardsInZone("battleArea");

    return {
      engine,
      p1,
      hostId: hostId!,
      firstOtherId: firstOtherId!,
      secondOtherId: secondOtherId!,
    };
  }

  it("grants Repair 2 to the chosen other Unit and draws if that Unit is Jupitris", () => {
    const { engine, p1, hostId, firstOtherId, secondOtherId } = setup({ jupitrisFirst: true });

    expectSuccess(p1.assignPilot(gd03PaptimusScirocco084, hostId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(
      getEffectiveStats(firstOtherId, engine.getG(), framework.cards, framework).keywords,
    ).toContain("Repair");
    expect(
      getEffectiveStats(secondOtherId, engine.getG(), framework.cards, framework).keywords,
    ).not.toContain("Repair");
    expect(p1.getHand()).toHaveLength(1);
  });

  it("does not draw when the chosen other Unit is not Jupitris", () => {
    const { engine, p1, hostId, firstOtherId } = setup({ jupitrisFirst: false });

    expectSuccess(p1.assignPilot(gd03PaptimusScirocco084, hostId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(
      getEffectiveStats(firstOtherId, engine.getG(), framework.cards, framework).keywords,
    ).toContain("Repair");
    expect(p1.getHand()).toHaveLength(0);
  });
});
