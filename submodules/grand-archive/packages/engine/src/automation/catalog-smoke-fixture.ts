import { grandArchiveCards } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCardFace,
} from "@tcg/grand-archive-types";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";

type CatalogCard = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

function defaultFace(card: CatalogCard): GrandArchiveCardFace<GrandArchiveAbilityDefinition> {
  return card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
}

function standardSmokeDeck(): readonly CatalogCard[] {
  const names = new Set<string>();
  const selected: CatalogCard[] = [];
  for (const card of grandArchiveCards) {
    const face = defaultFace(card);
    if (
      card.definitionKind !== "card" ||
      face.typeLine.types.includes("CHAMPION") ||
      face.typeLine.types.includes("LESSER BOON") ||
      face.typeLine.types.includes("GREATER BOON") ||
      face.typeLine.supertypes.includes("REGALIA") ||
      !face.elements.includes("NORM") ||
      face.cost.kind !== "reserve" ||
      typeof face.cost.amount !== "number" ||
      face.cost.amount > 1 ||
      names.has(face.name)
    ) {
      continue;
    }
    names.add(face.name);
    selected.push(card);
    if (selected.length === 15) return selected;
  }
  throw new Error(`Real catalog supplied only ${selected.length} suitable smoke-deck cards`);
}

function levelZeroChampion(): CatalogCard {
  const champion = grandArchiveCards.find((card) => {
    const face = defaultFace(card);
    return (
      card.definitionKind === "card" &&
      face.typeLine.types.includes("CHAMPION") &&
      face.stats.level === 0 &&
      face.abilities.some((ability) => {
        const trigger = ability.kind === "triggered" ? ability.trigger : undefined;
        return (
          trigger?.kind === "event" &&
          "name" in trigger.event &&
          trigger.event.name === "object-entered-field"
        );
      })
    );
  });
  if (!champion) throw new Error("Real catalog has no level-0 starting champion");
  return champion;
}

/** A deterministic, real-catalog fixture shared by automation smoke tests and local benchmarks. */
export function createGrandArchiveCatalogSmokeFixture(randomSeed: number) {
  const champion = levelZeroChampion();
  const mainCards = standardSmokeDeck();
  const program = createGrandArchiveMatchProgram(grandArchiveCards);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: mainCards.map((card) => ({ definitionId: card.canonicalId, count: 4 })),
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initialState = createGrandArchiveMatchInitialState(program, {
    mode: "standard",
    players: [player("p1"), player("p2")],
    firstPlayerId: "p1",
    randomSeed,
  });
  return { program, initialState };
}
