import { structuredCards } from "../../../../../../cyberpunk/packages/cards/src/index.ts";
import { getAbilityHints } from "../../../../../../cyberpunk/packages/engine/src/view/ability-hints.ts";
import {
  createPlayerId,
  createCardInstanceId,
} from "../../../../../../cyberpunk/packages/engine/src/types/branded.ts";
import type { PlayerId } from "../../../../../../cyberpunk/packages/engine/src/types/branded.ts";
import type { EngineHandle } from "../../../../../../cyberpunk/packages/engine/src/automation/types.ts";
import type { CommandEnvelope } from "../../../../../../cyberpunk/packages/engine/src/types/commands.ts";
import type {
  FilteredCardView,
  FilteredMatchView,
  FilteredPlayerView,
} from "../../../../../../cyberpunk/packages/engine/src/view/filter.ts";
import type { PlayerPrompt } from "../../../../../../cyberpunk/packages/engine/src/view/player-prompt.ts";
import type { CardZone } from "../../../../../../cyberpunk/packages/types/src/index.ts";
import { stableBotHash } from "@tcg/bot-core";
import { combatContext, nativeProjection } from "./projection.ts";
import type {
  NativeAction,
  NativeDie,
  NativeState,
  NativeStepResult,
  ReferenceRuntime,
  Seat,
} from "./runtime.ts";

export const playerId = (seat: Seat) => createPlayerId(`p${seat}`);
export function seatFor(id: PlayerId): Seat {
  if (id === "p1") return 1;
  if (id === "p2") return 2;
  throw new Error(`Unknown reference seat ${id}`);
}

/** Exact ids first, then an unambiguous exact printed name; never fuzzy matching. */
export function matchCatalog(runtime: ReferenceRuntime) {
  const ownById = new Map<string, (typeof structuredCards)[number]>();
  for (const card of structuredCards) {
    ownById.set(card.id, card);
    for (const printing of card.printings ?? []) ownById.set(printing.id, card);
  }
  const nativeToOwn = new Map<string, (typeof structuredCards)[number]>();
  const mismatches: string[] = [];
  const ownToNative = new Map<string, string>();
  for (const card of Object.values(runtime.catalog)) {
    const byName = structuredCards.filter(
      (own) => (own.displayName ?? own.name) === card.displayName,
    );
    const own = ownById.get(card.externalId) ?? (byName.length === 1 ? byName[0] : undefined);
    if (!own) continue;
    if (
      own.type !== card.cardType.toLowerCase() ||
      (own.cost ?? null) !== card.cost ||
      (own.power ?? null) !== card.power ||
      (own.ram ?? 0) !== card.ram ||
      own.hasSellTag !== card.isEddiable
    ) {
      mismatches.push(card.id);
      continue;
    }
    nativeToOwn.set(card.id, own);
    ownToNative.set(own.id, card.id);
    ownToNative.set(own.slug, card.id);
  }
  return { nativeToOwn, ownToNative, mismatches };
}
export type CatalogJoin = ReturnType<typeof matchCatalog>;

function emptyCard(
  id: string,
  definitionId: string,
  zone: FilteredCardView["zone"],
): FilteredCardView {
  return {
    instanceId: id,
    definitionId,
    cardName: null,
    zone,
    faceDown: false,
    spent: false,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost: null,
    effectiveCost: null,
    costEffects: [],
    activeEffects: [],
    type: null,
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    hasStolenGigThisTurn: false,
    grantedRules: [],
    keywords: [],
    triggerHints: [],
    abilityHints: [],
  };
}
export function semanticNativeHash(state: NativeState): string {
  return stableBotHash(
    JSON.parse(
      JSON.stringify(state, (key, value) =>
        ["stateVersion", "eventSeq"].includes(key) ? undefined : value,
      ),
    ),
  );
}

interface ProjectionHistory {
  attacked: readonly string[];
  stolen: readonly string[];
  previousEmptyFixer: boolean;
  currentEmptyFixer: boolean;
  redirectedTargets: readonly (string | null)[];
}

