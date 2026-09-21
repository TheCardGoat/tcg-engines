import type { FabAmount, FabCardFilter, FabCost } from "@tcg/flesh-and-blood-types";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabObjectRef } from "../continuous/ir.ts";
import type { FabRulesView } from "../rules-view.ts";
import { validateFusionDeclaration } from "../../procedures/play-card/fuse.ts";
import {
  isChargePlayCost,
  isOptionalBanishGraveyardPlayCost,
} from "../../procedures/play-card/effect-costs.ts";
import { evaluatedObject, shortId, type FabLegalCommand } from "./shared.ts";

type FabFusionCommandDeclaration =
  | { readonly fuse?: undefined; readonly fuseInstanceIds?: undefined }
  | { readonly fuse: true; readonly fuseInstanceIds: readonly string[] };

interface FabOptionalCostCommandDeclaration {
  readonly payload: Readonly<Record<string, unknown>>;
  readonly labels: readonly string[];
}

/** Enumerate only Fusion reveal sets the authoritative play procedure accepts. */
function legalFusionDeclarations(
  state: FabRulesSnapshot,
  actorId: string,
  instanceId: string,
  object: FabObjectRef,
): readonly FabFusionCommandDeclaration[] {
  const record = state.objects[instanceId];
  const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
  const fusion = definition?.base.keywords.find((keyword) => keyword.name === "fusion");
  if (!fusion || fusion.name !== "fusion") return [{}];

  const candidates = state.containers.zonesByPlayerId[actorId]!.hand.filter(
    (candidateId) => candidateId !== instanceId,
  );
  const declarations: FabFusionCommandDeclaration[] = [{}];
  const selected: string[] = [];
  const visit = (start: number) => {
    if (selected.length > 0 && validateFusionDeclaration(state, actorId, object, selected).valid) {
      declarations.push({ fuse: true, fuseInstanceIds: [...selected] });
    }
    if (selected.length === fusion.supertypes.length) return;
    for (let index = start; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      if (!candidate) continue;
      selected.push(candidate);
      visit(index + 1);
      selected.pop();
    }
  };
  visit(0);
  return declarations;
}

function fusionLabel(
  state: FabRulesSnapshot,
  view: FabRulesView,
  declaration: FabFusionCommandDeclaration,
): string | null {
  if (!declaration.fuseInstanceIds) return null;
  const names = declaration.fuseInstanceIds.map((instanceId) => {
    const record = state.objects[instanceId];
    return record ? evaluatedName(state, view, instanceId) : shortId(instanceId);
  });
  return `Fusion (reveal ${names.join(", ")})`;
}

function evaluatedName(state: FabRulesSnapshot, view: FabRulesView, instanceId: string): string {
  return (
    evaluatedObject(state, view, instanceId)?.current.names.join(" // ") || shortId(instanceId)
  );
}

function optionalCostLabel(cost: FabCost): string {
  if (cost.class === "asset" && cost.type === "resources") {
    return typeof cost.amount === "number"
      ? `Pay ${cost.amount} resource${cost.amount === 1 ? "" : "s"}`
      : "Pay the optional resource cost";
  }
  if (cost.class === "effect" && cost.type === "banish") {
    const count = typeof cost.count === "number" ? cost.count : 1;
    return `Banish ${count} card${count === 1 ? "" : "s"} from ${cost.from}`;
  }
  if (cost.class === "effect" && cost.type === "destroy") return "Pay the optional destroy cost";
  return "Pay the optional additional cost";
}

function genericOptionalCostIsSupported(cost: FabCost): boolean {
  return (
    (cost.class === "asset" && cost.type === "resources") ||
    (cost.class === "effect" &&
      (cost.type === "destroy" ||
        cost.type === "move-to-deck" ||
        cost.type === "reveal" ||
        cost.type === "discard" ||
        (cost.type === "banish" && cost.from === "hand")))
  );
}

