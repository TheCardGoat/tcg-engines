import { describe, expect, test, vi } from "vitest";
import { allGrandArchiveCards } from "@tcg/grand-archive-cards";
import { createGrandArchiveCatalogSmokeFixture } from "@tcg/grand-archive-engine/automation";
import {
  GrandArchiveMatchRuntime,
  projectGrandArchiveViewerState,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import {
  bindGrandArchiveArt,
  currentGrandArchiveArt,
  grandArchivePinnedImage,
  grandArchivePinnedImageAspectRatio,
  parseGrandArchiveArtPin,
  restoreGrandArchiveArt,
} from "./presentation.ts";
import { GrandArchiveServerEngine } from "./server-engine.ts";
import { grandArchiveServerAdapter } from "./adapter.ts";
import {
  projectGrandArchiveViewerSimulator,
  applyGrandArchiveImageResources,
} from "./projection.ts";

describe("Grand Archive frozen printing art", () => {
  test("binds two selected editions to distinct instances and rejects foreign printings", () => {
    const card = allGrandArchiveCards.find((c) => c.printings.length > 1)!;
    const maps = grandArchiveServerAdapter.buildCardInstances([
      {
        owner: "p1",
        deck: [
          { cardId: card.canonicalId, qty: 1, printingId: card.printings[0]!.id },
          { cardId: card.canonicalId, qty: 1, printingId: card.printings[1]!.id },
        ],
      },
    ]);
    const art = currentGrandArchiveArt();
    bindGrandArchiveArt(art, maps, {
      a: { id: "a", ownerId: "p1", definitionId: card.canonicalId },
      b: { id: "b", ownerId: "p1", definitionId: card.canonicalId },
    });
    expect(grandArchivePinnedImage(art, card.canonicalId, "a")).toBe(card.printings[0]!.imageUrl);
    expect(grandArchivePinnedImage(art, card.canonicalId, "b")).toBe(card.printings[1]!.imageUrl);
    expect(() =>
      grandArchiveServerAdapter.buildCardInstances([
        { owner: "p1", deck: [{ cardId: card.canonicalId, qty: 1, printingId: "wrong" }] },
      ]),
    ).toThrow("does not belong");
  });
  test("pins saved matches and replay exports, and sends images only for visible objects", async () => {
    const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
    const engine = new GrandArchiveServerEngine(
      program,
      new GrandArchiveMatchRuntime(program, initialState),
    );
    const viewerId = initialState.turnOrder[0]!;
    const resources = engine.getViewerResources({ role: "player", actorId: viewerId });
    if (!resources || typeof resources !== "object" || !("cardImageUrls" in resources))
      throw new Error("No art resources");
    const viewer = projectGrandArchiveViewerState(
      program,
      initialState,
      grandArchivePlayerId(viewerId),
    );
    const visible = new Set(
      viewer.players.flatMap((p) =>
        Object.values(p.zones).flatMap((z) =>
          (z.visibility === "visible" ? z.objects : z.revealedObjects).map((o) => o.id),
        ),
      ),
    );
    const urls = resources.cardImageUrls;
    if (!urls || typeof urls !== "object") throw new Error("Invalid images");
    for (const id of Object.keys(urls)) expect(visible.has(id)).toBe(true);
    const snapshot = grandArchiveServerAdapter.serializeEngine(engine, {
      cardInstances: {},
      owners: {},
    });
    const restored = await grandArchiveServerAdapter.restoreEngine(snapshot);
    expect(restored.getViewerResources({ role: "player", actorId: viewerId })).toEqual(resources);
    expect(engine.exportReplay().presentation?.catalog).toEqual(engine.art.catalog);
  });
  test("authoritative missing-art maps cannot borrow current catalog art", () => {
    const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
    const viewer = projectGrandArchiveViewerState(
      program,
      initialState,
      initialState.turnOrder[0]!,
    );
    const projected = projectGrandArchiveViewerSimulator(viewer, { cardImageUrls: {} });
    for (const entity of projected.entities)
      if (entity.face !== "hidden") expect(entity.imageUrl).toBeUndefined();
  });
  test("rejects external recovery URLs and retains current pins", async () => {
    const art = currentGrandArchiveArt();
    expect(() =>
      parseGrandArchiveArtPin({
        catalog: { ...art.catalog, url: "https://example.com/catalog.json" },
        printingIdByObjectId: {},
      }),
    ).toThrow("Invalid Grand Archive catalog URL");
    expect((await restoreGrandArchiveArt(art)).catalog).toEqual(art.catalog);
  });
});

test("exact printing roles keep board crops separate from readable full cards", () => {
  const art = structuredClone(currentGrandArchiveArt());
  const [id, card] = Object.entries(art.records.records)[0]!;
  const printing = card.defaultPrintingId!;
  const full = card.printings[printing]!.printedImageUrl;
  const board =
    "https://cdn.tcg.online/public/grand-archive/assets/board/" + "a".repeat(64) + ".webp";
  card.printings[printing]!.boardImageUrl = board;
  art.printingIdByObjectId.object = printing;
  expect(grandArchivePinnedImage(art, id, "object", "board")).toBe(board);
  expect(grandArchivePinnedImage(art, id, "object")).toBe(full);
  const entity = {
    id: "object",
    title: "Card",
    subtitle: "",
    ownerId: "p1",
    kind: "card" as const,
    face: "public" as const,
    states: [],
    traits: [],
    stats: [],
    imageAspectRatio: 5 / 7,
    dataAttributes: { "data-zone-id": "p1:field" },
  };
  const options = { cardImageUrls: { object: full! }, cardBoardImageUrls: { object: board } };
  const field = applyGrandArchiveImageResources(entity, options);
  expect(field.imageUrl).toBe(board);
  expect(field.imageAspectRatio).toBe(1);
  expect(field.dataAttributes?.["data-ga-printed-image-url"]).toBe(full);
  expect(
    applyGrandArchiveImageResources(
      { ...entity, dataAttributes: { "data-zone-id": "p1:hand" } },
      options,
    ).imageUrl,
  ).toBe(full);
  expect(
    applyGrandArchiveImageResources({ ...entity, face: "hidden" }, options).imageUrl,
  ).toBeUndefined();
  expect(applyGrandArchiveImageResources(entity, { cardImageUrls: {} }).imageUrl).toBeUndefined();
  const historical = applyGrandArchiveImageResources(entity, {
    ...options,
    cardBoardImageUrls: { object: full! },
  });
  expect(historical.imageUrl).toBe(full);
  expect(historical.imageAspectRatio).toBe(5 / 7);
});

test("historical recovery accepts separate art crops but rejects foreign board sources", async () => {
  const art = structuredClone(currentGrandArchiveArt());
  const first = Object.values(art.records.records)[0]!;
  const printing = first.printings[first.defaultPrintingId!]!;
  const tryRestore = async () => {
    const bytes = JSON.stringify(art.records);
    const digest = [
      ...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bytes))),
    ]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(bytes)),
    );
    return restoreGrandArchiveArt({
      ...art,
      catalog: {
        revision: digest,
        url: `https://cdn.tcg.online/public/grand-archive/presentation/${digest}.json`,
      },
    });
  };
  try {
    printing.boardImageUrl =
      "https://cdn.tcg.online/public/grand-archive/assets/board/" + "a".repeat(64) + ".webp";
    expect(
      (await tryRestore()).records.records[first.canonicalId]!.printings[first.defaultPrintingId!]!
        .boardImageUrl,
    ).toBe(printing.boardImageUrl);
    printing.boardImageUrl = "https://example.com/foreign.webp";
    await expect(tryRestore()).rejects.toThrow("Invalid retained");
  } finally {
    vi.unstubAllGlobals();
  }
});

