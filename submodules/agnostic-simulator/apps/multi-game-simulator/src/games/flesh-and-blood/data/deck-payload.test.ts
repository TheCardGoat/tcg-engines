import { describe, expect, it } from "vitest";
import {
  encodeDeckDocumentToUrlParam,
  type DeckDocumentV1,
  type DeckDocumentV2,
} from "@tcg/game-page-contract";
import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import type { FabRegisteredCardDefinition } from "@tcg/flesh-and-blood-engine/simulator";
import { createFabLocalPracticeMatchFromPlayerSeat } from "./create-local-practice-match";
import { resolveFabPracticeDeckPayload } from "./deck-payload";
import {
  registerFabCatalogDefinition,
  resolvePracticeDeckSelection,
  resolveCatalogCardByName,
  resolveFabPracticeDeckDocument,
} from "./resolve-text-deck";

describe("FAB practice deck payload", () => {
  it("preserves hybrid card-pool supertype groups when registering catalog cards", () => {
    const hybrid = [...fleshAndBloodStructuredCardsByCanonicalId.values()].find(
      (card) => card.base.typeBox.supertypeSets !== undefined,
    );
    expect(hybrid).toBeDefined();
    if (!hybrid) return;
    const catalogCard = resolveCatalogCardByName(hybrid.base.names[0]!);
    expect(catalogCard).toBeDefined();
    if (!catalogCard) return;
    const definitions: Record<string, FabRegisteredCardDefinition> = {};

    registerFabCatalogDefinition(catalogCard, definitions);

    expect(definitions[hybrid.canonicalId]?.base.typeBox.supertypeSets).toEqual(
      hybrid.base.typeBox.supertypeSets,
    );
  });

  it("rejects a deck document for another game", () => {
    const document: DeckDocumentV1 = {
      schemaVersion: 1,
      game: "gundam",
      formatId: "standard",
      sections: [],
    };
    const encoded = encodeDeckDocumentToUrlParam(document);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const result = resolveFabPracticeDeckPayload(new URLSearchParams({ deck: encoded.value }));
    expect(result).toMatchObject({ ok: false });
  });

  it("seats a real Hero and equipment from the registered card pool", () => {
    const hero = resolveCatalogCardByName("Bravo");
    const weapon = resolveCatalogCardByName("Anothos");
    const head = resolveCatalogCardByName("Helm of Isen's Peak");
    const main = resolveCatalogCardByName("Pummel", "red");
    expect(hero && weapon && head && main).toBeTruthy();
    if (!hero || !weapon || !head || !main) return;
    const document: DeckDocumentV2 = {
      schemaVersion: 2,
      game: "flesh-and-blood",
      formatId: "cc",
      sections: {
        hero: [{ card: { canonicalId: hero.canonicalId, quantity: 1 } }],
        cardPool: [
          { card: { canonicalId: weapon.canonicalId, quantity: 1 } },
          { card: { canonicalId: head.canonicalId, quantity: 1 } },
          { card: { canonicalId: main.canonicalId, quantity: 4 } },
        ],
      },
    };
    const encoded = encodeDeckDocumentToUrlParam(document);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const result = resolveFabPracticeDeckPayload(
      new URLSearchParams({ deck: encoded.value, strategy: "heuristic" }),
    );
    expect(result).toMatchObject({ ok: true, botStrategyId: "heuristic" });
    if (!result || !result.ok) return;
    expect(result.player.player.heroCardId).toBe(hero.canonicalId);
    expect(result.player.player.weapon1).toEqual([weapon.canonicalId]);
    expect(result.player.player.head).toEqual([head.canonicalId]);
    expect(result.player.player.hand).toEqual(Array(4).fill(main.canonicalId));
    expect(result.player.player.deck).toHaveLength(0);
  });

  it("seats an Off-Hand Companion from the registered card pool instead of shuffling it", () => {
    const hero = resolveCatalogCardByName("Dash I/O");
    const companion = resolveCatalogCardByName("Sticky Fingers");
    const main = resolveCatalogCardByName("Pummel", "red");
    expect(hero && companion && main).toBeTruthy();
    if (!hero || !companion || !main) return;

    const player = resolveFabPracticeDeckDocument(
      {
        schemaVersion: 2,
        game: "flesh-and-blood",
        formatId: "cc",
        sections: {
          hero: [{ card: { canonicalId: hero.canonicalId, quantity: 1 } }],
          cardPool: [
            { card: { canonicalId: companion.canonicalId, quantity: 1 } },
            { card: { canonicalId: main.canonicalId, quantity: 4 } },
          ],
        },
      },
      "companion-off-hand",
    );

    expect(player.cardPool.entries).toContainEqual({
      canonicalId: companion.canonicalId,
      quantity: 1,
      source: "equipment",
    });
    expect(player.player.weapon1).toEqual([companion.canonicalId]);
    expect(player.player.deck).not.toContain(companion.canonicalId);
  });

  it("draws the opening hand to the seated Hero's Intellect", () => {
    const hero = resolveCatalogCardByName("Data Doll MKII");
    const main = resolveCatalogCardByName("Pummel", "red");
    const intellect = hero?.runtime.base.numeric.intellect;
    expect(hero && main && intellect).toBeTruthy();
    if (!hero || !main || intellect === undefined) return;
    const player = resolveFabPracticeDeckDocument(
      {
        schemaVersion: 2,
        game: "flesh-and-blood",
        formatId: "cc",
        sections: {
          hero: [{ card: { canonicalId: hero.canonicalId, quantity: 1 } }],
          cardPool: [{ card: { canonicalId: main.canonicalId, quantity: 6 } }],
        },
      },
      "non-four-intellect",
    );
    const match = createFabLocalPracticeMatchFromPlayerSeat(player, {
      seed: "non-four-intellect",
      firstPlayerId: "player-1",
    });
    const viewer = match.runtime.viewer({ role: "player", actorId: match.player1Id });
    const seated = viewer.players[match.player1Id];
    expect(seated?.intellect).toBe(intellect);
    expect(seated?.zones.hand).toHaveLength(intellect);
    expect(seated?.zones.deck).toHaveLength(6 - intellect);
  });

  it("uses the Blitz format group and keeps a (2H) weapon from sharing a weapon zone", () => {
    const hero = resolveCatalogCardByName("Bravo");
    const twoHandedWeapon = resolveCatalogCardByName("Anothos");
    const oneHandedWeapon = resolveCatalogCardByName("Harmonized Kodachi");
    expect(hero && twoHandedWeapon && oneHandedWeapon).toBeTruthy();
    if (!hero || !twoHandedWeapon || !oneHandedWeapon) return;
    const player = resolveFabPracticeDeckDocument(
      {
        schemaVersion: 2,
        game: "flesh-and-blood",
        formatId: "blitz",
        sections: {
          hero: [{ card: { canonicalId: hero.canonicalId, quantity: 1 } }],
          cardPool: [
            { card: { canonicalId: twoHandedWeapon.canonicalId, quantity: 1 } },
            { card: { canonicalId: oneHandedWeapon.canonicalId, quantity: 1 } },
          ],
        },
      },
      "blitz-two-handed",
    );
    expect(player.formatGroup).toBe("blitz");
    expect(player.formatLabel).toBe("Blitz");
    expect(player.player.weapon1).toEqual([twoHandedWeapon.canonicalId]);
    expect(player.player.weapon2).toBeUndefined();
    expect(player.player.arena).toBeUndefined();
    expect(player.cardPool.entries).toContainEqual(
      expect.objectContaining({
        canonicalId: oneHandedWeapon.canonicalId,
        source: "equipment",
      }),
    );
  });
});