function genericOptionalCostIsPayable(
  state: FabRulesSnapshot,
  view: FabRulesView,
  actorId: string,
  playedInstanceId: string,
  source: FabObjectRef,
  cost: FabCost,
  baseResourceCost: number,
): boolean {
  if (cost.class === "asset" && cost.type === "resources") {
    if (typeof cost.amount !== "number") return true;
    const player = state.players[actorId];
    if (!player) return false;
    const pitchAvailable = state.containers.zonesByPlayerId[actorId]!.hand.reduce(
      (total, candidateId) => {
        if (candidateId === playedInstanceId) return total;
        return total + (evaluatedObject(state, view, candidateId)?.current.numeric.pitch ?? 0);
      },
      0,
    );
    return (
      player.resourcePoints + player.chiPoints + pitchAvailable >= baseResourceCost + cost.amount
    );
  }
  if (cost.class !== "effect") return false;

  const filter = "filter" in cost ? cost.filter : undefined;
  const matches = (candidateId: string) => {
    const candidate = evaluatedObject(state, view, candidateId);
    return Boolean(
      candidate &&
      (!filter ||
        view.matchesFilter(candidate, filter, {
          controllerId: actorId,
          source,
          subject: candidate.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        })),
    );
  };
  const zones = state.containers.zonesByPlayerId[actorId]!;

  if (cost.type === "destroy") {
    const available = zones.arena.filter(matches).length;
    if (typeof cost.count === "number") return available >= cost.count;
    return available > 0;
  }
  if (
    cost.type === "move-to-deck" ||
    cost.type === "reveal" ||
    cost.type === "discard" ||
    (cost.type === "banish" && cost.from === "hand")
  ) {
    const available = zones.hand.filter(
      (candidateId) => candidateId !== playedInstanceId && matches(candidateId),
    ).length;
    const count = "count" in cost && typeof cost.count === "number" ? cost.count : 1;
    return available >= count;
  }
  return false;
}

function optionalCostDeclarationGroups(
  state: FabRulesSnapshot,
  view: FabRulesView,
  actorId: string,
  instanceId: string,
  object: NonNullable<ReturnType<FabRulesView["object"]>>,
  baseResourceCost: number,
): readonly (readonly FabOptionalCostCommandDeclaration[])[] {
  const zones = state.containers.zonesByPlayerId[actorId]!;
  const groups: FabOptionalCostCommandDeclaration[][] = [];
  const addGroup = (choices: readonly FabOptionalCostCommandDeclaration[]) => {
    if (choices.length > 0) groups.push([{ payload: {}, labels: [] }, ...choices]);
  };

  if (
    object.current.keywords.some((keyword) => keyword.name === "boost") &&
    zones.deck.length > 0
  ) {
    addGroup([{ payload: { boost: true }, labels: ["Boost"] }]);
  }

  if (object.current.keywords.some((keyword) => keyword.name === "scrap")) {
    addGroup(
      zones.graveyard.flatMap((candidateId) => {
        const candidate = evaluatedObject(state, view, candidateId);
        const types = candidate?.current.typeBox.types ?? [];
        const subtypes = candidate?.current.typeBox.subtypes ?? [];
        return types.includes("Equipment") || subtypes.includes("Item")
          ? [
              {
                payload: { scrap: true, scrapInstanceId: candidateId },
                labels: [`Scrap ${evaluatedName(state, view, candidateId)}`],
              },
            ]
          : [];
      }),
    );
  }

  if (object.current.keywords.some((keyword) => keyword.name === "beat-chest")) {
    addGroup(
      zones.hand.flatMap((candidateId) => {
        if (candidateId === instanceId) return [];
        const candidate = evaluatedObject(state, view, candidateId);
        return (candidate?.current.numeric.power ?? 0) >= 6
          ? [
              {
                payload: { beatChest: true, beatChestInstanceId: candidateId },
                labels: [`Beat Chest with ${evaluatedName(state, view, candidateId)}`],
              },
            ]
          : [];
      }),
    );
  }

  const fusionChoices = legalFusionDeclarations(state, actorId, instanceId, object.ref).flatMap(
    (declaration) => {
      const label = fusionLabel(state, view, declaration);
      return label ? [{ payload: declaration, labels: [label] }] : [];
    },
  );
  addGroup(fusionChoices);

  const optionalPlayEffects = object.current.abilities.flatMap((ability) =>
    ability.kind === "static" &&
    ability.playEffect?.role === "additional-cost" &&
    ability.playEffect.optional === true &&
    ability.playEffect.cost
      ? [ability.playEffect.cost]
      : [],
  );

  const genericOptionalCosts = object.current.abilities
    .flatMap((ability) => {
      if (
        ability.kind === "static" &&
        ability.playEffect?.role === "additional-cost" &&
        ability.playEffect.optional === true &&
        ability.playEffect.cost
      ) {
        return [{ abilityId: ability.id, cost: ability.playEffect.cost }];
      }
      if (ability.kind === "modal" && ability.additionalCost?.optional === true) {
        return [{ abilityId: ability.id, cost: ability.additionalCost }];
      }
      return [];
    })
    .filter(
      (spec) =>
        genericOptionalCostIsSupported(spec.cost) &&
        !isChargePlayCost(spec.cost) &&
        !isOptionalBanishGraveyardPlayCost(spec.cost, true),
    );
  if (genericOptionalCosts.length > 0) {
    for (const spec of genericOptionalCosts) {
      const declarations: FabOptionalCostCommandDeclaration[] = [
        {
          payload: { declaredOptionalCostAbilityIds: [spec.abilityId] },
          labels: [],
        },
      ];
      if (
        genericOptionalCostIsPayable(
          state,
          view,
          actorId,
          instanceId,
          object.ref,
          spec.cost,
          baseResourceCost,
        )
      ) {
        declarations.push({
          payload: {
            declaredOptionalCostAbilityIds: [spec.abilityId],
            paidOptionalCostAbilityIds: [spec.abilityId],
          },
          labels: [optionalCostLabel(spec.cost)],
        });
      }
      groups.push(declarations);
    }
  }
  if (optionalPlayEffects.some((cost) => cost.class === "effect" && cost.type === "charge")) {
    addGroup(
      zones.hand.flatMap((candidateId) =>
        candidateId === instanceId
          ? []
          : [
              {
                payload: { chargeInstanceId: candidateId },
                labels: [`Charge ${evaluatedName(state, view, candidateId)}`],
              },
            ],
      ),
    );
  }

  for (const cost of optionalPlayEffects) {
    if (
      cost.class !== "effect" ||
      cost.type !== "banish" ||
      cost.from !== "graveyard" ||
      cost.count !== 1
    ) {
      continue;
    }
    addGroup(
      zones.graveyard.flatMap((candidateId) => {
        const candidate = evaluatedObject(state, view, candidateId);
        if (!candidate) return [];
        const matches =
          !cost.filter ||
          view.matchesFilter(candidate, cost.filter, {
            controllerId: actorId,
            source: object.ref,
            subject: candidate.ref,
            bindings: { objects: {}, numbers: {}, strings: {} },
          });
        return matches
          ? [
              {
                payload: { banishCostInstanceId: candidateId },
                labels: [`Banish ${evaluatedName(state, view, candidateId)}`],
              },
            ]
          : [];
      }),
    );
  }

  return groups;
}

