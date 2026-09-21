import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { ResolvedPracticeSeat } from "./data/resolve-text-deck";
import type { FabCardArtResolver } from "./cardArt";
import { useFabCardArt } from "./FabPresentationCatalog";
import { useFabCardPresentation } from "./useFabCardPresentation";
import { FabPostGameSummary } from "./FabPostGameSummary";
import type {
  FabCardSummary,
  FabPostGameSummaryModel,
  FabSummaryComparison,
} from "./FabPostGameSummary.model";

const FAB_SIMULATOR_BASE = "/flesh-and-blood/simulator";

type FixtureOutcome = FabPostGameSummaryModel["outcome"];
type FixturePremium = "none" | "viewer" | "opponent" | "both";

function fixtureCards(
  seat: ResolvedPracticeSeat,
  artResolver: FabCardArtResolver,
): readonly FabCardSummary[] {
  const seen = new Set<string>();
  return seat.cardPool.entries
    .filter((entry) => entry.source === "main")
    .flatMap((entry) => {
      if (seen.has(entry.canonicalId)) return [];
      seen.add(entry.canonicalId);
      const definition = seat.cardDefinitions[entry.canonicalId];
      const name = definition?.base.names[0];
      if (!definition || !name) return [];
      const art = artResolver.resolveFabCardArt({
        canonicalId: definition.canonicalId,
        slug: definition.slug,
        name,
      });
      const index = seen.size - 1;
      return [
        {
          id: definition.canonicalId,
          name,
          ...((art.printedImageUrl ?? art.boardImageUrl)
            ? { imageUrl: art.printedImageUrl ?? art.boardImageUrl }
            : {}),
          played: index % 4,
          pitched: (index * 2) % 4,
          defended: (index + 1) % 3,
          hits: index % 3 === 0 ? 1 : 0,
          source: "mock",
        } satisfies FabCardSummary,
      ];
    })
    .slice(0, 16);
}

function heroName(seat: ResolvedPracticeSeat): string {
  return seat.cardDefinitions[seat.cardPool.heroId]?.base.names[0] ?? "Unknown hero";
}

const comparison: readonly FabSummaryComparison[] = [
  ["attack-damage", "Attack damage", "34", "28"],
  ["hits-attacks", "Hits / attacks", "7 / 12", "5 / 11"],
  ["effective-defense", "Effective defense", "22", "19"],
  ["damage-prevented", "Damage prevented", "8", "5"],
  ["cards-pitched", "Cards pitched", "17", "15"],
  ["resources-spent", "Resources spent", "43", "39"],
].map(([id, label, viewer, opponent]) => ({
  id: id!,
  label: label!,
  viewer: viewer!,
  opponent: opponent!,
  source: "mock" as const,
}));

