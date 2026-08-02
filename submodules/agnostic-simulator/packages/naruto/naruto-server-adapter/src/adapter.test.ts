import { describe, expect, it } from "vite-plus/test";
import { getCardById } from "@tcg-engines/naruto-cards";
import { buildDeck, playableLeaders } from "@tcg-engines/naruto-engine";
import { getGameAdapter, requireServerGameAdapter } from "@tcg/shared/game-adapter";

import { narutoServerAdapter, registerNarutoServerAdapter } from "./index.js";

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

  it("looks up cards by public id and resolves canonical ids", () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("no leaders");
    const summary = narutoServerAdapter.getCardById(leader.id);
    expect(summary?.publicId).toBe(leader.id);
    expect(summary?.label).toBe(leader.nameEn);
    expect(summary?.colors).toEqual([leader.color]);
    expect(summary?.imageUrl).toBe(`/images/cards/en/${leader.id}.webp`);

    expect(narutoServerAdapter.getCardById("NOPE-999")).toBeNull();
    expect(narutoServerAdapter.getCanonicalCardId?.(leader.id)).toBe(leader.id);
    expect(narutoServerAdapter.getCanonicalCardId?.("NOPE-999")).toBeNull();
  });

  it("exposes a runtime fingerprint", () => {
    const fingerprint = narutoServerAdapter.getRuntimeFingerprint?.();
    expect(fingerprint?.game).toBe("naruto");
    expect(fingerprint?.runtimeHash).toMatch(/^[0-9a-f]+\.[0-9a-f]+$/);
    expect(fingerprint?.engine?.packageName).toBe("@tcg-engines/naruto-engine");
    expect(fingerprint?.cards?.packageName).toBe("@tcg-engines/naruto-cards");
  });

  it("validates decks for the official format", () => {
    const leader = playableLeaders()[0];
    if (!leader) throw new Error("no leaders");
    const deck = buildDeck(leader.id);
    const counts = new Map<string, number>();
    for (const cardId of deck.cardIds) counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
    const legal = [
      { cardId: deck.leaderId, quantity: 1 },
      ...[...counts.entries()].map(([cardId, quantity]) => ({ cardId, quantity })),
    ];
    const result = narutoServerAdapter.validateDeckForFormat("official", legal);
    expect(result.valid).toBe(true);
    expect(result.label).toBe("Official");
    expect(result.rules.every((rule) => rule.passed)).toBe(true);

    const withUnknown = [...legal, { cardId: "NOPE-999", quantity: 1 }];
    const invalid = narutoServerAdapter.validateDeckForFormat("official", withUnknown);
    expect(invalid.valid).toBe(false);
    expect(invalid.rules.some((rule) => rule.kind === "card-pool" && !rule.passed)).toBe(true);

    const short = legal.filter((_, index) => index < 10);
    const shortResult = narutoServerAdapter.validateDeckForFormat("official", short);
    expect(shortResult.valid).toBe(false);

    expect(() => narutoServerAdapter.validateDeckForFormat("eternal", legal)).toThrow(
      /Unknown Naruto format/,
    );
  });

  it("card catalog is consistent with the cards package", () => {
    const card = getCardById("N-022");
    expect(card?.cardType).toBe("ex_character");
    expect(narutoServerAdapter.getCardById("N-022")?.label).toBe(card?.nameEn);
  });
});