test("mixed printing layouts use exact ratios while retained square catalogs keep theirs", () => {
  const art = structuredClone(currentGrandArchiveArt());
  const [id, record] = Object.entries(art.records.records)[0]!;
  const printing = record.printings[record.defaultPrintingId!]!;
  art.printingIdByObjectId.object = record.defaultPrintingId!;
  printing.boardImageAspectRatio = 446 / 396;
  printing.printedImageAspectRatio = 499 / 699;
  expect(grandArchivePinnedImageAspectRatio(art, id, "object", "board")).toBe(446 / 396);
  expect(grandArchivePinnedImageAspectRatio(art, id, "object")).toBe(499 / 699);
  const entity = {
    id: "object",
    title: "Card",
    subtitle: "",
    ownerId: "p1",
    kind: "card" as const,
    face: "public" as const,
    states: [],
    traits: [],
    stats: [],
    dataAttributes: { "data-zone-id": "p1:field" },
  };
  const options = {
    cardImageUrls: { object: printing.printedImageUrl! },
    cardBoardImageUrls: {
      object:
        "https://cdn.tcg.online/public/grand-archive/assets/board/" + "a".repeat(64) + ".webp",
    },
    cardBoardImageAspectRatios: { object: 446 / 396 },
    cardImageAspectRatios: { object: 499 / 699 },
  };
  expect(applyGrandArchiveImageResources(entity, options).imageAspectRatio).toBe(446 / 396);
  const full = applyGrandArchiveImageResources(entity, {
    ...options,
    cardBoardImageUrls: options.cardImageUrls,
  });
  expect(full.imageAspectRatio).toBe(499 / 699);
  expect(full.dataAttributes?.["data-ga-art-only"]).toBeUndefined();
  delete printing.boardImageAspectRatio;
  delete printing.printedImageAspectRatio;
  record.imageAspectRatio = 1;
  expect(grandArchivePinnedImageAspectRatio(art, id, "object", "board")).toBe(1);
  expect(grandArchivePinnedImageAspectRatio(art, id, "object")).toBe(5 / 7);
});
