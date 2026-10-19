import { describe, expect, it } from "vitest";
import { getGrandArchiveCard, spiritOfWind } from "@tcg/grand-archive-cards";
import {
  createGrandArchiveCatalogSmokeFixture,
  resolveGrandArchiveTextDeck,
} from "@tcg/grand-archive-engine/automation";
import { grandArchivePracticeDecks } from "./practice.ts";
import { grandArchiveServerAdapter } from "./adapter.ts";
import { grandArchiveDeckInterchangeAdapter } from "./deck-interchange.ts";
import {
  createGrandArchivePreparationPool,
  validateGrandArchivePreparation,
} from "./preparation.ts";
import {
  assertGrandArchiveStandardLegality,
  grandArchiveStandardLegalityVersion,
} from "./standard-legality.ts";

const banned = getGrandArchiveCard("dissonant-fractal")!;
const { initialState, program } = createGrandArchiveCatalogSmokeFixture(102);
const entries = (zone: "main-deck" | "material-deck") => {
  const counts = new Map<string, number>();
  for (const id of initialState.players.p1!.startingDeckDefinitionIds[zone])
    counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts].map(([canonicalId, quantity]) => ({ canonicalId, quantity }));
};
const main = entries("main-deck"),
  material = entries("material-deck");
const deck = [
  ...main.map((entry) => ({
    cardId: entry.canonicalId,
    quantity: entry.quantity,
    sectionId: "main",
  })),
  ...material.map((entry) => ({
    cardId: entry.canonicalId,
    quantity: entry.quantity,
    sectionId: "material",
  })),
];

describe("Standard tournament admission", () => {
  it.each(grandArchivePracticeDecks)(
    "keeps the offered $name deck legal in Standard",
    ({ deck: textDeck }) => {
      const resolved = resolveGrandArchiveTextDeck(program, textDeck);
      const registered = [...resolved.mainDeck, ...resolved.materialDeck];
      expect(() => assertGrandArchiveStandardLegality(registered)).not.toThrow();
      expect(resolved.mainDeck.reduce((sum, entry) => sum + entry.count, 0)).toBe(60);
    },
  );
  it("versions current policy and resolves alternate printing identities", () => {
    expect(grandArchiveStandardLegalityVersion).toMatch(/^[a-f0-9]{64}$/);
    expect(() =>
      assertGrandArchiveStandardLegality([{ definitionId: banned.printings[0]!.id, count: 1 }]),
    ).toThrow("limited to 0");
    expect(() =>
      assertGrandArchiveStandardLegality([
        { definitionId: spiritOfWind.canonicalId, count: 1 },
        { definitionId: getGrandArchiveCard(spiritOfWind.canonicalId)!.printings[0]!.id, count: 1 },
      ]),
    ).toThrow("limited to 1");
  });
  it.each(["main", "sideboard"])("rejects a banned card in %s", (sectionId) => {
    const result = grandArchiveServerAdapter.validateDeckForFormat("standard", [
      ...deck,
      { cardId: banned.canonicalId, quantity: 1, sectionId },
    ]);
    expect(result.valid).toBe(false);
    expect(JSON.stringify(result)).toContain("Dissonant Fractal is limited to 0");
  });
  it("counts main and sideboard copies together", () => {
    const full = main.find((entry) => entry.quantity === 4)!;
    const result = grandArchiveServerAdapter.validateDeckForFormat("standard", [
      ...deck,
      { cardId: full.canonicalId, quantity: 1, sectionId: "sideboard" },
    ]);
    expect(result.valid).toBe(false);
    expect(JSON.stringify(result)).toContain("limited to 4");
  });
  it("allows draft documents while refusing their registration", () => {
    const document = grandArchiveDeckInterchangeAdapter.createDocument({
      formatId: "standard",
      sections: { main, material, sideboard: [{ canonicalId: banned.canonicalId, quantity: 1 }] },
      declarations: { startingChampionId: material[0]!.canonicalId },
    });
    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(document, { validationMode: "draft" }),
    ).toEqual([]);
    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(document, {
        validationMode: "registration",
      }),
    ).toContainEqual(
      expect.objectContaining({
        path: "sections",
        message: expect.stringContaining("limited to 0"),
      }),
    );
  });
  it("validates a preparation pool again at sideboarding", () => {
    const pool = createGrandArchivePreparationPool({
      formatId: "standard",
      mainDeck: deck.map((entry) => ({
        cardId: entry.cardId,
        quantity: entry.quantity,
        sectionId: entry.sectionId,
      })),
      inventory: [],
    });
    const selection = {
      ...pool.registered,
      sideboard: [{ canonicalId: banned.canonicalId, quantity: 1 }],
    };
    const invalidPool = {
      ...pool,
      stage: "sideboarding" as const,
      registered: selection,
      previous: selection,
    };
    expect(validateGrandArchivePreparation(invalidPool, selection)).toMatchObject({
      valid: false,
      issues: [expect.objectContaining({ message: expect.stringContaining("limited to 0") })],
    });
  });
  it("pins the admission policy across snapshot restoration", async () => {
    const cardsMaps = grandArchiveServerAdapter.buildCardInstances(
      ["p1", "p2"].map((owner) => ({
        owner,
        deck: deck.map((entry) => ({
          cardId: entry.cardId,
          qty: entry.quantity,
          sectionId: entry.sectionId,
        })),
      })),
    );
    const engine = await grandArchiveServerAdapter.createServerEngine!({
      gameSlug: "grand-archive",
      seed: "policy",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
      timeControl: { mode: "none" },
    });
    const snapshot = grandArchiveServerAdapter.serializeEngine!(engine, cardsMaps);
    expect(snapshot.metadata).toMatchObject({
      admissionPolicyVersion: grandArchiveStandardLegalityVersion,
    });
    const historicVersion = "a".repeat(64);
    const historicSnapshot = {
      ...snapshot,
      metadata: {
        ...snapshot.metadata,
        admissionPolicyVersion: historicVersion,
      },
    };
    const restored = await grandArchiveServerAdapter.restoreEngine!(historicSnapshot);
    expect(grandArchiveServerAdapter.serializeEngine!(restored, cardsMaps).metadata).toMatchObject({
      admissionPolicyVersion: historicVersion,
    });
  });
  it("refuses banned cards at creation even when validation was bypassed", async () => {
    const cardsMaps = grandArchiveServerAdapter.buildCardInstances(
      ["p1", "p2"].map((owner) => ({
        owner,
        deck: [...deck, { cardId: banned.canonicalId, quantity: 1, sectionId: "sideboard" }].map(
          (entry) => ({ cardId: entry.cardId, qty: entry.quantity, sectionId: entry.sectionId }),
        ),
      })),
    );
    await expect(
      grandArchiveServerAdapter.createServerEngine!({
        gameSlug: "grand-archive",
        seed: "legality",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps,
        timeControl: { mode: "none" },
      }),
    ).rejects.toThrow("limited to 0");
  });
});
