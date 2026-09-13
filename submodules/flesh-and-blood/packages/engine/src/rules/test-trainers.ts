/**
 * Minimal seated card definitions for CR keyword/effect tests.
 * Registered through the same FabCardDefinitionInput path as catalog modules —
 * never a parallel rules engine.
 *
 * POLICY (per `src/rules/card-behavior/INTENT.md` real-card rule): trainers
 * exist ONLY for mechanics that lack a real catalog representative. Every
 * behavior that a printed card covers must be tested with that real catalog
 * card (see `docs/fluent-test-api-plan.md`), not a trainer. Do not add a
 * trainer when a catalog card already exercises the mechanic, and retire a
 * trainer when a suitable catalog representative is identified.
 */
import type { FabCardDefinitionInput, FabLooseCardDefinitionInput } from "../cards.ts";
import type {
  FabCondition,
  FabEffect,
  FabLabelName,
  FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";

export function trainerId(slug: string): string {
  return `trainer-${slug}`;
}

/** Cost-0 attack action with optional keywords and a hit trigger effect. */
export function hitTrainer(opts: {
  slug: string;
  effect?: FabEffect;
  keywords?: FabCardDefinitionInput["keywords"];
  power?: number;
  defense?: number;
  cost?: number;
  pitch?: number;
  hitTarget?: "hero";
  label?: FabLabelName;
  text?: string;
}): FabLooseCardDefinitionInput & { readonly canonicalId: string } {
  const canonicalId = trainerId(opts.slug);
  const abilities: FleshAndBloodAbility[] = opts.effect
    ? [
        {
          id: `${canonicalId}-hit`,
          kind: "static",
          staticKind: "triggered",
          text: opts.text ?? "When this hits, resolve effect.",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: { kind: "player", player: "ability-controller" },
              observes: { kind: "source", selector: "attack" },
              ...(opts.hitTarget ? { target: { kind: opts.hitTarget } } : {}),
            },
          },
          resolution: { kind: "effect", effect: opts.effect },
        },
      ]
    : [];
  return {
    canonicalId,
    types: ["Generic", "Action", "Attack"],
    cost: opts.cost ?? 0,
    power: opts.power ?? 4,
    defense: opts.defense ?? 2,
    pitch: opts.pitch !== undefined ? String(opts.pitch) : undefined,
    keywords: opts.keywords ?? [],
    abilities,
  };
}

/** Equipment trainer for battleworn / blade-break / temper / guardwell. */
export function equipmentTrainer(opts: {
  slug: string;
  keywords: FabCardDefinitionInput["keywords"];
  defense?: number;
  zoneSubtype?: "Head" | "Chest" | "Arms" | "Legs";
}): FabCardDefinitionInput & { readonly canonicalId: string } {
  const subtype = opts.zoneSubtype ?? "Legs";
  return {
    canonicalId: trainerId(opts.slug),
    types: ["Generic", "Equipment", subtype],
    defense: opts.defense ?? 1,
    keywords: opts.keywords,
    abilities: [],
  };
}

/**
 * Minimal Item trainer for tests that need an Item-typed card as a fixture
 * target (e.g. CR 8.3.32 scrap banishing "an item or equipment" from the
 * graveyard). Mirrors {@link equipmentTrainer}; the engine normalizes "Item"
 * into typeBox.subtypes, so the produced card satisfies scrap's Item match.
 */
export function itemTrainer(opts: {
  slug: string;
  keywords?: FabCardDefinitionInput["keywords"];
  cost?: number;
}): FabCardDefinitionInput & { readonly canonicalId: string } {
  return {
    canonicalId: trainerId(opts.slug),
    types: ["Generic", "Action", "Item"],
    cost: opts.cost ?? 0,
    keywords: opts.keywords ?? [],
    abilities: [],
  };
}

/** Resource with pitch trigger. */
export function pitchTrainer(opts: {
  slug: string;
  effect: FabEffect;
  condition?: FabCondition;
  keywords?: FabCardDefinitionInput["keywords"];
  pitch?: number;
}): FabCardDefinitionInput & { readonly canonicalId: string } {
  const canonicalId = trainerId(opts.slug);
  return {
    canonicalId,
    types: ["Generic", "Resource"],
    pitch: opts.pitch ?? 3,
    color: "Blue",
    keywords: opts.keywords ?? [],
    abilities: [
      {
        id: `${canonicalId}-pitch`,
        kind: "static",
        staticKind: "triggered",
        text: "When you pitch this, resolve effect.",
        trigger: {
          kind: "event",
          event: {
            name: "pitch",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "pitched-card" },
          },
        },
        condition: opts.condition,
        resolution: { kind: "effect", effect: opts.effect },
      },
    ],
  };
}

/** Attack that fires an effect when it attacks (intimidate etc.). */
export function attackTriggerTrainer(opts: {
  slug: string;
  effect: FabEffect;
  keywords?: FabCardDefinitionInput["keywords"];
  power?: number;
  cost?: number;
  label?: FabLabelName;
}): FabCardDefinitionInput & { readonly canonicalId: string } {
  const canonicalId = trainerId(opts.slug);
  return {
    canonicalId,
    types: ["Generic", "Action", "Attack"],
    cost: opts.cost ?? 0,
    power: opts.power ?? 4,
    defense: 2,
    keywords: opts.keywords ?? [],
    abilities: [
      {
        id: `${canonicalId}-attack`,
        kind: "static",
        staticKind: "triggered",
        text: "When this attacks, resolve effect.",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "source", selector: "attack" },
          },
        },
        resolution: { kind: "effect", effect: opts.effect },
        ...(opts.label ? { label: { name: opts.label } } : {}),
      },
    ],
  };
}
