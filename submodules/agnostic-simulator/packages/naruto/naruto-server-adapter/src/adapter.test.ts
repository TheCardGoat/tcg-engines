import { describe, expect, it } from "vite-plus/test";
import { CARDS, getCardById, type CardDefinition } from "@tcg-engines/naruto-cards";
import { PREVIEW_DECKS, buildDeck, playableLeaders } from "@tcg-engines/naruto-engine";
import { getGameAdapter, requireServerGameAdapter } from "@tcg/shared/game-adapter";

import {
  getNarutoDeckBuilderCatalog,
  narutoServerAdapter,
  registerNarutoServerAdapter,
} from "./index.js";
import { narutoCardsRuntimeHash } from "./runtime-fingerprint.js";

describe("naruto server adapter", () => {
  it("registers with the slug-keyed registry as a full server adapter", () => {
    registerNarutoServerAdapter();
    expect(getGameAdapter("naruto")).toBe(narutoServerAdapter);
    // requireServerGameAdapter throws unless all four lifecycle hooks exist.
    const serverAdapter = requireServerGameAdapter("naruto");
    expect(serverAdapter.slug).toBe("naruto");
    expect(serverAdapter.createServerEngine).toBeTypeOf("function");
    expect(serverAdapter.serializeEngine).toBeTypeOf("function");
    expect(serverAdapter.restoreEngine).toBeTypeOf("function");
    expect(serverAdapter.extractCardsMapsFromSnapshot).toBeTypeOf("function");
  });

  it("mints game ids and offline display names", () => {
    expect(narutoServerAdapter.createGameId()).toMatch(/^naruto-game-/);
    expect(narutoServerAdapter.generateUserName("profile-abcdef")).toBe("ninja-profil");
  });

  it("builds collision-free card instances per owner", () => {
    const maps = narutoServerAdapter.buildCardInstances([
      {
        owner: "alice",
        deck: [
          { cardId: "N-012", qty: 2 },
          { cardId: "N-012", qty: 1 },
          { cardId: "N-013", qty: 1 },
        ],
      },
      { owner: "bob", deck: [{ cardId: "N-012", qty: 1 }] },
    ]);
    const aliceInstances = maps.owners.alice ?? [];
    expect(aliceInstances).toHaveLength(4);
    expect(new Set(aliceInstances).size).toBe(4);
    for (const instanceId of aliceInstances) {
      expect(maps.cardInstances[instanceId]).toMatch(/^N-01[23]$/);
    }
    expect(maps.owners.bob).toHaveLength(1);
  });

  it("looks up preview cards without claiming canonical external ids", () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("no leaders");
    const summary = narutoServerAdapter.getCardById(leader.id);
    expect(summary?.publicId).toBe(leader.id);
    expect(summary?.label).toBe(leader.nameEn);
    expect(summary?.colors).toEqual([leader.color]);
    expect(summary?.imageUrl).toBeUndefined();

    expect(narutoServerAdapter.getCardById("NOPE-999")).toBeNull();
    expect(narutoServerAdapter.getCanonicalCardId?.(leader.id)).toBeNull();
    expect(narutoServerAdapter.getCanonicalCardId?.("NOPE-999")).toBeNull();
  });

  it("projects native Leaders as matchmaking identities for Preview", () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("no leaders");
    const identity = narutoServerAdapter.matchmakingIdentity?.getDeckIdentity([
      { cardId: leader.id, quantity: 1 },
    ]);

    expect(identity).toMatchObject({ id: leader.id, label: leader.nameEn });
    expect(narutoServerAdapter.matchmakingIdentity?.listOpponentIdentities("preview")).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: leader.id, label: leader.nameEn })]),
    );
    expect(narutoServerAdapter.matchmakingIdentity?.listOpponentIdentities("unknown")).toEqual([]);
  });

  it("exposes a runtime fingerprint", () => {
    const fingerprint = narutoServerAdapter.getRuntimeFingerprint?.();
    expect(fingerprint?.game).toBe("naruto");
    expect(fingerprint?.runtimeHash).toMatch(/^[0-9a-f]+\.[0-9a-f]+$/);
    expect(fingerprint?.engine?.packageName).toBe("@tcg-engines/naruto-engine");
    expect(fingerprint?.engine?.version).toBe("0.1.0");
    expect(fingerprint?.engine?.metadata).toMatchObject({
      buildId: "naruto-preview-v1-12-actions",
      compatibilityVersion: "1.0.0-preview.1",
    });
    expect(fingerprint?.cards?.packageName).toBe("@tcg-engines/naruto-cards");
  });

  it("fingerprints complete card definitions, not only their ids and count", () => {
    const changed = structuredClone(CARDS) as CardDefinition[];
    const first = changed[0];
    if (!first) throw new Error("Naruto card catalog is unexpectedly empty.");
    changed[0] = { ...first, nameEn: `${first.nameEn} (corrected)` };

    expect(changed).toHaveLength(CARDS.length);
    expect(changed.map((card) => card.id)).toEqual(CARDS.map((card) => card.id));
    expect(narutoCardsRuntimeHash(changed)).not.toBe(narutoCardsRuntimeHash(CARDS));
  });

  it("validates decks for the provisional preview format", () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("no leaders");
    const deck = buildDeck(leader.id);
    const counts = new Map<string, number>();
    for (const cardId of [
      deck.leaderId,
      ...deck.cardIds,
      ...deck.chakraCardIds,
      deck.summonCardId,
    ]) {
      counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
    }
    const legal = [...counts.entries()].map(([cardId, quantity]) => ({ cardId, quantity }));
    const result = narutoServerAdapter.validateDeckForFormat("preview", legal);
    expect(result.valid).toBe(true);
    expect(result.label).toBe("Preview");
    expect(result.rules.every((rule) => rule.passed)).toBe(true);

    const withUnknown = [...legal, { cardId: "NOPE-999", quantity: 1 }];
    const invalid = narutoServerAdapter.validateDeckForFormat("preview", withUnknown);
    expect(invalid.valid).toBe(false);
    expect(invalid.rules.some((rule) => rule.kind === "card-pool" && !rule.passed)).toBe(true);

    const short = legal.filter((_, index) => index < 10);
    const shortResult = narutoServerAdapter.validateDeckForFormat("preview", short);
    expect(shortResult.valid).toBe(false);

    expect(() => narutoServerAdapter.validateDeckForFormat("eternal", legal)).toThrow(
      /Unknown Naruto format/,
    );
  });

  it("surfaces missing and invalid explicit Chakra/Summon setup in format validation", () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("no leaders");
    const deck = buildDeck(leader.id);
    const legal = entriesForDeck(deck);
    const mainCardId = deck.cardIds[0];
    if (!mainCardId) throw new Error("no main card");

    const missingSideCards = legal.filter(
      (entry) => entry.cardId !== deck.summonCardId && entry.cardId !== deck.chakraCardIds[0],
    );
    const missing = narutoServerAdapter.validateDeckForFormat("preview", missingSideCards);
    expect(missing.valid).toBe(false);
    expect(missing.rules.some((rule) => rule.kind === "wrongChakraCount")).toBe(true);
    expect(missing.rules.some((rule) => rule.kind === "noSummon")).toBe(true);

    const invalidChakra = legal.map((entry) =>
      entry.cardId === deck.chakraCardIds[0]
        ? { ...entry, cardId: mainCardId, sectionId: "chakra" }
        : entry,
    );
    const chakraResult = narutoServerAdapter.validateDeckForFormat("preview", invalidChakra);
    expect(chakraResult.valid).toBe(false);
    expect(chakraResult.rules.some((rule) => rule.kind === "notAChakra")).toBe(true);

    const invalidSummon = legal.map((entry) =>
      entry.cardId === deck.summonCardId
        ? { ...entry, cardId: mainCardId, sectionId: "summon" }
        : entry,
    );
    const summonResult = narutoServerAdapter.validateDeckForFormat("preview", invalidSummon);
    expect(summonResult.valid).toBe(false);
    expect(summonResult.rules.some((rule) => rule.kind === "notASummon")).toBe(true);
  });

  it("card catalog is consistent with the cards package", () => {
    const card = getCardById("N-022");
    expect(card?.cardType).toBe("ex_character");
    expect(narutoServerAdapter.getCardById("N-022")?.label).toBe(card?.nameEn);
  });

  it("exposes card text as searchText for catalog full-text search", () => {
    const catalog = getNarutoDeckBuilderCatalog();
    const withSkillText = catalog.cards.find((card) => card.searchText.length > 0);
    expect(withSkillText).toBeDefined();

    const source = getCardById(withSkillText!.id)!;
    const skillTextToken = source.skills
      .flatMap((skill) => skill.text.split(/\s+/))
      .find((token) => token.length > 6);
    expect(skillTextToken).toBeDefined();
    expect(withSkillText!.searchText).toContain(skillTextToken!);

    // Chakra-only support text is captured too.
    const chakra = catalog.cards.find((card) => card.type === "chakra");
    if (chakra) {
      const chakraSource = getCardById(chakra.id)!;
      for (const skill of chakraSource.skills) {
        expect(chakra.searchText).toContain(skill.text);
      }
    }
  });

  it("publishes typed Preview templates and fixed setup artwork choices", () => {
    const catalog = getNarutoDeckBuilderCatalog();

    expect(catalog.cards).toHaveLength(CARDS.length);
    expect(catalog.templates).toHaveLength(PREVIEW_DECKS.length);
    expect(catalog.templates.map((template) => template.key)).toEqual(
      PREVIEW_DECKS.map((deck) => deck.key),
    );
    expect(catalog.setup).toMatchObject({
      chakraCount: 5,
      summonCount: 1,
      defaultChakraArtId: "C-001",
      defaultSummonArtId: "S-001",
    });
    expect(catalog.setup.chakraArtIds).toEqual(["C-001", "CP-001"]);
    expect(catalog.setup.summonArtIds).toEqual(["S-001"]);
    expect(catalog.rules.provisional.mainDeckSize).toBe(50);
  });
});

function entriesForDeck(deck: ReturnType<typeof buildDeck>) {
  const counts = new Map<string, number>();
  for (const cardId of [deck.leaderId, ...deck.cardIds, ...deck.chakraCardIds, deck.summonCardId]) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
  return [...counts.entries()].map(([cardId, quantity]) => ({ cardId, quantity }));
}
