import {
  alphaInstinctBlue,
  becomeTheBottleRed,
  crouchingTiger,
  surgingStrikeRed,
  gustwaveOfTheSecondWindRed,
  hulkUpBlue,
  iraCrimsonHaze,
  katsu,
  retraceThePastBlue,
  snatchRed,
  brutalAssaultBlue,
  tigrineReflexRed,
  windUpTheCrowdBlue,
  wreckerRompBlue,
} from "@tcg/flesh-and-blood-cards/simulator-scenario-cards";
import { catalogIds, listLegalCommands } from "@tcg/flesh-and-blood-engine/simulator";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { describe, expect, it } from "vitest";
import { getFabEngineScenario } from "./index";
import { presentRuntime } from "../projection";

describe("FAB engine scenarios · interactions", () => {
  it("offers three authored Rune Gate attacks from the multi-card Banished fixture", () => {
    const match = getFabEngineScenario("multiple-playable-banished-cards")?.boot();
    if (!match) throw new Error("Missing multiple playable banished cards fixture.");

    const presentation = presentRuntime(match.runtime, match.player1Id);
    const banishedCards = Object.values(presentation.cards).filter(
      (card) => card.ownerId === match.player1Id && card.zone === "banished",
    );
    expect(
      banishedCards.map((card) => presentation.cardDefinitions[card.cardId]?.name).sort(),
    ).toEqual(["Rift Skitter", "Vantom Banshee", "Vantom Wraith"]);

    const banishedIds = new Set(banishedCards.map((card) => card.id));
    const playableBanishedIds = new Set(
      listLegalCommands(match.runtime, match.player1Id)
        .map((command) => command.sourceInstanceId)
        .filter((id): id is string => id !== undefined && banishedIds.has(id)),
    );
    expect(playableBanishedIds).toEqual(banishedIds);
  });

  it("opens both Ninja name-changing combo lines in hand before combat", () => {
    const becomeScenario = getFabEngineScenario("ninja-become-the-bottle-name");
    const retraceScenario = getFabEngineScenario("ninja-retrace-the-past-name");
    const becomeMatch = becomeScenario?.boot();
    const retraceMatch = retraceScenario?.boot();
    if (!becomeScenario || !retraceScenario || !becomeMatch || !retraceMatch) {
      throw new Error("Missing Ninja name-choice scenarios.");
    }

    expect(becomeScenario.botMode).toBe("hero-profile");
    expect(retraceScenario.botMode).toBe("hero-profile");

    expect(becomeMatch.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: becomeMatch.player1Id,
    });
    const BecomeKatsu = FabTestEngine.fromRuntime(becomeMatch.runtime).as(katsu);
    expectFabCard(BecomeKatsu, crouchingTiger).toBeIn("hand");
    expectFabCard(BecomeKatsu, becomeTheBottleRed).toBeIn("hand");
    expect(presentRuntime(becomeMatch.runtime, becomeMatch.player1Id).combat).toBeNull();

    expect(retraceMatch.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: retraceMatch.player1Id,
    });
    const RetraceKatsu = FabTestEngine.fromRuntime(retraceMatch.runtime).as(katsu);
    expectFabCard(RetraceKatsu, surgingStrikeRed).toBeIn("hand");
    expectFabCard(RetraceKatsu, gustwaveOfTheSecondWindRed).toBeIn("hand");
    expectFabCard(RetraceKatsu, retraceThePastBlue).toBeIn("hand");
    expectFabCard(RetraceKatsu, snatchRed).toBeIn("hand");
    expect(presentRuntime(retraceMatch.runtime, retraceMatch.player1Id).combat).toBeNull();
  });

  it("plays the full Retrace the Past combo line and applies the chosen name and power", () => {
    const scenario = getFabEngineScenario("ninja-retrace-the-past-name");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing Retrace the Past name-choice scenario.");

    expect(scenario.botMode).toBe("hero-profile");
    const game = FabTestEngine.fromRuntime(match.runtime);
    const Katsu = game.as(katsu);

    Katsu.playAttack(surgingStrikeRed);
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    Katsu.playAttack(gustwaveOfTheSecondWindRed);
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    Katsu.playAttack(retraceThePastBlue, { stopAt: "on-attack" });
    Katsu.choose("Snatch");
    game.advanceUntil({ stopAt: "defend", optionals: "decline", ordering: "listed" });

    expectFabCard(Katsu, retraceThePastBlue).toHaveName("Snatch");
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Katsu, snatchRed).toBeIn("hand");
    expect(game.renderedPlayerNarrative(match.player1Id)).toContain("You named Snatch.");
  });

  it("opens the Tigrine Reflex line in hand before combat", () => {
    const scenario = getFabEngineScenario("ninja-tigrine-reflex-reaction");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing Tigrine Reflex reaction scenario.");

    expect(scenario.botMode).toBe("hero-profile");

    expect(match.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: match.player1Id,
    });
    const Ira = FabTestEngine.fromRuntime(match.runtime).as(iraCrimsonHaze);
    expectFabCard(Ira, surgingStrikeRed).toBeIn("hand");
    expectFabCard(Ira, crouchingTiger).toBeIn("hand");
    expectFabCard(Ira, tigrineReflexRed).toBeIn("hand");
    expect(presentRuntime(match.runtime, match.player1Id).combat).toBeNull();
  });

  it.each([
    ["song-of-sinew-reorder", "hand", "Song of Sinew"],
    ["sutcliffe-research-notes-reorder", "hand", "Sutcliffe's Research Notes"],
    ["spire-sniping-reorder", "arsenal", "Spire Sniping"],
  ] as const)(
    "starts %s before the authored action that creates its reorder prompt",
    (scenarioId, sourceZone, sourceName) => {
      const match = getFabEngineScenario(scenarioId)?.boot();
      if (!match) throw new Error(`Missing ${scenarioId} reorder scenario.`);

      expect(match.runtime.waitState().kind).toBe("priority");
      const presentation = presentRuntime(match.runtime, match.player1Id);
      const sourceCards = Object.values(presentation.cards).filter(
        (card) => card.ownerId === match.player1Id && card.zone === sourceZone,
      );
      expect(sourceCards.map((card) => presentation.cardDefinitions[card.cardId]?.name)).toContain(
        sourceName,
      );

      if (scenarioId === "spire-sniping-reorder") {
        const headCards = Object.values(presentation.cards).filter(
          (card) => card.ownerId === match.player1Id && card.zone === "head",
        );
        expect(headCards.map((card) => presentation.cardDefinitions[card.cardId]?.name)).toContain(
          "Skullbone Crosswrap",
        );
      }
    },
  );

  it("seats the Tuffnut Song + Rip line with authored weapon and attack-action recipients", () => {
    const match = getFabEngineScenario("tuffnut-song-rip-rok")?.boot();
    if (!match) throw new Error("Missing Tuffnut Song + Rip + Rok scenario.");

    const presentation = presentRuntime(match.runtime, match.player1Id);
    const playerCards = Object.values(presentation.cards).filter(
      (card) => card.ownerId === match.player1Id,
    );
    const cardNames = playerCards.map((card) => presentation.cardDefinitions[card.cardId]?.name);
    const deckCards = playerCards.filter((card) => card.zone === "deck");

    expect(cardNames).toEqual(
      expect.arrayContaining([
        "Tuffnut",
        "Rok",
        "Brutal Assault",
        "Song of Sinew",
        "Rip Off the Top",
      ]),
    );
    expect(deckCards).toHaveLength(4);
    const deckInstanceIds =
      match.runtime.getState().containers.zonesByPlayerId[match.player1Id]!.deck;
    const deckCanonicalIds = deckInstanceIds.map(
      (instanceId) => match.runtime.getState().objects[instanceId]?.canonicalId,
    );
    expect(deckCanonicalIds).toEqual([
      alphaInstinctBlue.canonicalId,
      windUpTheCrowdBlue.canonicalId,
      hulkUpBlue.canonicalId,
      wreckerRompBlue.canonicalId,
    ]);
    for (const card of [alphaInstinctBlue, windUpTheCrowdBlue, hulkUpBlue, wreckerRompBlue]) {
      expect(card.base).toMatchObject({ color: "blue", numeric: { power: 6 } });
    }
    expect(match.runtime.getState().players[match.player1Id]?.resourcePoints).toBe(0);
    expect(brutalAssaultBlue.base).toMatchObject({
      typeBox: { types: ["Action"], subtypes: ["Attack"] },
      numeric: { power: 4 },
    });
    expect(match.runtime.waitState()).toMatchObject({
      kind: "priority",
      playerId: match.player1Id,
    });
  });

  it("boots the Boltyn hero signal from a legal authored charge", () => {
    const match = getFabEngineScenario("hero-signal-boltyn-bottom")?.boot();
    if (!match) throw new Error("Missing Boltyn hero signal scenario.");

    const presentation = presentRuntime(match.runtime, match.player1Id);
    expect(presentation.heroSignals[match.player1Id]).toEqual([
      { kind: "flag", id: "charged" },
      { kind: "count", id: "soul-added", value: 1 },
    ]);
    expect(presentation.combat?.open).toBe(true);
  });

  it("seats three real cards with Opt abilities in the Opt ability lab", () => {
    const match = getFabEngineScenario("opt-ability-lab")?.boot();
    if (!match) throw new Error("Missing Opt ability lab scenario.");

    const presentation = presentRuntime(match.runtime, match.player1Id);
    const cards = Object.values(presentation.cards).filter(
      (card) => card.ownerId === match.player1Id,
    );
    const names = cards.map((card) => presentation.cardDefinitions[card.cardId]?.name);

    expect(names).toEqual(
      expect.arrayContaining(["Whisper of the Oracle", "Optekal Monocle", "Talismanic Lens"]),
    );
  });

  it("opens the permanent-token lab with repeated authored generators", () => {
    const scenario = getFabEngineScenario("permanent-token-generation");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing permanent-token generation scenario.");

    const state = match.runtime.getState();
    const hand = state.containers.zonesByPlayerId[match.player1Id]?.hand ?? [];
    const handCanonicalIds = hand.map((instanceId) => state.objects[instanceId]?.canonicalId);

    expect(scenario.viewerId).toBe(match.player1Id);
    expect(scenario.botMode).toBe("pass-only");
    expect(new Set(handCanonicalIds)).toEqual(
      new Set([
        "Rmm8PgnzKNNfLcnKh86jd",
        "RGHRQgGJdBhBPgM9Pfgw7",
        "6DkjQLNmzwdBmwhfGWTJG",
        "kD798qm7kWr9fhCLM9dDm",
      ]),
    );
    expect(handCanonicalIds).toHaveLength(8);
    expect(handCanonicalIds.filter((id) => id === "Rmm8PgnzKNNfLcnKh86jd")).toHaveLength(3);
    expect(handCanonicalIds.filter((id) => id === "RGHRQgGJdBhBPgM9Pfgw7")).toHaveLength(2);
    expect(handCanonicalIds.filter((id) => id === "6DkjQLNmzwdBmwhfGWTJG")).toHaveLength(2);
    expect(state.containers.zonesByPlayerId[match.player1Id]?.arena ?? []).toHaveLength(0);
  });

  it("creates and projects Agility, Might, Vigor, and Gold in the permanent zone", () => {
    const match = getFabEngineScenario("permanent-token-generation")?.boot();
    if (!match) throw new Error("Missing permanent-token generation scenario.");
    const player = match.engine.as(catalogIds.bravo);

    for (const canonicalId of [
      "Rmm8PgnzKNNfLcnKh86jd",
      "Rmm8PgnzKNNfLcnKh86jd",
      "Rmm8PgnzKNNfLcnKh86jd",
      "RGHRQgGJdBhBPgM9Pfgw7",
      "RGHRQgGJdBhBPgM9Pfgw7",
      "6DkjQLNmzwdBmwhfGWTJG",
      "6DkjQLNmzwdBmwhfGWTJG",
    ]) {
      player.activate(canonicalId, { index: 0 });
      match.engine.helpers.resolveUntilIdle({ ordering: "listed" });
    }
    player.play("kD798qm7kWr9fhCLM9dDm");
    match.engine.helpers.resolveUntilIdle({ ordering: "listed" });

    const presentation = presentRuntime(match.runtime, match.player1Id);
    const permanentNames = Object.values(presentation.cards)
      .filter((card) => card.ownerId === match.player1Id && card.zone === "permanent")
      .map((card) => presentation.cardDefinitions[card.cardId]?.name)
      .sort();
    expect(permanentNames).toEqual([
      "Agility",
      "Agility",
      "Agility",
      "Gold",
      "Might",
      "Might",
      "Vigor",
      "Vigor",
    ]);
  });

  it.each([
    ["pilfer-legal-targets", ["kzW8BKdWcm9LwtTCTdqRK", "Dbhn6rRcrbdRnKbqdPdwh"]],
    ["pilfer-invalid-targets", ["kzW8BKdWcm9LwtTCTdqRK"]],
  ] as const)("boots %s with the intended real opposing graveyard", (scenarioId, graveyardIds) => {
    const match = getFabEngineScenario(scenarioId)?.boot();
    if (!match) throw new Error(`Missing ${scenarioId} scenario.`);
    const state = match.runtime.getState();
    const hand = state.containers.zonesByPlayerId[match.player1Id]?.hand ?? [];
    const graveyard = state.containers.zonesByPlayerId[match.player2Id]?.graveyard ?? [];

    expect(hand.map((instanceId) => state.objects[instanceId]?.canonicalId)).toContain(
      "pQjcMbpRPhTG8DkHftnK9",
    );
    expect(graveyard.map((instanceId) => state.objects[instanceId]?.canonicalId)).toEqual(
      graveyardIds,
    );
  });

  it("opens the four-card pitch-stack fixture at the ordering decision", () => {
    const match = getFabEngineScenario("pitch-stack-four-cards")?.boot();
    if (!match) throw new Error("Missing four-card pitch-stack scenario.");

    const wait = match.runtime.waitState();
    expect(wait.kind).toBe("decision");
    if (wait.kind !== "decision") return;
    expect(wait.decision).toMatchObject({
      kind: "ordering",
      actorId: match.player1Id,
    });
    if (wait.decision.kind !== "ordering") return;
    expect(wait.decision.entries).toHaveLength(4);
    expect(
      match.runtime.getState().containers.zonesByPlayerId[match.player1Id]?.pitch,
    ).toHaveLength(4);
  });
});