/** Lab-only facade. Both bots transition the ORIGINAL reference engine. */
export class NativeEngine implements EngineHandle {
  constructor(
    public state: NativeState,
    readonly runtime: ReferenceRuntime,
    readonly join: CatalogJoin,
    private history: ProjectionHistory = {
      attacked: [],
      stolen: [],
      previousEmptyFixer: false,
      currentEmptyFixer:
        state.turnNumber > 0 && state.players[state.currentPlayer].fixerDice.length === 0,
      redirectedTargets: [],
    },
  ) {}
  fork(): NativeEngine {
    return new NativeEngine(this.state, this.runtime, this.join, this.history);
  }
  getPrompt(id: PlayerId): PlayerPrompt {
    const seat = seatFor(id);
    if (this.runtime.api.actor(this.state) === null)
      return { status: "idle", availableMoves: [], choice: null };
    if (this.runtime.api.actor(this.state) !== seat)
      return { status: "waiting", availableMoves: [], choice: null };
    const actions = this.runtime.api.actions(this.state, this.runtime.cards, seat);
    if (this.state.status === "mulligan") {
      return {
        status: "action",
        choice: null,
        availableMoves: [
          { moveId: "keepHand", inputSpec: { type: "none" } },
          { moveId: "mulligan", inputSpec: { type: "none" } },
        ],
      };
    }
    // Preserve every native legal action and its ordering. Pending native
    // choices are opaque choices to our search: no branch or target is dropped.
    return {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseEffect",
        chooserId: id,
        payload: {
          options: actions.map((action) => ({
            id: JSON.stringify(action),
            label: action.type,
            effects: [],
          })),
        },
      },
    };
  }
  actionFor(command: CommandEnvelope, id: PlayerId): NativeAction | undefined {
    const actions = this.runtime.api.actions(this.state, this.runtime.cards, seatFor(id));
    if (command.move === "keepHand" || command.move === "mulligan") {
      return actions.find(
        (action) => action.type === "MULLIGAN" && action.keep === (command.move === "keepHand"),
      );
    }
    const args = command.input?.args;
    if (
      command.move !== "resolveChooseEffect" ||
      typeof args !== "object" ||
      args === null ||
      !("optionId" in args)
    )
      return undefined;
    return actions.find((action) => JSON.stringify(action) === args.optionId);
  }
  processCommand(command: CommandEnvelope, id: PlayerId): { success: boolean } {
    if (this.runtime.api.actor(this.state) !== seatFor(id)) return { success: false };
    const action = this.actionFor(command, id);
    if (!action) return { success: false };
    const result = this.applyNativeAction(action);
    if (result.error) return { success: false };
    return { success: true };
  }
  applyNativeAction(action: NativeAction): NativeStepResult {
    const before = this.state;
    const result = this.runtime.api.step(before, action, this.runtime.cards);
    if (result.error) return result;
    const next = result.state;
    let history = this.history;
    if (next.turnNumber !== before.turnNumber) {
      history = {
        attacked: [],
        stolen: [],
        previousEmptyFixer: before.turnNumber > 0 && history.currentEmptyFixer,
        currentEmptyFixer: next.players[next.currentPlayer].fixerDice.length === 0,
        redirectedTargets: [],
      };
    }
    for (const event of result.events) {
      if (event.turnNumber !== next.turnNumber) continue;
      const data = event.data;
      if (event.type === "ATTACK_DECLARED" && typeof data?.attackerId === "string")
        history = {
          ...history,
          attacked: [...new Set([...history.attacked, data.attackerId])],
          redirectedTargets: [],
        };
      if (
        event.type === "GIG_STOLEN" &&
        typeof data?.thiefId === "string" &&
        typeof data.stolen === "number" &&
        data.stolen > 0
      )
        history = { ...history, stolen: [...new Set([...history.stolen, data.thiefId])] };
      if (event.type === "BLOCK")
        history = {
          ...history,
          redirectedTargets: [
            ...history.redirectedTargets,
            typeof data?.redirectedFromId === "string" ? data.redirectedFromId : null,
          ],
        };
    }
    this.history = {
      ...history,
      redirectedTargets: next.pendingCombat ? history.redirectedTargets : [],
    };
    this.state = next;
    return result;
  }
  getFilteredView(id: PlayerId): FilteredMatchView {
    return this.project(id, false);
  }
  getOracleView(id: PlayerId): FilteredMatchView {
    // Full native state participates in cycle detection, including pending
    // queues/modifiers which do not have equivalents in our view model.
    return Object.assign(this.project(id, true), {
      nativeStateHash: stableBotHash({
        native: semanticNativeHash(this.state),
        history: this.history,
      }),
    });
  }
  private project(id: PlayerId, oracle: boolean): FilteredMatchView {
    const state = this.state;
    const projection = nativeProjection(this.runtime, state, seatFor(id), oracle);
    const players: Record<string, FilteredPlayerView> = {};
    const playedCardTypesThisTurn: FilteredMatchView["playedCardTypesThisTurn"] = {};
    for (const seat of [1, 2] as const) {
      const player = state.players[seat];
      const owner = playerId(seat) === id;
      const zones: FilteredPlayerView["zones"] = {};
      const card = (instanceId: string, zone: CardZone): FilteredCardView => {
        const instance = state.instances[instanceId];
        if (!instance) throw new Error(`Missing native card instance ${instanceId}`);
        const definition = this.join.nativeToOwn.get(instance.definitionId);
        if (!definition) throw new Error(`Missing own card metadata for ${instance.definitionId}`);
        const visible = oracle || this.runtime.api.visible(state, instanceId, seatFor(id));
        const view = emptyCard(instanceId, visible ? definition.id : "", zone);
        view.faceDown = instance.faceDown;
        view.revealed = visible && instance.faceDown;
        view.spent = instance.spent;
        view.damage = instance.damage;
        if (visible) {
          view.hasLag = instance.hasLag;
          view.hasAttackedThisTurn = this.history.attacked.includes(instanceId);
          view.hasStolenGigThisTurn = this.history.stolen.includes(instanceId);
          view.attachedGearIds = [...instance.attachedGearIds];
          view.attachedToId =
            Object.values(state.instances).find((host) => host.attachedGearIds.includes(instanceId))
              ?.instanceId ?? null;
          view.cardName = definition.displayName ?? definition.name;
          view.color = definition.color;
          view.type = zone === "field" && definition.type === "legend" ? "unit" : definition.type;
          view.classifications = [...definition.classifications];
          view.hasSellTag = definition.hasSellTag;
          view.cost = definition.cost ?? null;
          const keywords = this.runtime.api.keywords(state, this.runtime.cards, instanceId);
          view.effectiveCost =
            zone === "legendArea" && keywords.includes("GoSolo")
              ? this.runtime.api.goSoloCost(state, this.runtime.cards, instanceId, seat)
              : this.runtime.api.cost(state, this.runtime.cards, instanceId, seat);
          view.power = definition.power ?? 0;
          view.effectivePower = this.runtime.api.power(
            state,
            this.runtime.cards,
            instanceId,
            combatContext(state, instanceId),
          );
          view.activeEffects = projection.cardEffects(instanceId);
          view.grantedRules = projection.grantedRules(instanceId, view.activeEffects);
          view.costEffects = projection.costEffects(instanceId, view.cost, view.effectiveCost);
          view.keywords = keywords.map((keyword) => {
            if (keyword === "GoSolo") return "goSolo";
            return keyword.toLowerCase();
          });
          view.abilityHints = getAbilityHints(definition);
          view.triggerHints = [
            ...new Set(view.abilityHints.map((hint) => hint.event ?? hint.timing)),
          ];
        }
        return view;
      };
      for (const [native, zone] of [
        ["deck", "deck"],
        ["hand", "hand"],
        ["field", "field"],
        ["legends", "legendArea"],
        ["eddies", "eddieArea"],
        ["trash", "trash"],
        ["removed", "removedFromGame"],
      ] as const) {
        const ids = player[native];
        const projected = ids.flatMap((cardId) => {
          const host = card(cardId, zone);
          // Our field view includes attachments, so our evaluator sees Gear.
          return zone === "field" || zone === "legendArea"
            ? [host, ...host.attachedGearIds.map((gearId) => card(gearId, zone))]
            : [host];
        });
        zones[zone] =
          !oracle && (zone === "deck" || (zone === "hand" && !owner)) ? ids.length : projected;
      }
      const die = (item: NativeDie, zone: "gigArea" | "fixerArea") => ({
        ...emptyCard(item.id, `d${item.sides}`, zone),
        power: item.value ?? 0,
        effectivePower: item.value ?? 0,
      });
      zones.gigArea = player.gigDice.map((item) => die(item, "gigArea"));
      zones.fixerArea = player.fixerDice.map((item) => die(item, "fixerArea"));
      players[playerId(seat)] = {
        firstPlayer: state.firstPlayer === seat,
        zones,
        eddies: player.eddies.length,
        availableEddies: this.runtime.api.availableEddies(state, seat, this.runtime.cards).length,
        soldThisTurn: player.hasSoldThisTurn,
        calledLegendThisTurn: seat === state.currentPlayer && player.hasCalledLegendThisTurn,
        calledLegendThisRivalTurn: seat !== state.currentPlayer && player.hasCalledLegendThisTurn,
        gigCount: player.gigDice.length,
        fixerCount: player.fixerDice.length,
        streetCred: player.gigDice.reduce((sum, item) => sum + (item.value ?? 0), 0),
        activeEffects: projection.playerEffects(seat),
      };
      playedCardTypesThisTurn[playerId(seat)] =
        player.cardsPlayedThisTurn?.turnNumber === state.turnNumber
          ? player.cardsPlayedThisTurn.instanceIds.flatMap((cardId) => {
              const instance = state.instances[cardId];
              const definition = instance && this.join.nativeToOwn.get(instance.definitionId);
              return definition ? [definition.type] : [];
            })
          : [];
    }
    return {
      players,
      gamePhase:
        state.status === "playing" || state.status === "overtime" ? state.turnPhase : "setup",
      turnNumber: state.turnNumber,
      activePlayerId: playerId(state.currentPlayer),
      overtimeActive: state.status === "overtime",
      previousTurnBeganWithEmptyFixer: this.history.previousEmptyFixer,
      turnBeganWithEmptyFixer: this.history.currentEmptyFixer,
      playedCardTypesThisTurn,
      attackState: state.pendingCombat
        ? {
            attackerId: createCardInstanceId(state.pendingCombat.attackerId),
            defenderId:
              state.pendingCombat.target.kind === "unit"
                ? createCardInstanceId(state.pendingCombat.target.instanceId)
                : null,
            rivalId: playerId(state.pendingCombat.attackerController === 1 ? 2 : 1),
            kind: state.pendingCombat.target.kind === "unit" ? "fight" : "direct",
            step:
              state.pendingCombat.phase === "reacted" || state.pendingCombat.blocked
                ? state.pendingCombat.target.kind === "unit"
                  ? "fight"
                  : "steal"
                : state.pendingPrompt?.source === "__combat__"
                  ? "react"
                  : "attack",
            redirectedByBlocker: state.pendingCombat.blocked,
            redirectedTargets: this.history.redirectedTargets.map((target) =>
              target === null ? null : createCardInstanceId(target),
            ),
            ...(state.pendingCombat.target.kind === "gig"
              ? {
                  gigsToSteal: this.runtime.api.stealCount(
                    state,
                    this.runtime.cards,
                    state.pendingCombat.attackerId,
                  ),
                }
              : {}),
          }
        : null,
      gameEnded: state.status === "finished",
      winnerId: state.winner ? playerId(state.winner) : null,
      winReason: state.status === "finished" ? "native-win" : null,
      stateID: state.stateVersion,
      prompt: this.getPrompt(id),
    };
  }
}
