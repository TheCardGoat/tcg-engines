import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCardFilter,
  GrandArchiveEffect,
  GrandArchiveModeDeclaration,
} from "@tcg/grand-archive-types";
import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveTestCardRef } from "@tcg/grand-archive-engine/testing";
import { grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
import { galesMare } from "../cards/RDO/allies/gales-mare.ts";

type GrandArchiveTestCardRefLike = Parameters<GrandArchiveTestEngine["player"]>[0] extends never
  ? never
  : GrandArchiveTestCardRef;

export type GrandArchiveAnnouncementPreparation =
  | "ordinary"
  | "rested-ally"
  | "stack-target"
  | "attacking-enemy-ally"
  | "stack-action"
  | "stack-ability";

export function positiveFilterLeaves(
  filter: GrandArchiveCardFilter | undefined,
): readonly GrandArchiveCardFilter[] {
  if (!filter || filter.kind === "not") return [];
  if (filter.kind === "all" || filter.kind === "any") {
    return filter.filters.flatMap(positiveFilterLeaves);
  }
  return [filter];
}

function selectionMinimum(
  declaration:
    | GrandArchiveModeDeclaration
    | { readonly choose: GrandArchiveModeDeclaration["choose"] },
  announcement: { readonly activationImbued?: boolean } = {},
): number {
  const choose = declaration.choose;
  if (typeof choose === "undefined") throw new Error("Mode declaration lacks a choose count.");
  switch (choose.kind) {
    case "exactly":
    case "at-least":
      if (typeof choose.amount === "number") return choose.amount;
      if (
        typeof choose.amount === "object" &&
        choose.amount.kind === "conditional" &&
        choose.amount.condition.kind === "activation-state" &&
        choose.amount.condition.state === "imbued"
      ) {
        const resolved =
          announcement.activationImbued === true ? choose.amount.then : choose.amount.else;
        return typeof resolved === "number" ? resolved : NaN;
      }
      return NaN;
    case "up-to":
      return 0;
    case "between":
      return typeof choose.minimum === "number" ? choose.minimum : NaN;
    case "all":
    case "any-number":
      return 0;
    default:
      throw new Error(`Mode selection ${choose.kind} needs an explicit fixture derivation.`);
  }
}

export function embeddedModeDeclarations(effect: GrandArchiveEffect): readonly {
  readonly choose: GrandArchiveModeDeclaration["choose"];
  readonly modes: GrandArchiveModeDeclaration["modes"];
}[] {
  switch (effect.kind) {
    case "select-modes":
      return [effect];
    case "sequence":
      return effect.effects.flatMap(embeddedModeDeclarations);
    default:
      return [];
  }
}

/**
 * Playing Cards / Card Activation 1.4 — announcement modes must be selected as
 * the card is placed onto the Effects Stack. Derives the smallest legal
 * announcement selection from unconditional printed modes.
 */
export function modeSelection(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  announcement: { readonly activationImbued?: boolean } = {},
): readonly string[] {
  const selections: string[] = [];
  for (const ability of grandArchiveTestFace(card).abilities) {
    if (ability.kind !== "card-resolution") continue;
    const declarations = [
      ...(ability.modes && ability.modes.declared === "announcement" ? [ability.modes] : []),
      ...embeddedModeDeclarations(ability.effect),
    ];
    for (const declaration of declarations) {
      const minimum = selectionMinimum(declaration, announcement);
      if (!Number.isFinite(minimum)) {
        throw new Error(
          `${grandArchiveTestFace(card).name} needs an explicit mode selection fixture.`,
        );
      }
      const eligible = declaration.modes.filter((mode) => !mode.condition);
      if (eligible.length < minimum) {
        throw new Error(
          `${grandArchiveTestFace(card).name} has too few unconditional modes for a legal selection.`,
        );
      }
      selections.push(...eligible.slice(0, minimum).map((mode) => mode.id));
    }
  }
  return selections;
}

/**
 * Level-gated resolutions ([Level N+]) only announce their targets while the
 * controlling champion satisfies the printed level restriction.
 */
export function resolutionLevelThreshold(
  ability: GrandArchiveAbilityDefinition,
): number | undefined {
  if (!("restrictions" in ability) || !ability.restrictions) return undefined;
  for (const restriction of ability.restrictions) {
    if (restriction.kind !== "static" || restriction.name !== "level-restriction") continue;
    const comparison = restriction.condition;
    if (comparison.kind === "compare" && typeof comparison.comparison?.right === "number") {
      return comparison.comparison.right;
    }
  }
  return undefined;
}

export function announcementTargets(
  game: GrandArchiveTestEngine,
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  champion: GrandArchiveTestCardRefLike,
  preparation: GrandArchiveAnnouncementPreparation,
  championLevel: number,
): Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined {
  const player = game.player("player-one");
  const declarations = grandArchiveTestFace(card).abilities.flatMap((ability) => {
    if (ability.kind !== "card-resolution") return [];
    const threshold = resolutionLevelThreshold(ability);
    if (threshold !== undefined && threshold > championLevel) return [];
    return ability.targets ?? [];
  });
  if (declarations.length === 0) return undefined;

  const targets: Record<string, readonly GrandArchiveTargetId[]> = {};
  for (const declaration of declarations) {
    if (declaration.count.kind === "up-to" || declaration.count.kind === "any-number") {
      targets[declaration.id] = [];
      continue;
    }
    switch (declaration.candidates.kind) {
      case "object": {
        if (preparation === "attacking-enemy-ally") {
          targets[declaration.id] = [game.player("player-two").card(galesMare).objectId];
          break;
        }
        const filters = positiveFilterLeaves(declaration.candidates.filter);
        const targetsPotion = filters.some(
          (filter) => filter.kind === "subtype" && filter.oneOf.includes("POTION"),
        );
        const targetsChampion = filters.some(
          (filter) => filter.kind === "type" && filter.oneOf.includes("CHAMPION"),
        );
        const targetsAlly = filters.some(
          (filter) => filter.kind === "type" && filter.oneOf.includes("ALLY"),
        );
        if (targetsPotion) {
          targets[declaration.id] = [player.card(potionOfHealing, { zone: "field" }).objectId];
        } else if (targetsChampion && !targetsAlly) {
          targets[declaration.id] = [player.card(champion, { zone: "field" }).objectId];
        } else {
          targets[declaration.id] = [player.card(galesMare, { zone: "field" }).objectId];
        }
        break;
      }
      case "player":
        targets[declaration.id] = [
          Array.isArray(declaration.candidates.players) &&
          declaration.candidates.players.includes("opponent")
            ? game.player("player-two").id
            : player.id,
        ];
        break;
      case "stack-item": {
        const stackItem = game.state.stack.at(-1);
        if (!stackItem)
          throw new Error(`${grandArchiveTestFace(card).name} requires a stack target.`);
        targets[declaration.id] = [stackItem.id];
        break;
      }
      default:
        throw new Error(
          `${grandArchiveTestFace(card).name} needs an explicit fixture for ${declaration.candidates.kind} targets.`,
        );
    }
  }
  return targets;
}
