import {
  notEmptyPredicate,
  type ScryEffectPayload,
  type TargetFilter,
} from "@lorcanito/lorcana-engine";
import { lorcanitoShuffle } from "@lorcanito/lorcana-engine/lib/shuffle/lorcanitoShuffle";
import type { CardStore } from "@lorcanito/lorcana-engine/store/CardStore";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { TableModel } from "@lorcanito/lorcana-engine/store/models/TableModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import type {
  Dependencies,
  MoveResponse,
} from "@lorcanito/lorcana-engine/store/types";
import type {
  CardMovement,
  Match,
  Table,
  Zones,
} from "@lorcanito/lorcana-engine/types/types";
import { makeAutoObservable, toJS } from "mobx";

export class TableStore {
  dependencies: Dependencies;
  tables: Record<string, TableModel>;
  cardStore: CardStore;
  rootStore: MobXRootStore;

  constructor(
    initialState: Record<string, TableModel>,
    dependencies: Dependencies,
    cardStore: CardStore,
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    this.dependencies = dependencies;
    this.tables = initialState;
    this.cardStore = cardStore;
    this.rootStore = rootStore;

    if (observable) {
      makeAutoObservable(this, { rootStore: false, dependencies: false });
    }
  }

  static fromTable(
    tables: Record<string, Table>,
    dependencies: Dependencies,
    cardStore: CardStore,
    rootStore: MobXRootStore,
    observable: boolean,
  ): TableStore {
    const tableModels: Record<string, TableModel> = {};

    Object.keys(tables || {}).forEach((playerId) => {
      const table = tables[playerId];
      if (table) {
        tableModels[playerId] = TableModel.fromTable(
          table,
          playerId,
          cardStore,
          rootStore,
          observable,
        );
      }
    });

    return new TableStore(
      tableModels,
      dependencies,
      cardStore,
      rootStore,
      observable,
    );
  }

  sync(tables: Match["tables"]) {
    Object.keys(tables || {}).forEach((playerId) => {
      const table = tables[playerId];
      const tableModel = this.tables[playerId];

      if (table && tableModel) {
        tableModel.sync(table);
      }
    });
  }

  // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
  // https://mobx.js.org/computeds.html
  toJSON(): Match["tables"] {
    return this.JSON;
  }

  get JSON(): Match["tables"] {
    const tables: Record<string, Table> = {};

    Object.keys(this.tables || {}).forEach((playerId) => {
      const table = this.tables[playerId];

      if (table) {
        tables[playerId] = table.toJSON();
      }
    });

    return toJS(tables);
  }

  getTables(): TableModel[] {
    return Object.values(this.tables);
  }

  get players() {
    return Object.keys(this.tables).filter(notEmptyPredicate);
  }

  getTable(playerId?: string) {
    let table!: TableModel | undefined;
    if (playerId) {
      table = this.tables[playerId];
    } else {
      const activePlayer = this.rootStore.activePlayer;
      table = this.tables[activePlayer];
    }

    // TODO: FIX THIS
    return table as TableModel;
  }

  payInk(table: TableModel, amount: number) {
    const availableInk =
      this.tables[table.ownerId]?.zones?.inkwell?.cards.filter(
        (card) => card.ready,
      ) || [];

    if (availableInk.length < amount) {
      console.error("Not enough ink");
      return false;
    }

    availableInk?.slice(0, amount).forEach((card) => {
      card.updateCardMeta({ exerted: true });
    });

    return true;
  }

  hasChallengedThisTurn(glimmer: CardModel) {
    return this.getTables().some((table) => {
      return table.hasChallengedThisTurn(glimmer);
    });
  }

  alterHand(cardsToAlter: string[], playerId: string) {
    if (this.rootStore.stateMachineStore.hasPlayerAlteredHand(playerId)) {
      console.error("Already Mulliganed: ", playerId);
      return;
    }

    const table = this.getTable(playerId);

    this.rootStore.log({
      type: "MULLIGAN",
      cards: cardsToAlter,
      player: playerId,
    });

    this.rootStore.stateMachineStore.trackAlteredCards(
      playerId,
      cardsToAlter.length,
    );

    cardsToAlter.map((card) => {
      this.moveCard(card, "deck", { position: "first", skipLog: false });
      this.drawCards(playerId, 1, { skipLog: true });
    });

    while (
      table.zones.hand.cards.length < 7 &&
      table.zones.deck.cards.length > 0
    ) {
      this.drawCards(playerId, 1, { skipLog: true });
    }

    if (cardsToAlter.length) {
      this.shuffleDeck(playerId);
    }
  }

