// Engine is meant to be a singleton class that manages the simulation of the game.
// It encapsulates the game state and the game logic, Exposing a simple API to interact with the game.

import { notEmptyPredicate } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { calculateDiff } from "@lorcanito/lorcana-engine/lib/deltaCompression";
import { logDiff } from "@lorcanito/lorcana-engine/lib/differ";
import { exhaustiveCheck } from "@lorcanito/lorcana-engine/lib/exhaustiveCheck";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type {
  MatchMove,
  MoveResponse,
} from "@lorcanito/lorcana-engine/store/types";
import type { LogEntry } from "@lorcanito/lorcana-engine/types/Log";
import type { NotificationType } from "@lorcanito/lorcana-engine/types/Notification";
import type { Game, Match } from "@lorcanito/lorcana-engine/types/types";
import type { Diff } from "deep-diff";
import type { ActivatedAbility } from "./abilities/abilities";

export type OnSuccessParams = {
  match: Match;
  move: MatchMove;
  moveLogs: LogEntry[];
  moveNotifications: NotificationType[];
  moveDiff: Diff<Match, Match>[] | undefined;
  hashBefore: string;
  hashAfter: string;
};

const allowedMovesInOpponentTurn: MatchMove["type"][] = [
  "CHANGE_GAME_MODE",
  "CHOOSE_FIRST_PLAYER",
  "ALTER_HAND",
  "RESOLVE_LAYER",
  "SKIP_LAYER",
  "REQUEST",
  "ANSWER_PLAYER_REQUEST",
  "CANCEL_PLAYER_REQUEST",
  "PASS_TURN",
  "ACCEPT_OPTIONAL_LAYER",
  // "CONCEDE_MATCH",
  // "CONCEDE_GAME",
];

export class Engine {
  store: MobXRootStore;
  private cards: Game["cards"];
  private onSuccess: (params: OnSuccessParams) => Promise<unknown>;
  private canSendMove: () => boolean;

  constructor(params: {
    rootStore: MobXRootStore;
    cards: Game["cards"];
    onSuccess: (params: OnSuccessParams) => Promise<unknown>;
    canSendMove: () => boolean;
  }) {
    const { rootStore, cards, onSuccess, canSendMove } = params;

    this.store = rootStore;
    this.cards = cards;
    this.onSuccess = onSuccess;
    this.canSendMove = canSendMove;
  }

  updateOnSuccess(onSuccess: (params: OnSuccessParams) => Promise<unknown>) {
    this.onSuccess = onSuccess;
  }