function combineOptionalCostDeclarations(
  groups: readonly (readonly FabOptionalCostCommandDeclaration[])[],
): readonly FabOptionalCostCommandDeclaration[] {
  return groups.reduce<readonly FabOptionalCostCommandDeclaration[]>(
    (combined, group) =>
      combined.flatMap((base) =>
        group.map((choice) => {
          const declaredOptionalCostAbilityIds = [
            ...(Array.isArray(base.payload.declaredOptionalCostAbilityIds)
              ? base.payload.declaredOptionalCostAbilityIds.filter(
                  (abilityId): abilityId is string => typeof abilityId === "string",
                )
              : []),
            ...(Array.isArray(choice.payload.declaredOptionalCostAbilityIds)
              ? choice.payload.declaredOptionalCostAbilityIds.filter(
                  (abilityId): abilityId is string => typeof abilityId === "string",
                )
              : []),
          ];
          const paidOptionalCostAbilityIds = [
            ...(Array.isArray(base.payload.paidOptionalCostAbilityIds)
              ? base.payload.paidOptionalCostAbilityIds.filter(
                  (abilityId): abilityId is string => typeof abilityId === "string",
                )
              : []),
            ...(Array.isArray(choice.payload.paidOptionalCostAbilityIds)
              ? choice.payload.paidOptionalCostAbilityIds.filter(
                  (abilityId): abilityId is string => typeof abilityId === "string",
                )
              : []),
          ];
          return {
            payload: {
              ...base.payload,
              ...choice.payload,
              ...(declaredOptionalCostAbilityIds.length > 0
                ? { declaredOptionalCostAbilityIds }
                : {}),
              ...(paidOptionalCostAbilityIds.length > 0 ? { paidOptionalCostAbilityIds } : {}),
            },
            labels: [...base.labels, ...choice.labels],
          };
        }),
      ),
    [{ payload: {}, labels: [] }],
  );
}

/**
 * Instantiates every legal begin-play command for this seat: candidate cards
 * across own and permission-gated zones, split-card declarations, play
 * permissions, payable optional additional costs, and attack targets.
 */
