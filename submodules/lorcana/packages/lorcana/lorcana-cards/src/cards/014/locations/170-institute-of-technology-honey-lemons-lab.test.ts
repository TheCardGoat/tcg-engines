import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { instituteOfTechnologyHoneyLemonsLab } from "./170-institute-of-technology-honey-lemons-lab";

const superScientist = createMockCharacter({
  id: "lab-super-scientist",
  name: "Lab Super Scientist",
  cost: 3,
  classifications: ["Storyborn", "Super"],
});

const secondSuperScientist = createMockCharacter({
  id: "lab-second-super-scientist",
  name: "Lab Second Super Scientist",
  cost: 3,
  classifications: ["Storyborn", "Super"],
});

const nonSuperScientist = createMockCharacter({
  id: "lab-non-super-scientist",
  name: "Lab Non-Super Scientist",
  cost: 3,
  classifications: ["Storyborn"],
});

const discardedItem = createMockItem({
  id: "lab-discarded-item",
  name: "Lab Discarded Item",
  cost: 2,
});

const secondDiscardedItem = createMockItem({
  id: "lab-second-discarded-item",
  name: "Lab Second Discarded Item",
  cost: 2,
});

const otherLocation = createMockLocation({
  id: "lab-other-location",
  name: "Lab Other Location",
  cost: 1,
  moveCost: 1,
});

describe("Institute of Technology - Honey Lemon's Lab", () => {
  it("normal inking creates ready ink without location lore or a return prompt", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [instituteOfTechnologyHoneyLemonsLab],
      discard: [discardedItem],
    });
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, instituteOfTechnologyHoneyLemonsLab),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(instituteOfTechnologyHoneyLemonsLab)).toBe("inkwell");
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("discard");
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("unpaid play and movement preserve ink and produce no return", () => {
    const unpaid = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [instituteOfTechnologyHoneyLemonsLab],
      inkwell: 1,
    });
    expect(
      unpaid.asPlayerOne().playCard(instituteOfTechnologyHoneyLemonsLab),
    ).not.toBeSuccessfulCommand();
    expect(unpaid.asPlayerOne().getCardZone(instituteOfTechnologyHoneyLemonsLab)).toBe("hand");
    expect(unpaid.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(unpaid.asPlayerOne().getPendingEffects()).toHaveLength(0);
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [instituteOfTechnologyHoneyLemonsLab, superScientist],
      discard: [discardedItem],
    });
    expect(
      g.asPlayerOne().moveCharacterToLocation(superScientist, instituteOfTechnologyHoneyLemonsLab),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne()).not.toBeAtLocation({
      card: superScientist,
      location: instituteOfTechnologyHoneyLemonsLab,
    });
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("discard");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("two Labs track their once-per-turn returns independently", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        instituteOfTechnologyHoneyLemonsLab,
        superScientist,
        secondSuperScientist,
      ],
      discard: [discardedItem, secondDiscardedItem],
      inkwell: 2,
      deck: 3,
    });
    const [firstLab, secondLab] = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === instituteOfTechnologyHoneyLemonsLab.id);
    expect(
      g.asPlayerOne().moveCharacterToLocation(superScientist, firstLab!),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().moveCharacterToLocation(secondSuperScientist, secondLab!),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(firstLab!, { targets: [discardedItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(secondSuperScientist)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(secondLab!, { targets: [secondDiscardedItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(secondDiscardedItem)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("an empty discard does not leave a mandatory prompt stuck", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          instituteOfTechnologyHoneyLemonsLab,
          { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
        ],
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });

  it("player two returns its own item after questing at its Lab", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: [secondDiscardedItem], deck: 3 },
      {
        play: [
          instituteOfTechnologyHoneyLemonsLab,
          { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
        ],
        discard: [discardedItem],
        deck: 3,
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, {
        targets: [secondDiscardedItem],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { targets: [discardedItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(discardedItem)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(secondDiscardedItem)).toBe("discard");
    expect(g.getLore(PLAYER_TWO)).toBe(2);
  });

  it("normal play costs two, moving here costs one and location lore starts next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [instituteOfTechnologyHoneyLemonsLab],
        play: [superScientist],
        inkwell: 3,
        discard: [discardedItem],
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(instituteOfTechnologyHoneyLemonsLab)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerOne().moveCharacterToLocation(superScientist, instituteOfTechnologyHoneyLemonsLab),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { targets: [discardedItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("rejects nonitems and opposing discard items without consuming the choice", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          instituteOfTechnologyHoneyLemonsLab,
          { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
        ],
        discard: [discardedItem, nonSuperScientist],
        deck: 2,
      },
      { discard: [secondDiscardedItem], deck: 2 },
    );
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    for (const target of [nonSuperScientist, secondDiscardedItem]) {
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { targets: [target] }),
      ).not.toBeSuccessfulCommand();
    }
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { targets: [discardedItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(nonSuperScientist)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(secondDiscardedItem)).toBe("discard");
  });

  it("returns only the exact selected duplicate item", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
      ],
      discard: [discardedItem, discardedItem],
      deck: 2,
    });
    const [selected, remaining] = g.getCardInstanceIdsInZone("discard", PLAYER_ONE);
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { targets: [selected!] }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([selected!]);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([remaining!]);
  });

  it("Break Time resets on the next own turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          instituteOfTechnologyHoneyLemonsLab,
          { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
        ],
        discard: [discardedItem, secondDiscardedItem],
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { targets: [discardedItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, {
        targets: [secondDiscardedItem],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(secondDiscardedItem)).toBe("hand");
  });

  it("a non-Super quest does not consume the once-per-turn return", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        { card: nonSuperScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
        { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
      ],
      discard: [discardedItem],
      deck: 2,
    });
    expect(g.asPlayerOne().quest(nonSuperScientist)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { targets: [discardedItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("hand");
  });

  it("Break Time cannot be declined when an item can be returned", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
      ],
      discard: [discardedItem, secondDiscardedItem],
      deck: 2,
    });
    expect(g.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, { resolveOptional: false }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(secondDiscardedItem)).toBe("discard");
    expect(
      g.asPlayerOne().resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, {
        targets: [secondDiscardedItem],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(secondDiscardedItem)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(discardedItem)).toBe("discard");
  });

  it("Break Time - returns an item card from your discard to your hand when a Super character quests here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
      ],
      discard: [discardedItem],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, {
        targets: [discardedItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
  });

  it("Break Time - does not trigger for a non-Super character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        { card: nonSuperScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
      ],
      discard: [discardedItem],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(nonSuperScientist)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(1);
  });

  it("Break Time - only triggers once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        { card: superScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
        { card: secondSuperScientist, atLocation: instituteOfTechnologyHoneyLemonsLab },
      ],
      discard: [discardedItem, secondDiscardedItem],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(instituteOfTechnologyHoneyLemonsLab, {
        targets: [discardedItem],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);

    expect(testEngine.asPlayerOne().quest(secondSuperScientist)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(1);
  });

  it("Break Time - does not trigger when a Super character quests at a different location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        instituteOfTechnologyHoneyLemonsLab,
        otherLocation,
        { card: superScientist, atLocation: otherLocation },
      ],
      discard: [discardedItem],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(superScientist)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(1);
  });
});
