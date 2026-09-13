import type {
  GrandArchiveCardFilter,
  GrandArchiveKeyword,
  GrandArchiveTargetDeclaration,
} from "@tcg/grand-archive-types";
import {
  matchesGrandArchiveCardFilter,
  type GrandArchiveEvaluationContext,
} from "../procedures/effects/evaluation.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "./model.ts";
import { grandArchiveObjectActiveKeywords } from "../rules/abilities/intrinsic-keywords.ts";

export const GRAND_ARCHIVE_LINK_TARGET_BINDING = "intrinsic-link-target";

type GrandArchiveLinkKeyword = Extract<GrandArchiveKeyword, { readonly name: "link" }>;

function linkTargetFilter(target: GrandArchiveLinkKeyword["target"]): GrandArchiveCardFilter {
  switch (target) {
    case "ally":
      return { kind: "type", oneOf: ["ALLY"] };
    case "unit":
      return { kind: "type", oneOf: ["ALLY", "CHAMPION"] };
    case "champion":
      return { kind: "type", oneOf: ["CHAMPION"] };
    case "non-champion-object":
      return { kind: "not", filter: { kind: "type", oneOf: ["CHAMPION"] } };
    case "item-or-weapon":
      return { kind: "type", oneOf: ["ITEM", "WEAPON"] };
    case "regalia":
      return { kind: "supertype", oneOf: ["REGALIA"] };
    case "polearm-weapon":
      return {
        kind: "all",
        filters: [
          { kind: "type", oneOf: ["WEAPON"] },
          { kind: "subtype", oneOf: ["POLEARM"] },
        ],
      };
    case "sword-weapon":
      return {
        kind: "all",
        filters: [
          { kind: "type", oneOf: ["WEAPON"] },
          { kind: "subtype", oneOf: ["SWORD"] },
        ],
      };
    case "warrior-weapon":
      return {
        kind: "all",
        filters: [
          { kind: "type", oneOf: ["WEAPON"] },
          { kind: "class", oneOf: ["WARRIOR"] },
        ],
      };
    default:
      return assertNever(target);
  }
}

export function grandArchiveActiveLinkKeywords(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): readonly GrandArchiveLinkKeyword[] {
  return grandArchiveObjectActiveKeywords(program, state, object).filter(
    (keyword): keyword is GrandArchiveLinkKeyword => keyword.name === "link",
  );
}

function activeLinkFilter(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): GrandArchiveCardFilter | undefined {
  const filters = grandArchiveActiveLinkKeywords(program, state, object).map((keyword) =>
    linkTargetFilter(keyword.target),
  );
  if (filters.length === 0) return undefined;
  return filters.length === 1 ? filters[0] : { kind: "any", filters };
}

export function grandArchiveLinkChoiceCandidates(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): GrandArchiveTargetDeclaration["candidates"] | undefined {
  const filter = activeLinkFilter(program, state, object);
  return filter
    ? {
        kind: "object",
        zones: ["field"],
        filter,
      }
    : undefined;
}

export function grandArchiveLinkTargetDeclaration(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): GrandArchiveTargetDeclaration | undefined {
  const candidates = grandArchiveLinkChoiceCandidates(program, state, object);
  if (!candidates) return undefined;
  return {
    id: GRAND_ARCHIVE_LINK_TARGET_BINDING,
    kind: "target",
    declared: "announcement",
    chooser: "controller",
    count: { kind: "exactly", amount: 1 },
    candidates,
  };
}

export function grandArchiveLinkIsLegal(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  const filter = activeLinkFilter(program, state, object);
  if (!filter || object.zone !== "field" || !object.hostId) return false;
  const linked = state.objects[object.hostId];
  if (!linked || linked.zone !== "field" || linked.id === object.id) return false;
  const evaluation: GrandArchiveEvaluationContext = {
    program,
    state,
    controllerId: object.controllerId,
    sourceId: object.id,
    abilityBearerId: object.id,
    candidateId: linked.id,
    bindings: {},
  };
  return matchesGrandArchiveCardFilter(linked, filter, evaluation);
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive Link target: ${JSON.stringify(value)}`);
}