  execute(move: MatchMove): MoveResponse {
    const store = this.store;
    store.effectStore.reEvaluateAbilities(store.hash);
    const hashBefore = store.hash;
    const beforeMove = store.toJSON();

    if (store.isSpectator) {
      // Calling it directly so it doesn't get batched into the store
      store.dependencies.notifier.sendNotification({
        type: "icon",
        title: `You can't make a move`,
        message: `You're spectating the game. You can't make moves.`,
        icon: "warning",
        autoClear: true,
      });

      return { success: false };
    }

    if (!this.canSendMove()) {
      store.dependencies.notifier.sendNotification({
        type: "icon",
        title: "Not ready to send a move",
        message:
          "You're not ready to send a move. Please wait for the game to be synced.",
        icon: "warning",
        autoClear: true,
      });
      return { success: false };
    }

    try {
      if (store.isLoading) {
        // Calling it directly so it doesn't get batched into the store
        store.dependencies.notifier.sendNotification({
          type: "icon",
          title: "Hold on, your game is syncing...",
          message: `Wait until the game is synced before making another move. We're working on improving this.`,
          icon: "warning",
          autoClear: true,
        });
        return { success: false };
      }

      if (
        store.pendingRequests?.length &&
        !["ANSWER_PLAYER_REQUEST", "CANCEL_PLAYER_REQUEST"].includes(move.type)
      ) {
        // Calling it directly so it doesn't get batched into the store
        store.dependencies.notifier.sendNotification({
          type: "icon",
          title: "You have pending requests",
          message: `If you're not able to see the request, please refresh the browser.`,
          icon: "warning",
          autoClear: true,
        });
      }

      // TODO: This should be part of the engine
      if (
        !store.matchHasStarted &&
        store.stateMachineStore.hasPlayerAlteredHand(store.activePlayer) &&
        !["CHOOSE_FIRST_PLAYER"].includes(move.type)
      ) {
        // Calling it directly so it doesn't get batched into the store
        store.dependencies.notifier.sendNotification({
          type: "icon",
          title: "Waiting for opponent to alter hand...",
          message: `You can't make moves until the opponent has altered their hand.`,
          icon: "warning",
          autoClear: true,
        });
        return { success: false };
      }

      if (store.matchHasEnded) {
        store.dependencies.notifier.sendNotification({
          type: "icon",
          title: "Game is over",
          message:
            "If there are more matches to be played, you can proceed to the next match.",
          icon: "warning",
          autoClear: true,
        });
        return { success: false };
      }

      if (
        store.stackLayerStore.layers.length > 0 &&
        ![
          "RESOLVE_LAYER",
          "SKIP_LAYER",
          "ACCEPT_OPTIONAL_LAYER",
          "CONCEDE_MATCH",
          "CONCEDE_GAME",
          "CHANGE_GAME_MODE",
          "UNDO",
          "UNDO_TURN",
          "ANSWER_PLAYER_REQUEST",
          "CANCEL_PLAYER_REQUEST",
          "DROP_PLAYER",
        ].includes(move.type)
      ) {
        // Calling it directly so it doesn't get batched into the store
        store.dependencies.notifier.sendNotification({
          type: "icon",
          title: "You must resolve the top of the stack first",
          message: `You can't make a move until you resolve the top of the stack.`,
          icon: "warning",
          autoClear: true,
        });
        return { success: false };
      }

      if (
        store.matchHasStarted &&
        store.priorityPlayer !== store.activePlayer &&
        !allowedMovesInOpponentTurn.includes(move.type)
      ) {
        // Calling it directly so it doesn't get batched into the store
        store.dependencies.notifier.sendNotification({
          type: "icon",
          title: `Cannot make a move, when you don't have priority`,
          message: `You tried to make a move when it is not your turn. If you're stuck, try refreshing the browser.`,
          icon: "warning",
          autoClear: true,
        });
        return { success: false };
      }

      store.flushResponse();

      const result = executeMove(move, store);

      if (!result.success) {
        console.warn("Invalid Move", JSON.stringify(result));
        store.sync(beforeMove);

        return store.sendNotification({
          type: "icon",
          title: `Invalid Move ${move.type}`,
          message:
            "If this message persist, undo your turn or refresh your browser.",
          icon: "warning",
          autoClear: true,
        });
      }

      if (result.success) {
        store.incrementMoveCount();
        store.gameStateCheck();
        const stateAfterMove = store.toJSON();
        const hashAfter = store.hash;

        move.number = store.moveCount;

        const diff = calculateDiff(beforeMove, stateAfterMove);
        if (process.env.NODE_ENV !== "test") {
          logDiff(diff, console, true);
        }

        if (process.env.NODE_ENV !== "test") {
          store.isLoading = true;
          this.onSuccess({
            match: stateAfterMove,
            move: move,
            moveLogs: result.logs || [],
            moveNotifications: result.notifications || [],
            moveDiff: diff,
            hashBefore,
            hashAfter,
          })
            .then(() => {
              store.isLoading = false;
            })
            .catch((e) => {
              console.error(e);
              store.sync(beforeMove);
              store.isLoading = false;
            });
        }
      }

      return result;
    } catch (e: any) {
      console.error(e);
      store.isLoading = false;
      store.sync(beforeMove);

      store.dependencies.notifier.sendNotification({
        type: "icon",
        icon: "error",
        title: "Error",
        message: e.message,
        autoClear: true,
      });

      return { success: false };
    } finally {
      store.flushResponse();
    }
  }
}

function convertIdsIntoNamesDuringTesting(
  move: MatchMove,
  rootStore: MobXRootStore,
): MatchMove {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    return move;
  }

  const moveClone = JSON.parse(JSON.stringify(move));

  if (moveClone.location) {
    moveClone.location = `[${moveClone.location}] ${rootStore.cardStore.getCard(moveClone.location)?.fullName}`;
  }

  if (moveClone.character) {
    moveClone.character = `[${moveClone.character}] ${rootStore.cardStore.getCard(moveClone.character)?.fullName}`;
  }

  if (moveClone.instanceId) {
    moveClone.instanceId = `[${moveClone.instanceId}] ${rootStore.cardStore.getCard(moveClone.instanceId)?.fullName}`;
  }

  if (moveClone.targets) {
    moveClone.targets = moveClone.targets.map(
      (target: any) =>
        `[${target}] ${rootStore.cardStore.getCard(target)?.fullName}`,
    );
  }

  return moveClone;
}