function createFixtureSummary(
  viewerSeat: ResolvedPracticeSeat,
  opponentSeat: ResolvedPracticeSeat,
  outcome: FixtureOutcome,
  premium: FixturePremium,
  artResolver: FabCardArtResolver,
): FabPostGameSummaryModel {
  const viewerWon = outcome === "victory";
  const opponentWon = outcome === "defeat";
  const cards = fixtureCards(viewerSeat, artResolver).map((card, index) =>
    // Exercise the name-only aggregate presentation for one usage row.
    index === 1 ? { ...card, id: `name:${card.name}` } : card,
  );
  const opponentCards = fixtureCards(opponentSeat, artResolver);
  const viewerHero = heroName(viewerSeat);
  const opponentHero = heroName(opponentSeat);
  const reason =
    outcome === "draw" ? "mutual defeat" : outcome === "defeat" ? "concession" : "lethal damage";
  const handCards = cards.slice(0, 5).map((card, index) => ({
    // One name-only hand card exercises the aggregated-reference hint.
    id: index === 3 ? null : card.id,
    name: card.name,
  }));
  const firstCard = handCards[0] ?? { id: "mock-play", name: "Played card" };
  const secondCard = handCards[1] ?? { id: "mock-pitch", name: "Pitched card" };
  const thirdCard = handCards[2] ?? { id: "mock-defense", name: "Defending card" };
  const heldCard = handCards[3] ?? { id: "mock-held", name: "Held card" };

  return {
    viewer: {
      id: "fixture-viewer",
      label: "Layout reviewer with a deliberately long display name",
      heroName: viewerHero,
      ...(premium === "viewer" || premium === "both" ? { subscriptionTier: "tier4" } : {}),
      life: outcome === "defeat" ? 30 : outcome === "draw" ? 0 : 11,
      result: viewerWon ? "win" : opponentWon ? "loss" : "draw",
    },
    opponent: {
      id: "fixture-opponent",
      label: "Premium practice opponent",
      heroName: opponentHero,
      ...(premium === "opponent" || premium === "both"
        ? { subscriptionTier: "tier4" }
        : { subscriptionTier: "free" }),
      life: viewerWon ? 0 : outcome === "draw" ? 0 : 21,
      result: opponentWon ? "win" : viewerWon ? "loss" : "draw",
    },
    outcome,
    outcomeTitle: outcome === "victory" ? "Victory" : outcome === "defeat" ? "Defeat" : "Draw",
    outcomeDetail:
      outcome === "draw"
        ? `${viewerHero} and ${opponentHero} were both defeated`
        : `${viewerWon ? viewerHero : opponentHero} defeated ${viewerWon ? opponentHero : viewerHero}`,
    reason: { value: reason, source: "mock" },
    turnNumber: { value: 14, source: "mock" },
    durationSeconds: { value: 18 * 60 + 57, source: "mock" },
    formatLabel: { value: "Classic Constructed", source: "mock" },
    comparison,
    lifeByTurn: {
      turns: [0, 2, 4, 6, 8, 10, 12, 14],
      viewer: [40, 38, 34, 30, 26, 19, 12, outcome === "defeat" ? 30 : 11],
      opponent: [40, 36, 32, 29, 25, 22, 17, viewerWon ? 0 : 21],
      source: "mock",
    },
    turns: Array.from({ length: 14 }, (_, index) => ({
      turn: index + 1,
      cardsPlayed: (index % 4) + 1,
      cardsPitched: (index + 2) % 4,
      resourcesGenerated: ((index + 2) % 4) * 3,
      damageDealt: index % 3 === 0 ? 6 : index % 2 === 0 ? 3 : 0,
      cardsDefended: index % 4,
      cardsPlayedFromArsenal: index % 5 === 0 ? 1 : 0,
      source: "mock" as const,
    })),
    hands: [
      {
        cycle: 1,
        openedAfterTurn: null,
        openedBy: "opening-hand",
        startingCards: [firstCard, secondCard, thirdCard, heldCard],
        carriedCards: [],
        endingCards: [heldCard],
        actions: [
          {
            sequence: 1,
            turn: 1,
            kind: "played",
            cardId: firstCard.id,
            cardName: firstCard.name,
            origin: "hand",
            destination: "arena",
          },
          {
            sequence: 2,
            turn: 1,
            kind: "pitched",
            cardId: secondCard.id,
            cardName: secondCard.name,
            origin: "hand",
            destination: "pitch",
          },
          {
            sequence: 3,
            turn: 2,
            kind: "defended",
            cardId: thirdCard.id,
            cardName: thirdCard.name,
            origin: "hand",
            destination: "defending",
          },
        ],
        closedAfterTurn: 2,
        source: "mock",
      },
      {
        cycle: 2,
        openedAfterTurn: 2,
        openedBy: "draw-to-intellect",
        startingCards: [heldCard, ...handCards.slice(0, 3)],
        carriedCards: [heldCard],
        endingCards: [],
        actions: [
          {
            sequence: 4,
            turn: 3,
            kind: "played",
            cardId: heldCard.id,
            cardName: heldCard.name,
            origin: "hand",
            destination: "arena",
          },
          {
            sequence: 5,
            turn: 3,
            kind: "arsenaled",
            cardId: secondCard.id,
            cardName: secondCard.name,
            origin: "hand",
            destination: "arsenal",
          },
          {
            sequence: 6,
            turn: 5,
            kind: "played",
            cardId: secondCard.id,
            cardName: secondCard.name,
            origin: "arsenal",
            destination: "arena",
          },
        ],
        closedAfterTurn: 5,
        source: "mock",
      },
    ],
    combatValue: {
      source: "mock",
      viewer: { attack: 72, otherDamage: 0, defense: 24, prevention: 0, total: 96 },
      opponent: { attack: 48, otherDamage: 12, defense: 36, prevention: 0, total: 96 },
      turns: Array.from({ length: 12 }, (_, index) => ({
        turn: index + 1,
        completed: index !== 11,
        viewer: { attack: 6, otherDamage: 0, defense: 2, prevention: 0, total: 8 },
        opponent: { attack: 4, otherDamage: 1, defense: 3, prevention: 0, total: 8 },
      })),
    },
    cards,
    opponentCards,
    match: {
      source: "mock",
      viewerWins: viewerWon ? 2 : 1,
      opponentWins: viewerWon ? 1 : 2,
      games: [
        { game: 1, result: "win", turnCount: 12, lifeRemaining: 8, ending: "lethal damage" },
        { game: 2, result: "loss", turnCount: 15, lifeRemaining: 0, ending: "lethal damage" },
        {
          game: 3,
          result: viewerWon ? "win" : "loss",
          turnCount: 14,
          lifeRemaining: viewerWon ? 11 : 0,
          ending: reason,
        },
      ],
      comparison,
      cards,
      opponentCards,
      observations: [
        "The deciding game compressed the final three attack cycles into one narrow life window.",
        "Pitch density peaked in the middle turns before both players shifted toward defense.",
        "The longest observation intentionally checks wrapping without inventing additional gameplay rules.",
      ],
    },
    hasMockData: true,
  };
}