  findCardZone(card: CardModel) {
    const table = this.tables[card.ownerId];
    if (!table) {
      console.error("Table not found", card.ownerId);
      return;
    }

    const zones = table.zones;
    return Object.keys(zones).find((zone) => {
      return zones[zone as Zones]?.hasCard(card);
    });
  }

  getStackCards() {
    const turnPlayer = this.rootStore.activePlayer;

    return (
      this.rootStore.tableStore
        .getPlayerZone(turnPlayer, "play")
        ?.cards.filter((card) => card?.lorcanitoCard?.type === "action") || []
    );
  }

  get getPendingEffects() {
    return this.rootStore.stackLayerStore.getLayers;
  }

  move(
    card: CardModel,
    to: Zones,
    opts: {
      skipLog?: true;
      position?: "first" | "last";
      attacker?: CardModel;
      defender?: CardModel;
      discard?: boolean;
      isPrivate?: boolean;
    } = {},
  ) {
    this.moveCard(card.instanceId, to, opts);
  }

  moveCard(
    instanceId = "",
    to: Zones,
    opts: {
      skipLog?: boolean;
      position?: "first" | "last";
      attacker?: CardModel;
      defender?: CardModel;
      discard?: boolean;
      effectSource?: CardModel;
      isPrivate?: boolean;
      triggerDraw?: boolean;
      movedHow?: CardMovement["how"];
    } = {},
  ): MoveResponse {
    const {
      skipLog = false,
      position = "last",
      discard = false,
      attacker,
      defender,
      effectSource,
    } = opts;
    const card = this.cardStore.cards[instanceId];

    if (!card) {
      return this.rootStore.sendNotification({
        type: "icon",
        title: "Card not found",
        message: "Card not found",
        icon: "warning",
        autoClear: true,
      });
    }

    const owner = card?.ownerId;
    const table = this.tables[owner];
    if (!table) {
      return this.rootStore.sendNotification({
        type: "icon",
        title: "Table not found",
        message: "Table not found",
        icon: "warning",
        autoClear: true,
      });
    }

    return table.moveCard(
      card,
      to,
      position,
      skipLog,
      discard,
      attacker,
      defender,
      effectSource,
      opts,
    );
  }

  playCardFromHand(card: CardModel, params?: { bodyguard?: boolean }) {
    const table = this.getTable(card.ownerId);
    const isCardInHand = table?.zones?.hand?.hasCard(card);
    if (!(isCardInHand && table)) {
      console.error("Card not in hand");
      return;
    }

    card.playFromHand(params);
  }

  get allCardsMoved() {
    const cardsMoved: Record<string, CardMovement[]> = {};

    Object.values(this.tables).forEach((table) => {
      cardsMoved[table.ownerId] = table.turn.cardsMoved;
    });

    return cardsMoved;
  }

  setPlayerLore(player: string, lore: number) {
    const table = this.getTable(player);

    if (!table) {
      console.error("Table not found", player);
      return;
    }

    const playerLore = table.lore;
    table.lore = lore;

    return this.rootStore.log({
      type: "LORE_CHANGE",
      player: player,
      from: playerLore,
      to: lore,
    });
  }

  shuffleDeck(player: string): MoveResponse {
    const table = this.tables[player];

    if (table?.zones.deck) {
      table.zones.deck.cards = lorcanitoShuffle(table.zones.deck.cards);

      table.zones.deck.cards.forEach((card) => {
        if (card.isRevealed) {
          card.hide({ skipLog: true });
        }
      });
    }

    this.rootStore.log({ type: "SHUFFLE_DECK" });
    return this.rootStore.moveResponse(true);
  }