function executeMove(move: MatchMove, rootStore: MobXRootStore): MoveResponse {
  const activePlayer = rootStore.activePlayer;
  const turnPlayer = rootStore.turnPlayer;

  rootStore.trace(
    "Executing move",
    convertIdsIntoNamesDuringTesting(move, rootStore),
  );

  if (
    !rootStore.manualMode &&
    activePlayer !== turnPlayer &&
    !allowedMovesInOpponentTurn.includes(move.type)
  ) {
    // Calling it directly so it doesn't get batched into the store
    rootStore.dependencies.notifier.sendNotification({
      type: "icon",
      icon: "info",
      title: "Not your turn",
      message: "You can't make a move when it's not your turn",
      autoClear: true,
    });

    return { success: false };
  }

  switch (move.type) {
    case "PLAYER_JOINED":
      console.warn("NOT IMPLEMENTED", move);
      return { success: true };
    case "PLAYER_LEFT":
      console.warn("NOT IMPLEMENTED", move);
      return { success: true };
    case "DROP_PLAYER": {
      console.warn("NOT IMPLEMENTED", move);
      return { success: true };
    }
    case "CHOOSE_FIRST_PLAYER": {
      const { player } = move;

      if (rootStore.activePlayer !== rootStore.choosingFirstPlayer) {
        // Calling it directly so it doesn't get batched into the store
        rootStore.dependencies.notifier.sendNotification({
          type: "icon",
          icon: "info",
          title: "Not your turn",
          message: "You can't choose the first player",
          autoClear: true,
        });

        return { success: false };
      }

      if (rootStore.matchHasStarted) {
        // Calling it directly so it doesn't get batched into the store
        rootStore.dependencies.notifier.sendNotification({
          type: "icon",
          icon: "info",
          title: "Game has already started",
          message:
            "You can't choose the first player after the game has started",
          autoClear: true,
        });

        return { success: false };
      }

      return rootStore.chooseFirstPlayer(player);
    }

    case "REQUEST": {
      const { payload } = move;
      if (payload.type === "ENABLE_CHAT") {
        return rootStore.requestFreeTextChat(activePlayer);
      }

      if (payload.type === "CONCEDE_GAME") {
        return rootStore.requestConcedeGame();
      }

      break;
    }
    case "UNDO": {
      return rootStore.requestUndoMove(activePlayer, "");
    }
    case "UNDO_TURN": {
      return rootStore.requestUndoTurn(activePlayer, "");
    }
    case "UNDO_LAST_TURN": {
      return rootStore.sendNotification({
        type: "icon",
        icon: "info",
        title: "Not implemented",
        message: "Will be added in the future",
        autoClear: true,
      });
    }
    case "CONCEDE_MATCH": {
      return rootStore.sendNotification({
        type: "icon",
        icon: "info",
        title: "Not implemented",
        message: "Will be added in the future",
        autoClear: true,
      });
    }
    case "CONCEDE_GAME": {
      return rootStore.sendNotification({
        type: "icon",
        icon: "info",
        title: "Not implemented",
        message: "Will be added in the future",
        autoClear: true,
      });
    }
    case "SKIP_LAYER": {
      const { layerId, activePlayer } = move;
      return rootStore.skipLayer(layerId, activePlayer);
    }
    case "DRAW_CARD": {
      const { player } = move;
      return rootStore.drawCard(player);
    }
    case "REVEAL_CARD": {
      const { instanceId } = move;
      return rootStore.revealCard(instanceId);
    }
    case "UPDATE_LORE": {
      const { player, lore } = move;
      return rootStore.updatePlayerLore(player, lore);
    }
    case "SHUFFLE_DECK": {
      const { player } = move;
      return rootStore.shuffleDeck(player);
    }
    case "SCRY": {
      const { top, discard, hand, inkwell, play, bottom, playerId } = move;
      return rootStore.scryMove({
        playerId,
        top,
        bottom,
        hand,
        inkwell,
        discard,
        play,
      });
    }
    case "ACTIVATE_ABILITY": {
      const { instanceId, ability, costs } = move;
      return rootStore.activateCardAbility(instanceId, ability, {
        costs:
          costs
            ?.map((cost) => rootStore.cardStore.getCard(cost))
            .filter(notEmptyPredicate) || [],
      });
    }
    case "GENERATE_ON_DEMAND_LAYER": {
      const { instanceId, ability, costs } = move;

      return rootStore.generateLayerOnDemand(
        instanceId,
        ability as unknown as ActivatedAbility,
        {
          costs:
            costs
              ?.map((cost) => rootStore.cardStore.getCard(cost))
              .filter(notEmptyPredicate) || [],
        },
      );
    }
    case "UPDATE_CARD_DAMAGE": {
      const { instanceId, damage, operation } = move;
      return rootStore.updateCardDamage(instanceId, damage, operation);
    }
    case "QUEST": {
      const { instanceId } = move;
      return rootStore.questWithCard(instanceId);
    }
    case "QUEST_WITH_ALL": {
      const { playerId } = move;
      return rootStore.questWithAll(playerId);
    }
    case "TAP_CARD": {
      const { instanceId, exerted, toggle } = move;
      return rootStore.tapCard(instanceId, exerted, toggle);
    }
    case "MOVE_CARD": {
      const { instanceId, to, position } = move;
      return rootStore.moveCard(instanceId, to, position);
    }
    case "TUTOR_CARD": {
      const { instanceId } = move;
      return rootStore.tutorCard(instanceId);
    }
    case "ALTER_HAND": {
      const { player, cards } = move;
      // return rootStore.alterHand(cards, player);

      return rootStore.stateMachineStore.alterHand(player, cards);
    }

    case "ANSWER_PLAYER_REQUEST": {
      const { accepted } = move;
      return rootStore.answerPlayerRequest(activePlayer, accepted);
    }
    case "CANCEL_PLAYER_REQUEST": {
      const { cancelled } = move;

      return rootStore.cancelPlayerRequest(activePlayer, cancelled);
    }
    case "CHANGE_GAME_MODE": {
      if (move.manual) {
        return rootStore.requestManualMode(activePlayer, "");
      }

      return rootStore.setManualMode(move.manual);
    }
    case "PUT_CARD_INTO_INKWELL": {
      const { instanceId } = move;
      return rootStore.putCardIntoInkwell(instanceId);
    }
    // 1.5.1. Players can play a card whenever they’re the active player and there are no effects to resolve. To play a card, the player reveals
    // it from their hand and pays the cost (see 4.3.4).
    case "PLAY_CARD": {
      const { instanceId, bodyguard, alternativeCosts } = move;
      return rootStore.playCardFromHand(instanceId, {
        bodyguard,
        alternativeCosts,
      });
    }
    case "SHIFT": {
      const { shifter, shifted, costs } = move;
      return rootStore.shift(shifter, shifted, {
        costs,
      });
    }
    case "ENTER_LOCATION": {
      const { character, location } = move;
      return rootStore.enterLocation(character, location);
    }
    case "MOVE_TO_LOCATION": {
      const { character, location } = move;
      return rootStore.enterLocation(character, location, { forFree: true });
    }
    case "CHALLENGE": {
      const { attacker, defender } = move;
      return rootStore.challenge(attacker, defender);
    }
    case "SING": {
      const { song, singer } = move;
      return rootStore.sing(song, singer);
    }
    case "SING_TOGETHER": {
      const { song, singers } = move;
      return rootStore.singTogether(song, singers);
    }
    case "RESOLVE_LAYER": {
      if (move.skip) {
        return executeMove(
          { type: "SKIP_LAYER", layerId: move.layerId, activePlayer },
          rootStore,
        );
      }

      return rootStore.resolveTopOfStack(move, activePlayer);
    }
    case "ACCEPT_OPTIONAL_LAYER": {
      return rootStore.resolveTopOfStack({ layerId: move.layerId });
    }
    case "PASS_TURN": {
      const { player, forced } = move;
      return rootStore.passTurn(player, forced);
    }
    default: {
      exhaustiveCheck(move);
    }
  }

  return { success: false };
}