export function instantiateBeginPlayLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly view: FabRulesView;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, view, actorId, push } = context;
  // Own zones always. Permission-gated origins also scan other seats so
  // grants like Nuu ("play blue from that hero's banished") are enumerated;
  // quotePlay still denies without a matching continuous play permission.
  const otherPlayers = state.playerIds.filter((id) => id !== actorId);
  const candidates = [
    ...state.containers.zonesByPlayerId[actorId]!.hand.map((id) => ({
      id,
      from: "hand" as const,
    })),
    ...state.containers.zonesByPlayerId[actorId]!.arsenal.map((id) => ({
      id,
      from: "arsenal" as const,
    })),
    ...state.containers.zonesByPlayerId[actorId]!.banished.map((id) => ({
      id,
      from: "banished" as const,
    })),
    // Permission-gated (Gravy watery-grave, etc.) — quotePlay denies without CE.
    ...state.containers.zonesByPlayerId[actorId]!.graveyard.map((id) => ({
      id,
      from: "graveyard" as const,
    })),
    ...otherPlayers.flatMap((otherId) => {
      const other = state.players[otherId];
      if (!other) return [];
      return [
        ...state.containers.zonesByPlayerId[otherId]!.banished.map((id) => ({
          id,
          from: "banished" as const,
        })),
        ...state.containers.zonesByPlayerId[otherId]!.graveyard.map((id) => ({
          id,
          from: "graveyard" as const,
        })),
        ...state.containers.zonesByPlayerId[otherId]!.deck.map((id) => ({
          id,
          from: "deck" as const,
        })),
      ];
    }),
  ];
  for (const { id: instanceId, from } of candidates) {
    const record = state.objects[instanceId];
    const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
    const declarations: readonly {
      readonly playMethod?: import("../../cards.ts").FabSplitPlayMethod;
    }[] =
      definition?.layout?.kind === "split"
        ? [
            { playMethod: { kind: "face", face: "left" } },
            { playMethod: { kind: "face", face: "right" } },
            ...(definition.layout.faces.some((face) =>
              face.keywords.some((keyword) => keyword.name === "meld"),
            )
              ? [{ playMethod: { kind: "meld" as const } }]
              : []),
          ]
        : [{}];
    for (const declaration of declarations) {
      const discovery = view.quotePlay({ actorId, instanceId, from, ...declaration });
      for (const permission of discovery.playPermissionOptions) {
        const quote = view.quotePlay({
          actorId,
          instanceId,
          from,
          playPermissionId: permission.id,
          ...declaration,
        });
        if (!quote.allowed) continue;
        const object = quote.object ? view.object(quote.object) : null;
        const name =
          quote.splitBase?.names.join(" // ") ||
          object?.current.names.join(" // ") ||
          shortId(instanceId);
        // CR 5.1.3b / 5.4.4a: every payable optional additional cost is a
        // distinct declaration made while playing the card. Exposing the
        // authoritative variants here lets every client present the same
        // pay/decline choices without deriving rules from card text.
        const optionalCostDeclarations = object
          ? combineOptionalCostDeclarations(
              optionalCostDeclarationGroups(
                state,
                view,
                actorId,
                instanceId,
                object,
                quote.resourceCost ?? 0,
              ),
            )
          : [{ payload: {}, labels: [] }];
        const basePayload: Record<string, unknown> = {
          instanceId,
          ...(from === "hand" ? {} : { from }),
          playPermissionId: permission.id,
          ...declaration,
        };
        const permissionLabel =
          discovery.playPermissionOptions.length > 1
            ? permission.kind === "base"
              ? " normally"
              : quote.timing === "instant"
                ? " as an instant"
                : " using its play permission"
            : "";
        for (const optionalCostDeclaration of optionalCostDeclarations) {
          const additionalCostLabel = optionalCostDeclaration.labels.length
            ? ` with ${optionalCostDeclaration.labels.join(" and ")}`
            : "";
          if (quote.isAttack) {
            const targets = view.quoteAttackTargets({
              actorId,
              attackInstanceId: instanceId,
            });
            for (const target of targets.candidates) {
              const targetedQuote = view.quotePlay({
                actorId,
                instanceId,
                from,
                attackTargetId: target.targetId,
                playPermissionId: permission.id,
                ...declaration,
              });
              if (!targetedQuote.allowed) continue;
              push({
                move: "begin-play",
                payload: {
                  ...basePayload,
                  ...optionalCostDeclaration.payload,
                  target: target.targetId,
                },
                label: `Play ${name}${permissionLabel}${additionalCostLabel} → ${target.label}`,
                sourceInstanceId: instanceId,
                ...(targetedQuote.timing === "instant" && record
                  ? {
                      priorityYield: {
                        kind: "instant-use" as const,
                        canonicalId: record.canonicalId,
                      },
                    }
                  : {}),
              });
            }
          } else {
            push({
              move: "begin-play",
              payload: { ...basePayload, ...optionalCostDeclaration.payload },
              label: `Play ${name}${permissionLabel}${additionalCostLabel}`,
              sourceInstanceId: instanceId,
              ...(quote.timing === "instant" && record
                ? {
                    priorityYield: {
                      kind: "instant-use" as const,
                      canonicalId: record.canonicalId,
                    },
                  }
                : {}),
            });
          }
        }
      }
    }
  }
}