  scry(
    top: CardModel[] = [],
    bottom: CardModel[] = [],
    hand: CardModel[] = [],
    inkwell: CardModel[] = [],
    discard: CardModel[] = [],
    play: CardModel[] = [],
    // No filter means No cards
    tutorFilters: TargetFilter[] = [],
    playFilters: TargetFilter[] = [],
    limits: ScryEffectPayload["limits"] = {},
    shouldReveal?: boolean,
    playExerted?: boolean,
  ): MoveResponse {
    const {
      top: topLimit = 0,
      bottom: bottomLimit = 0,
      hand: handLimit = 0,
      inkwell: inkwellLimit = 0,
      discard: discardLimit = 0,
      play: playLimit = 0,
    } = limits;

    // TODO: We should verify whether the player that is scrying owns the cards
    // There are effects that the opponent scries the cards
    const end = (Array.isArray(handLimit) ? handLimit.length : handLimit) || 0;

    // There are effects that require multiple filters, but a limited amount of cards per filter.
    // E.g. The Madrigal Family
    let limitPerTarget = Array.isArray(handLimit) ? handLimit : undefined;

    hand.slice(0, end).forEach((card) => {
      if (typeof limitPerTarget !== "undefined") {
        if (!limitPerTarget.length) {
          console.log("Already taken the max amount of cards");
          return;
        }

        if (
          limitPerTarget.some((filter) =>
            card.matchesTargetFilter(filter.filters),
          )
        ) {
          limitPerTarget = limitPerTarget.filter(
            (filter) => !card.matchesTargetFilter(filter.filters),
          );

          card.moveTo("hand", { skipLog: true });

          if (shouldReveal) {
            card.reveal();
          }
        }
      } else if (card.matchesTargetFilter(tutorFilters)) {
        card.moveTo("hand", { skipLog: true });

        if (shouldReveal) {
          card.reveal();
        }
      } else {
        this.rootStore.sendNotification({
          type: "icon",
          title: "Cannot tutor card, invalid target.",
          message: "You selected an invalid target for the effect.",
          icon: "warning",
          autoClear: true,
        });
      }
    });

    top.slice(0, topLimit || 0).forEach((card) => {
      card.moveTo("deck", { skipLog: true });
    });

    inkwell.slice(0, inkwellLimit || 0).forEach((card) => {
      card.moveTo("inkwell", { skipLog: true });
      card.updateCardMeta({ exerted: true });
    });

    discard
      // Not sure if a limit should be applied here
      .forEach((card) => {
        card.moveTo("discard", { skipLog: true });
      });

    bottom
      .reverse()
      .slice(0, bottomLimit || 0)
      .forEach((card) => {
        card.moveTo("deck", { position: "first", skipLog: true });
      });

    play.slice(0, playLimit || 0).forEach((card) => {
      // TODO: Improve this, too specific to The Queen - Diviner
      if (card.matchesTargetFilter(tutorFilters)) {
        if (card.matchesTargetFilter(playFilters)) {
          this.rootStore.trace(
            `Playing card from scry ${card.name} (${card.instanceId})`,
          );
          const exerted = typeof playExerted === "undefined" || playExerted; // If playExerted not defined, it defaults to exerted. TODO: Change this behavior
          card.playFromHand({ forFree: true, exerted: exerted });
        } else {
          card.moveTo("hand", { skipLog: true });
        }
      } else {
        this.rootStore.sendNotification({
          type: "icon",
          title: "Cannot tutor card, invalid target",
          message: "You selected an invalid target for the effect",
          icon: "warning",
          autoClear: true,
        });
      }
    });

    if (hand.length > end) {
      this.rootStore.sendNotification({
        type: "icon",
        title: "Too many cards in hand",
        message: `You selected ${hand.length} cards, but you can only tutor ${handLimit} cards`,
        icon: "warning",
        autoClear: true,
      });
    }

    if (play.length > playLimit) {
      this.rootStore.sendNotification({
        type: "icon",
        title: "Too many cards to play",
        message: `You selected ${play.length} cards to play, but you can only play ${playLimit} cards`,
        icon: "warning",
        autoClear: true,
      });
    }
    if (top.length > topLimit) {
      this.rootStore.sendNotification({
        type: "icon",
        title: "Too many cards on top",
        message: `You selected ${top.length} cards, but you can only put ${topLimit} cards on top`,
        icon: "warning",
        autoClear: true,
      });
    }
    if (bottom.length > bottomLimit) {
      this.rootStore.sendNotification({
        type: "icon",
        title: "Too many cards on bottom",
        message: `You selected ${bottom.length} cards, but you can only put ${bottomLimit} cards on bottom`,
        icon: "warning",
        autoClear: true,
      });
    }
    if (inkwell.length > inkwellLimit) {
      this.rootStore.sendNotification({
        type: "icon",
        title: "Too many cards on inkwell",
        message: `You selected ${inkwell.length} cards, but you can only put ${inkwellLimit} cards to the inkwell`,
        icon: "warning",
        autoClear: true,
      });
    }
    if (discard.length > discardLimit) {
      this.rootStore.sendNotification({
        type: "icon",
        title: "Too many cards on discard",
        message: `You selected ${discard.length} cards, but you can only put ${discardLimit} cards to the inkwell`,
        icon: "warning",
        autoClear: true,
      });
    }

    this.rootStore.log({
      type: "SCRY",
      top: top.length,
      bottom: bottom.length,
      inkwell: inkwell.length,
      hand: shouldReveal ? hand.map((card) => card.instanceId) : hand.length,
      discard: discard.map((card) => card.instanceId),
      play: play.map((card) => card.instanceId),
      shouldReveal,
    });

    return this.rootStore.moveResponse(true);
  }

