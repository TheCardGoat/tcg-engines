import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { toFabCardDefinition } from "@tcg/flesh-and-blood-engine/catalog";
import { loadFleshAndBloodStructuredCards } from "../../runtime-registry.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { emperorDracaiOfAesir } from "../heroes/emperor-dracai-of-aesir.ts";
import { imperialLedgerRed } from "./imperial-ledger.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Imperial Ledger (DYN241) mutually exclusive token result", () => {
  it("creates Copper, and not Gold, for a non-Royal hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [imperialLedgerRed], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const ledgerId = Bravo.findCardInZone("arena", imperialLedgerRed);

    Bravo.activate(imperialLedgerRed);
    game.passBoth();

    expect(Bravo.zone("arena").filter((id) => id === "token:copper")).toHaveLength(1);
    expect(Bravo.zone("arena").filter((id) => id === "token:gold")).toHaveLength(0);
    expect(Bravo.zone("arena")).not.toContain(imperialLedgerRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(imperialLedgerRed.canonicalId);
    expect(Bravo.actionPoints()).toBe(0);
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "move-zone" && event.data.object.instanceId === ledgerId),
    ).toHaveLength(1);
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "shuffle-zone" && event.data.playerId === Bravo.id),
    ).toHaveLength(1);
  });

  it("creates the Gold face of one physical Agility // Gold twin for a Royal hero", async () => {
    const physicalCards = await loadFleshAndBloodStructuredCards(["WqTTMjDgKKCp7Lnb7LH6d"]);
    const physicalGold = physicalCards.get("WqTTMjDgKKCp7Lnb7LH6d");
    if (!physicalGold) throw new Error("Expected physical Agility // Gold definition.");
    const game = FabTestEngine.start(
      { hero: emperorDracaiOfAesir, arena: [imperialLedgerRed], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const registeredGold = toFabCardDefinition(physicalGold);
    game.registerCardDefinition(registeredGold, "token:gold");
    const Emperor = game.as(emperorDracaiOfAesir);
    const ledgerId = Emperor.findCardInZone("arena", imperialLedgerRed);

    Emperor.activate(imperialLedgerRed);
    game.passBoth();

    expect(Emperor.zone("arena").filter((id) => id === physicalGold.canonicalId)).toHaveLength(1);
    expect(Emperor.zone("arena").filter((id) => id === "token:copper")).toHaveLength(0);
    expectFabCard(Emperor, physicalGold.canonicalId).toHaveName("Gold");
    expect(Emperor.zone("arena")).not.toContain(imperialLedgerRed.canonicalId);
    expect(Emperor.zone("deck")).toContain(imperialLedgerRed.canonicalId);
    expect(Emperor.actionPoints()).toBe(0);
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "move-zone" && event.data.object.instanceId === ledgerId),
    ).toHaveLength(1);
    expect(
      game
        .committedEvents()
        .filter((event) => event.name === "shuffle-zone" && event.data.playerId === Emperor.id),
    ).toHaveLength(1);
  });
});
