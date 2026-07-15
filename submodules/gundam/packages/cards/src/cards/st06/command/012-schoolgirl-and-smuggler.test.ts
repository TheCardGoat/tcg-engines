import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { st06SchoolgirlAndSmuggler012 } from "./012-schoolgirl-and-smuggler.ts";

describe("Schoolgirl and Smuggler (ST06-012)", () => {
  it("【Main】 tutors a (Clan) Unit/Pilot from the top 3 into hand", () => {
    const clanUnit = createMockUnit({ traits: ["clan"] });
    const nonMatch1 = createMockUnit({ traits: [] });
    const nonMatch2 = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [st06SchoolgirlAndSmuggler012],
      resourceArea: activeResources(1),
      deck: [clanUnit, nonMatch1, nonMatch2],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const cmdId = p1.getHand()[0]!;
    const [clanUnitId, ...nonMatchIds] = p1.getCardsInZone("deck");

    expectSuccess(p1.playCommand(st06SchoolgirlAndSmuggler012));
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { 0: { tutorCardId: clanUnitId!, toBottom: nonMatchIds } },
      }),
    );

    // Command goes to trash after play
    expectCardInTrash(engine, cmdId, p1.playerId);
    // The (Clan) unit should have been tutored into hand
    const hand = p1.getHand();
    const clanInHand = hand.some((id) => id.includes(`_${clanUnit.cardNumber}_`));
    expect(clanInHand).toBe(true);
  });

  it("card data encodes (Clan) tutorFilter on lookAtTopDeck", () => {
    const cardDef = st06SchoolgirlAndSmuggler012;
    const effect = cardDef.effects![0];
    const directive = (effect as { directives: Array<{ action?: Record<string, unknown> }> })
      .directives[0]!;
    const action = directive.action!;
    expect(action.action).toBe("lookAtTopDeck");
    expect(action.tutorFilter).toBeDefined();
    const filter = action.tutorFilter as { attributeFilters?: Array<{ value: string }> };
    expect(filter.attributeFilters![0]!.value).toBe("clan");
  });
});