  addToInkwell(instanceId: string): MoveResponse {
    const card = this.cardStore.cards[instanceId];
    const lorcanitoCard = card?.lorcanitoCard;

    if (!card?.inkwell) {
      return this.rootStore.sendNotification({
        type: "icon",
        title: "This card doesn't contain inkwell symbol",
        message: `You can instead right click the card and select "Move card to Inkwell" option, if you want to skip this check.`,
        icon: "warning",
        autoClear: true,
      });
    }

    if (!(card && lorcanitoCard)) {
      return this.rootStore.sendNotification({
        type: "icon",
        title: "Card not found",
        message: "Card not found",
        icon: "warning",
        autoClear: true,
      });
    }

    const owner = card.ownerId;
    const tableModel = this.getTable(owner);
    const hasReachedLimit = !tableModel.canAddToInkwell();

    if (hasReachedLimit) {
      return this.rootStore.sendNotification({
        type: "icon",
        title: "You already added a card to the inkwell this turn",
        message: `You can instead right click the card and select "Move card to Inkwell" option, if you want to skip this check.`,
        icon: "warning",
        autoClear: true,
      });
    }

    return this.moveCard(instanceId, "inkwell", {
      movedHow: "inkwell",
    });
  }

  getPlayerZone(ownerId: string, zone: Zones) {
    return this.getTable(ownerId)?.zones[zone];
  }

  getPlayerZoneCards(ownerId: string, zone: Zones) {
    return this.getTable(ownerId)?.zones[zone]?.cards || [];
  }

  getTopDeckCard(ownerId: string) {
    const playerDeck = this.getPlayerZone(ownerId, "deck");

    if (!(playerDeck && Array.isArray(playerDeck.cards))) {
      return undefined;
    }

    return playerDeck.cards[playerDeck.cards.length - 1];
  }

  getBottomDeckCard(ownerId: string) {
    const playerDeck = this.getPlayerZone(ownerId, "deck");

    if (!playerDeck) {
      return undefined;
    }

    return playerDeck.cards[0];
  }

  drawCards(
    ownerId: string,
    amount = 1,
    opts: { skipLog?: boolean; effectSource?: CardModel } = {},
  ): MoveResponse {
    const cards: string[] = [];
    [...Array(amount).keys()].forEach(() => {
      const topCard = this.getTopDeckCard(ownerId);
      const instanceId = topCard?.instanceId;

      if (!instanceId) {
        this.rootStore.debug("Empty Deck");
        const players = Object.keys(this.tables);
        const winner = ownerId === players[0] ? players[1] : players[0];
        if (winner) {
          this.rootStore.log({
            type: "DRAW_EMPTY_DECK",
            player: ownerId,
          });
          this.rootStore.declareWinnerForMatch(winner);
        }
        return;
      }

      cards.push(instanceId);

      this.moveCard(instanceId, "hand", {
        ...opts,
        skipLog: amount > 1 || opts.skipLog,
        triggerDraw: true,
      });
    });

    if (!opts.skipLog && amount > 1) {
      this.rootStore.log({
        type: "DRAW",
        player: ownerId,
        cards,
      });
    }

    return this.rootStore.moveResponse(true);
  }

  discardCards(cards: CardModel[]): MoveResponse {
    cards.forEach((card) => {
      if (this.rootStore.effectStore.hasDiscardRestriction(card)) {
        // TODO: ADD A LOG FOR THIS
        // this.rootStore.sendNotification({
        //   type: "icon",
        //   title: "Discard restriction",
        //   message:
        //     "There's a card preventing you from discarding this card. Please check the card's text for more information.",
        //   icon: "warning",
        //   autoClear: true,
        // });
        return;
      }

      card.discard();
    });

    const yourCards = cards.filter(
      (card) => card.ownerId === this.rootStore.activePlayer,
    );
    if (yourCards.length >= 1) {
      this.rootStore.log({
        type: "DISCARD",
        cards: yourCards.map((card) => card.instanceId),
      });
    }

    const opponentCards = cards.filter(
      (card) => card.ownerId !== this.rootStore.activePlayer,
    );
    if (opponentCards.length >= 1) {
      this.rootStore.log({
        type: "DISCARD",
        cards: opponentCards.map((card) => card.instanceId),
      });
    }

    return this.rootStore.moveResponse(true);
  }
}
