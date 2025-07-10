import { expect } from "@jest/globals";
import type {
  CardModel,
  ResolvingParam,
  ScryEffectPayload,
  TableCard,
  Zones,
} from "@lorcanito/lorcana-engine";
import {
  createMockMatch,
  type TestInitialState,
} from "@lorcanito/lorcana-engine/__mocks__/createGameMock";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import type { LorcanitoCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { noOpDeps } from "@lorcanito/lorcana-engine/store/dependencies";
import { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type { Dependencies } from "@lorcanito/lorcana-engine/store/types";

function noOp() {}

const debugDeps: Dependencies = {
  logger: { log: console.log, batchLogs: console.log },
  notifier: {
    sendNotification: console.warn,
    clearNotification: noOp,
    clearAllNotifications: noOp,
  },
  playerId: "player_one",
  modals: {
    openYesOrNoModal: console.log,
    openTargetModal: console.log,
    openScryModal: console.log,
  },
};

function getDependencies(playerId = "player_one", debug = false): Dependencies {
  if (!debug) {
    return { ...noOpDeps, playerId };
  }

  debugDeps.logger.log = (logEntry) => {
    const keysToConvert = [
      "shifter",
      "shifted",
      "discarded",
      "instanceId",
      "card",
    ];
    Object.keys(logEntry).forEach((key) => {
      const typedKey = key as keyof typeof logEntry;
      const cardId = logEntry[typedKey];

      // if (cardId && logEntry[typedKey] && keysToConvert.includes(typedKey)) {
      //   logEntry[typedKey] +=
      //     " (" + this.store.cardStore.getCard(cardId)?.fullName + ")";
      // }
    });

    console.log(logEntry);
  };

  return { ...debugDeps, playerId };
}

/**
 * @deprecated Use `TestEngine` instead of `TestStore` for new tests.
 */
export class TestStore {
  store: MobXRootStore;
  readonly debug: boolean;
  readonly cards: Record<string, TableCard>;

  constructor(
    playerState: TestInitialState = {},
    opponentState: TestInitialState = {},
    // This will remove console.log from the logger
    debug = process.env.CI !== "true",
    skipPreMatch = true,
  ) {
    preFlightCheck(playerState, opponentState);

    const { game, cards } = createMockMatch(
      playerState,
      opponentState,
      skipPreMatch,
    );

    this.store = new MobXRootStore(
      game,
      cards,
      getDependencies("player_one", debug),
      true,
    );

    this.cards = cards;
    this.debug = debug;
  }

  changePlayer(playerId?: string) {
    const activePlayer = playerId
      ? playerId
      : this.store.opponentPlayer(this.store.activePlayer);

    console.log(
      `Changing Active player, from ${this.store.activePlayer} to ${activePlayer}`,
    );

    this.store.changeActivePlayer(activePlayer);
    // This approach was causing an issue where tests would hold references to the previous store
    // Leading to unexpected behavior, that are hard to debug.
    // this.store = new MobXRootStore(
    //   this.store.toJSON(),
    //   this.cards,
    //   getDependencies(activePlayer, this.debug),
    //   true,
    // );

    if (this.store.priorityPlayer !== playerId) {
      console.log("Priority player is not the same as the player id");
    }

    return this;
  }

  // Ensure that there's only one of this card in game, or else it will take the first found
  getCard(lorcanitoCard: LorcanitoCard, index?: number): CardModel {
    const cards = this.store.cardStore.getAllCards.filter(
      (card) => card.lorcanitoCard.id === lorcanitoCard.id,
    );
    const card = cards[0];

    if (!card) {
      throw new Error(
        `Could not find card with id ${lorcanitoCard.id}: ${lorcanitoCard.name}`,
      );
    }

    if (typeof index === "number" && cards[index]) {
      return cards[index];
    }

    if (cards.length > 1) {
      throw new Error(
        `Found more than one card with id ${lorcanitoCard.id}: ${lorcanitoCard.name}, please use testStore.getByZoneAndId to specify the zone and player`,
      );
    }

    return card;
  }

  getByZoneAndId(zone: Zones, id: string, playerId = "player_one") {
    const card = this.store.tableStore
      .getPlayerZone(playerId, zone)
      ?.cards.find((card) => card.lorcanitoCard?.id === id);

    if (!card) {
      throw new Error(`Could not find card with id ${id} in zone ${zone}`);
    }

    return card;
  }

  fromZone(zone: Zones, card: LorcanitoCard, playerId = "player_one") {
    return this.getByZoneAndId(zone, card.id, playerId);
  }

  exertAllInkwell(playerId = "player_one") {
    const inkwell = this.store.tableStore.getPlayerZone(playerId, "inkwell");
    inkwell?.cards.forEach((card) => {
      card.updateCardMeta({ exerted: true });
    });
  }

  getAvailableInkwellCardCount(playerId = "player_one") {
    return this.store.tableStore
      .getPlayerZone(playerId, "inkwell")
      ?.inkAvailable();
  }

  getZonesCardCount(playerId = "player_one") {
    const tableStore = this.store.tableStore;
    return {
      inkwell: tableStore.getPlayerZoneCards(playerId, "inkwell").length,
      hand: tableStore.getPlayerZoneCards(playerId, "hand").length,
      play: tableStore.getPlayerZoneCards(playerId, "play").length,
      discard: tableStore.getPlayerZoneCards(playerId, "discard").length,
      deck: tableStore.getPlayerZoneCards(playerId, "deck").length,
    };
  }

  getZonesCards(playerId = "player_one") {
    const tableStore = this.store.tableStore;
    return {
      inkwell: tableStore.getPlayerZoneCards(playerId, "inkwell"),
      hand: tableStore.getPlayerZoneCards(playerId, "hand"),
      play: tableStore.getPlayerZoneCards(playerId, "play"),
      discard: tableStore.getPlayerZoneCards(playerId, "discard"),
      deck: tableStore.getPlayerZoneCards(playerId, "deck"),
    };
  }

  getPlayerLore(playerId = "player_one") {
    const tableStore = this.store.tableStore;
    return tableStore.getTable(playerId).lore;
  }

  resolveTopOfStack(
    params: ResolvingParam & { targetId?: string } = {},
    skipAssertion = false,
  ): void {
    const topLayer = this.store.stackLayerStore.topLayer;

    if (
      topLayer?.isOptional() &&
      !topLayer.ability.accepted &&
      Object.keys(params).length > 0
    ) {
      console.log(JSON.stringify(topLayer, null, 2));
      console.warn(
        "You're trying to resolve a layer that is optional, but you're passing params. Ensure that you accept the optional layer, before you resolve the layer passing params",
      );
    }
    // if (!skipAssertion && this.stackLayers.length === 0) {
    //   throw new Error(
    //     "Stack empty, before resolving an ability it should have something on stack",
    //   );
    // }
    if (params.targetId) {
      const target = this.store.cardStore.getCard(params.targetId);
      if (target) {
        params.targets = [target];
      }
    }

    if (this.store.priorityPlayer !== this.store.activePlayer) {
      console.warn(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
      throw new Error(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
    }

    this.store.stackLayerStore.resolveTopOfStack(params);

    if (!skipAssertion && this.stackLayers.length > 0) {
      throw new Error(
        "Stack not empty, after resolving an ability it should be back to empty. If this is expected please set skipAssertion to true",
      );
      expect(this.stackLayers).toHaveLength(0);
    }
  }

  resolveOptionalAbility() {
    if (this.stackLayers.length === 0) {
      throw new Error(
        "Stack empty, before resolving an ability it should have something on stack",
      );
    }

    if (!this.store.stackLayerStore.topLayer?.ability?.optional) {
      console.warn(JSON.stringify(this.stackLayers, null, 2));
      throw new Error(
        "You tried to resolve an optional ability but there is none, or it's not an optional layer. Please check the stack",
      );
    }

    this.resolveTopOfStack({}, true);
  }

  skipOptionalAbility(skipAssertion = false) {
    if (!this.store.stackLayerStore.topLayer?.ability?.optional) {
      throw new Error(
        "You tried to SKIP an optional ability but there is none, or it's not an optional layer. Please check the stack",
      );
    }

    this.resolveTopOfStack({ skip: true });

    if (!skipAssertion && this.stackLayers.length > 0) {
      console.warn(JSON.stringify(this.stackLayers, null, 2));
      throw new Error(
        "Stack not empty, after resolving an ability it should be back to empty",
      );
    }
  }

  passTurn(force = false) {
    return this.store.passTurn(this.store.turnPlayer, force);
  }

  get stackLayers() {
    return this.store.stackLayerStore.layers || [];
  }

  static get aCard(): LorcanitoCard {
    return dingleHopper;
  }

  static get aSongCard(): LorcanitoCard {
    return friendsOnTheOtherSide;
  }
}

function preFlightCheck(
  playerState: TestInitialState,
  opponentState: TestInitialState,
) {
  [...Object.values(playerState), ...Object.values(opponentState)].forEach(
    (card) => {
      if (typeof card === "number") {
        return;
      }
    },
  );
}
