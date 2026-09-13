import {
  grandArchiveServerAdapter,
  GrandArchiveServerEngine,
} from "@tcg/grand-archive-server-adapter";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { GrandArchiveSimulatorProviders } from "./App";
import { GrandArchivePreparation } from "./GrandArchivePreparation";
import {
  practiceSetupFromSearch,
  createGrandArchivePracticeEngineFromSetup,
} from "./practice-setup";
import { practicePreparationPool, confirmPracticePreparation } from "./practice-preparation";
import {
  grandArchivePregameAdapter,
  createGrandArchivePreparationPool,
  parseGrandArchivePreparationPool,
  parseGrandArchivePreparationSelection,
  validateGrandArchivePreparation,
} from "@tcg/grand-archive-server-adapter/preparation";
const launch = () =>
  practiceSetupFromSearch(
    "?playerDeck=lorraine-pnp-1-4&opponentDeck=rai-pnp-1-4&strategy=value-extract",
  )!.server;
afterEach(cleanup);
describe("Grand Archive preparation", () => {
  it("keeps game-one registered sections and materializes the selected Spirit", async () => {
    const server = launch();
    const pool = practicePreparationPool(server, "p1");
    expect(validateGrandArchivePreparation(pool, pool.previous).valid).toBe(true);
    const card = pool.previous.main[0]!;
    const changed = { ...pool.previous, main: pool.previous.main.slice(1), sideboard: [card] };
    expect(
      validateGrandArchivePreparation(pool, changed).issues.some(
        (issue) => issue.code === "game-one",
      ),
    ).toBe(true);
    const deck = grandArchivePregameAdapter.materializeDeck(pool, pool.previous);
    expect(deck.filter((entry) => entry.sectionId === "starting-champion")).toEqual([
      expect.objectContaining({ cardId: pool.previous.startingChampionId, qty: 1 }),
    ]);
    const opponent = practicePreparationPool(server, "p2");
    const cardsMaps = grandArchiveServerAdapter.buildCardInstances([
      { owner: "p1", deck: [...deck] },
      {
        owner: "p2",
        deck: [...grandArchivePregameAdapter.materializeDeck(opponent, opponent.previous)],
      },
    ]);
    expect(cardsMaps.deckDeclarationsByOwnerId?.p1).toEqual({
      startingChampionId: pool.previous.startingChampionId,
    });
    const live = await grandArchiveServerAdapter.createServerEngine!({
      gameSlug: "grand-archive",
      seed: "preparation-test",
      player1Id: "p1",
      player2Id: "p2",
      firstTurnPlayerId: "p2",
      cardsMaps,
    });
    if (!(live instanceof GrandArchiveServerEngine)) throw new Error("Unexpected GA engine");
    expect(live.runtime.state.turnOrder[0]).toBe("p2");
    const prepared = confirmPracticePreparation(server, pool.previous, "p2");
    expect(prepared.runtime.state.turnOrder[0]).toBe("p2");
    expect(prepared.runtime.state.zones[grandArchivePlayerId("p1")]["main-deck"]).toHaveLength(60);
    expect(prepared.runtime.state.zones[grandArchivePlayerId("p2")]["main-deck"]).toHaveLength(60);
  });
  it("advances to sideboarding, conserves the registered pool and enforces weighted sideboard limits", () => {
    const original = practicePreparationPool(launch(), "p1");
    const pool = parseGrandArchivePreparationPool(
      grandArchivePregameAdapter.nextGamePool!(original, original.previous),
    );
    expect(pool.stage).toBe("sideboarding");
    const material = pool.previous.material.filter(
      (entry) => entry.canonicalId !== pool.previous.startingChampionId,
    );
    const removed = material[0]!;
    const chosen = {
      ...pool.previous,
      material: pool.previous.material.filter((entry) => entry !== removed),
      sideboard: [removed],
    };
    expect(validateGrandArchivePreparation(pool, chosen).valid).toBe(true);
    const over = material.slice(0, 6);
    expect(
      validateGrandArchivePreparation(pool, {
        ...pool.previous,
        material: pool.previous.material.filter((entry) => !over.includes(entry)),
        sideboard: over,
      })
        .issues.map((issue) => issue.message)
        .join(" "),
    ).toContain("15 points");
    expect(
      validateGrandArchivePreparation(pool, { ...chosen, sideboard: [] }).issues[0]?.code,
    ).toBe("registered-pool");
    const next = parseGrandArchivePreparationPool(
      grandArchivePregameAdapter.nextGamePool!(pool, chosen),
    );
    expect(next.previous).toEqual(chosen);
    expect(next.registered).toEqual(original.registered);
    expect(() =>
      parseGrandArchivePreparationSelection({ ...chosen, main: [chosen.main[0], chosen.main[0]] }),
    ).toThrow("duplicate");
  });
  it("reviews registered cards, previews, changes density and confirms without offering game-one swaps", async () => {
    const pool = practicePreparationPool(launch(), "p1");
    const confirm = vi.fn();
    render(
      <GrandArchiveSimulatorProviders>
        <GrandArchivePreparation
          pool={pool}
          initialSelection={pool.previous}
          playerLabel="You"
          opponentLabel="Opponent"
          opponentReady={false}
          turnOrderLabel="You go second"
          onConfirm={confirm}
          onLeave={() => {}}
        />
      </GrandArchiveSimulatorProviders>,
    );
    expect(screen.queryByText("Side out")).toBeNull();
    fireEvent.click(screen.getAllByRole("button", { name: /^Preview / })[0]!);
    expect(await screen.findByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: /Material deck ·/ }));
    expect(screen.getByRole("heading", { name: "Material deck" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    expect(confirm).toHaveBeenCalledWith(pool.previous);
  });
});

it("moves cards between games, resets the draft and submits the chosen sideboard", () => {
  const original = practicePreparationPool(launch(), "p1");
  const pool = parseGrandArchivePreparationPool(
    grandArchivePregameAdapter.nextGamePool!(original, original.previous),
  );
  const confirm = vi.fn();
  render(
    <GrandArchiveSimulatorProviders>
      <GrandArchivePreparation
        pool={pool}
        initialSelection={pool.previous}
        playerLabel="You"
        opponentLabel="Opponent"
        opponentReady={false}
        turnOrderLabel="Turn order pending"
        onConfirm={confirm}
        onLeave={() => {}}
      />
    </GrandArchiveSimulatorProviders>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Material deck · 12" }));
  fireEvent.click(screen.getByRole("button", { name: "Move Life Essence Amulet to sideboard" }));
  expect(screen.getByRole("button", { name: "Sideboard · 1" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  expect(screen.getByRole("button", { name: "Sideboard · 0" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Move Life Essence Amulet to sideboard" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
  expect(confirm).toHaveBeenCalledWith(
    expect.objectContaining({ sideboard: [expect.objectContaining({ quantity: 1 })] }),
  );
});

it("infers a flat registration's decks without overriding explicit sections or inventory", () => {
  const registered = practicePreparationPool(launch(), "p1").registered;
  const mainDeck = [...registered.main, ...registered.material].map(
    ({ canonicalId, quantity }) => ({ cardId: canonicalId, quantity }),
  );
  const inferred = createGrandArchivePreparationPool({
    formatId: "standard",
    mainDeck,
    inventory: [],
  });
  expect(inferred.registered).toEqual(registered);
  expect(validateGrandArchivePreparation(inferred, inferred.previous).valid).toBe(true);
  expect(() =>
    createGrandArchivePreparationPool({
      formatId: "standard",
      mainDeck: mainDeck.map((card, index) =>
        index === 0 ? { ...card, sectionId: "main" } : card,
      ),
      inventory: [],
    }),
  ).toThrow("Spirit Champion");
  const reserve = registered.material.find(
    (entry) => entry.canonicalId !== registered.startingChampionId,
  )!;
  const withInventory = createGrandArchivePreparationPool({
    formatId: "standard",
    mainDeck: mainDeck.filter((entry) => entry.cardId !== reserve.canonicalId),
    inventory: [{ cardId: reserve.canonicalId, quantity: reserve.quantity }],
  });
  expect(withInventory.registered.sideboard).toEqual([reserve]);
  expect(
    withInventory.registered.material.some((entry) => entry.canonicalId === reserve.canonicalId),
  ).toBe(false);
});

it("preserves both configured Spirits when a deck has multiple level-zero Champions", async () => {
  const { grandArchivePracticeDecks } = await import("@tcg/grand-archive-server-adapter/practice");
  const base = grandArchivePracticeDecks[0]!.deck;
  const materialDeck = base.materialDeck.replace("1x Seer's Sword", "1x Spirit of Fire");
  const server = createGrandArchivePracticeEngineFromSetup({
    deck: { ...base, materialDeck, startingChampion: "Spirit of Wind" },
    opponentDeck: { ...base, materialDeck, startingChampion: "Spirit of Fire" },
    randomSeed: 123,
  });
  const selected = (engine: GrandArchiveServerEngine, id: string) => {
    const state = engine.runtime.state;
    return state.objects[state.pregame!.startingChampionIds[grandArchivePlayerId(id)]!]!
      .definitionId;
  };
  for (const id of ["p1", "p2"]) {
    expect(practicePreparationPool(server, id).previous.startingChampionId).toBe(
      selected(server, id),
    );
  }
  const confirmed = confirmPracticePreparation(
    server,
    practicePreparationPool(server, "p1").previous,
    "p1",
  );
  expect(selected(confirmed, "p1")).toBe(selected(server, "p1"));
  expect(selected(confirmed, "p2")).toBe(selected(server, "p2"));
});