describe("matchmaking practice launch", () => {
  it("seats the selected featured opponent and preserves strategy and seed", () => {
    const result = resolveFabPracticeDeckPayload(
      new URLSearchParams({
        playerFixture: "cc-edinburgh-3rd-tuffnut",
        opponentFixture: "cc-edinburgh-1st-gravy-bones",
        strategy: "defend-only",
        seed: "chosen-matchup",
      }),
    );
    expect(result).toMatchObject({
      ok: true,
      seed: "chosen-matchup",
      botStrategyId: "defend-only",
      player: { deckId: "cc-edinburgh-3rd-tuffnut" },
      opponent: { deckId: "cc-edinburgh-1st-gravy-bones" },
    });
  });
  it("rejects a missing fixture instead of silently using the default opponent", () => {
    expect(
      resolveFabPracticeDeckPayload(
        new URLSearchParams({
          playerFixture: "cc-edinburgh-3rd-tuffnut",
          opponentFixture: "deleted",
        }),
      ),
    ).toMatchObject({ ok: false });
  });
});

it("imports saved seats from the same or different practice formats", () => {
  const fixture = resolvePracticeDeckSelection("sa-edinburgh-1st-briar", "saved-pool");
  function encode(formatId: "silverAge" | "cc", name: string) {
    const encoded = encodeDeckDocumentToUrlParam({
      schemaVersion: 2,
      game: "flesh-and-blood",
      formatId,
      name,
      sections: {
        hero: [{ card: { canonicalId: fixture.cardPool.heroId, quantity: 1 } }],
        cardPool: fixture.cardPool.entries.map(({ canonicalId, quantity }) => ({
          card: { canonicalId, quantity },
        })),
      },
    });
    if (!encoded.ok) throw new Error("Fixture could not encode");
    return encoded.value;
  }
  const player = encode("silverAge", "Saved player");
  const opponent = encode("silverAge", "Saved opponent");
  const result = resolveFabPracticeDeckPayload(
    new URLSearchParams({ deck: player, opponentDeck: opponent }),
  );
  expect(result).toMatchObject({
    ok: true,
    player: { label: "Saved player", formatGroup: "silver-age" },
    opponent: { label: "Saved opponent", formatGroup: "silver-age" },
  });
  expect(
    resolveFabPracticeDeckPayload(
      new URLSearchParams({ deck: player, opponentDeck: encode("cc", "Different format") }),
    ),
  ).toMatchObject({
    ok: true,
    player: { formatGroup: "silver-age" },
    opponent: { label: "Different format", formatGroup: "classic-constructed" },
  });
});