export function FabPostGameSummaryFixturePage({
  viewerSeat,
  opponentSeat,
}: {
  readonly viewerSeat: ResolvedPracticeSeat;
  readonly opponentSeat: ResolvedPracticeSeat;
}) {
  const artResolver = useFabCardArt();
  const [searchParams] = useSearchParams();
  const outcomeParam = searchParams.get("outcome");
  const outcome: FixtureOutcome =
    outcomeParam === "victory" || outcomeParam === "draw" ? outcomeParam : "defeat";
  const premiumParam = searchParams.get("premium");
  const premium: FixturePremium =
    premiumParam === "viewer" || premiumParam === "opponent" || premiumParam === "both"
      ? premiumParam
      : "none";
  const scope = searchParams.get("scope") === "match" ? "match" : "game";
  const tab = searchParams.get("tab");
  const gameTab = tab === "turns" || tab === "hands" || tab === "cards" ? tab : "overview";
  const matchTab = tab === "games" || tab === "cards" ? tab : "overview";
  const definitions = useMemo(
    () =>
      viewerSeat.cardPool.entries
        .filter((entry) => entry.source === "main")
        .map((entry) => viewerSeat.cardDefinitions[entry.canonicalId])
        .filter((definition) => definition !== undefined)
        .slice(0, 16),
    [viewerSeat],
  );
  useFabCardPresentation(definitions, viewerSeat.cardPool.heroId);
  const opponentDefinitions = useMemo(
    () =>
      opponentSeat.cardPool.entries
        .filter((entry) => entry.source === "main")
        .map((entry) => opponentSeat.cardDefinitions[entry.canonicalId])
        .filter((definition) => definition !== undefined)
        .slice(0, 16),
    [opponentSeat],
  );
  useFabCardPresentation(opponentDefinitions, opponentSeat.cardPool.heroId);
  const summary = useMemo(
    () => createFixtureSummary(viewerSeat, opponentSeat, outcome, premium, artResolver),
    [opponentSeat, outcome, premium, artResolver, viewerSeat],
  );

  return (
    <div data-testid="fab-post-game-summary-fixture">
      <FabPostGameSummary
        summary={summary}
        initialScope={scope}
        initialGameTab={gameTab}
        initialMatchTab={matchTab}
        onInspectBoard={() => undefined}
        onMainMenu={() => window.location.assign(`${FAB_SIMULATOR_BASE}/tests`)}
        onPlayAgain={() => window.location.reload()}
      />
    </div>
  );
}
