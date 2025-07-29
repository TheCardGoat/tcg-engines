import { expect } from "@jest/globals";
import type {
  LorcanitoActionCard,
  LorcanitoCard,
  LorcanitoCharacterCard,
  MobXRootStore,
  ScryEffect,
  Zones,
} from "@lorcanito/lorcana-engine";
import { CardModel, notEmptyPredicate } from "@lorcanito/lorcana-engine";
import type { TestInitialState } from "@lorcanito/lorcana-engine/__mocks__/createGameMock";
import { Engine } from "@lorcanito/lorcana-engine/engine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import type { ResolverLayerParams } from "@lorcanito/lorcana-engine/types/Moves";

export type TestEngineScryEffectPayload = {
  top?: (CardModel | LorcanitoCard)[];
  bottom?: (CardModel | LorcanitoCard)[];
  inkwell?: (CardModel | LorcanitoCard)[];
  hand?: (CardModel | LorcanitoCard)[];
  discard?: (CardModel | LorcanitoCard)[];
  play?: (CardModel | LorcanitoCard)[];
  // TODO: Revisit later
  // these fields should not be parte of the payload, they should come from the effect we're resolving
  shouldRevealTutored?: ScryEffect["shouldRevealTutored"];
  limits?: ScryEffect["limits"];
  tutorFilters?: ScryEffect["tutorFilters"];
  playFilters?: ScryEffect["playFilters"];
};

export type TestEngineResolveParams = {
  layerId?: string;
  targets?: (CardModel | LorcanitoCard)[];
  player?: string;
  mode?: string;
  scry?: TestEngineScryEffectPayload;
  nameACard?: string;
  targetPlayer?: string;
  skip?: boolean;
};

export class TestEngine {
  store: MobXRootStore;
  testStore: TestStore;
  engine: Engine;

  constructor(
    playerState: TestInitialState = {},
    opponentState: TestInitialState = {},
    // This will remove console.log from the logger
    debug = process.env.CI !== "true",
    skipPreMatch = true,
  ) {
    if (typeof playerState.deck === "undefined") {
      playerState.deck = 60;
    }

    if (typeof opponentState.deck === "undefined") {
      opponentState.deck = 60;
    }

    this.testStore = new TestStore(
      playerState,
      opponentState,
      debug,
      skipPreMatch,
    );
    this.store = this.testStore.store;
    this.engine = new Engine({
      rootStore: this.store,
      cards: this.testStore.cards,
      onSuccess: async () => {},
      canSendMove: () => true,
    });
  }

  async tapCard(card: CardModel | LorcanitoCard, toggle = false) {
    const instance = this.getCardModel(card);

    this.engine.execute({
      type: "TAP_CARD",
      instanceId: instance.instanceId,
      toggle,
    });

    return instance;
  }

  async exertCard(card: CardModel | LorcanitoCard, toggle = false) {
    return this.tapCard(card, toggle);
  }

  async singSong(params: {
    singer: CardModel | LorcanitoCharacterCard;
    song: CardModel | LorcanitoActionCard;
  }) {
    const singerModel = this.getCardModel(params.singer);
    const songModel = this.getCardModel(params.song);

    this.engine.execute({
      type: "SING",
      singer: singerModel.instanceId,
      song: songModel.instanceId,
    });

    return {
      singer: singerModel,
      song: songModel,
    };
  }

  async singSongTogether(params: {
    singers: CardModel[] | LorcanitoCharacterCard[];
    song: CardModel | LorcanitoActionCard;
  }) {
    const singerModel = params.singers.map((card) => this.getCardModel(card));
    const songModel = this.getCardModel(params.song);

    this.engine.execute({
      type: "SING_TOGETHER",
      singers: singerModel
        .map((card) => card.instanceId)
        .filter(notEmptyPredicate),
      song: songModel.instanceId,
    });

    return {
      singers: singerModel,
      song: songModel,
    };
  }

  async activateCard(
    card: LorcanitoCard | CardModel,
    params?: {
      ability?: string;
      costs?: (CardModel | LorcanitoCard)[];
      acceptOptionalLayer?: boolean;
    } & TestEngineResolveParams,
    skipAssertion = false,
  ) {
    const instance = this.getCardModel(card);

    this.engine.execute({
      type: "ACTIVATE_ABILITY",
      instanceId: instance.instanceId,
      ability: params?.ability,
      costs: params?.costs?.map(this.toInstanceId),
    });

    if (params?.acceptOptionalLayer) {
      await this.acceptOptionalLayer(skipAssertion);
    }

    if (params?.targets || params?.scry || params?.nameACard) {
      await this.resolveTopOfStack(params, skipAssertion);
    }

    return instance;
  }

  async playCard(
    card: CardModel | LorcanitoCard,
    params: TestEngineResolveParams & {
      bodyguard?: boolean;
      acceptOptionalLayer?: boolean;
      alternativeCosts?: Array<CardModel | LorcanitoCard>;
    } = {},
    skipAssertion = false,
  ) {
    const instance = this.getCardModel(card);
    const { alternativeCosts, acceptOptionalLayer, ...resolveParams } = params;

    this.engine.execute({
      type: "PLAY_CARD",
      instanceId: instance.instanceId,
      bodyguard: params.bodyguard,
      alternativeCosts: alternativeCosts
        ?.map((cost) => this.getCardModel(cost).instanceId)
        .filter(notEmptyPredicate),
    });

    if (acceptOptionalLayer) {
      await this.acceptOptionalLayer(skipAssertion);
    }

    if (
      Object.keys(resolveParams || {}).filter(
        (key) =>
          !["bodyguard", "acceptOptionalLayer", "alternativeCosts"].includes(
            key,
          ),
      ).length
    ) {
      await this.resolveTopOfStack(params, skipAssertion);
    }

    return instance;
  }

  async putIntoInkwell(card: CardModel | LorcanitoCard) {
    const instance = this.getCardModel(card);

    this.engine.execute({
      type: "PUT_CARD_INTO_INKWELL",
      instanceId: instance.instanceId,
    });

    return instance;
  }

  async challenge(params: {
    attacker: CardModel | LorcanitoCard;
    defender: CardModel | LorcanitoCard;
    exertDefender?: boolean;
  }) {
    const { attacker, defender } = params;
    const attackerInstance = this.toInstanceId(attacker);
    const defenderInstance = this.toInstanceId(defender);

    if (params.exertDefender) {
      await this.tapCard(defender);
    }

    this.engine.execute({
      type: "CHALLENGE",
      attacker: attackerInstance,
      defender: defenderInstance,
    });

    return {
      attacker: this.getCardModel(attacker),
      defender: this.getCardModel(defender),
    };
  }

  async shiftCard(params: {
    shifted: LorcanitoCharacterCard;
    shifter: LorcanitoCharacterCard;
    costs?: (CardModel | LorcanitoCard)[];
  }) {
    const { shifted, shifter, costs } = params;
    const shiftedInstance = this.getCardModel(shifted);
    const shifterInstance = this.getCardModel(shifter);

    this.engine.execute({
      type: "SHIFT",
      shifted: shiftedInstance.instanceId,
      shifter: shifterInstance.instanceId,
      costs: params.costs?.map((c) => this.getCardModel(c).instanceId),
    });

    return { shifted: shiftedInstance, shifter: shifterInstance };
  }

  async questCard(
    card: LorcanitoCard | CardModel,
    params?: TestEngineResolveParams,
    skipAssertion = false,
  ) {
    const model = this.getCardModel(card);

    this.engine.execute({
      type: "QUEST",
      instanceId: model.instanceId,
    });

    if (params) {
      const topLayer = this.store.stackLayerStore.topLayer;

      if (topLayer?.isOptional()) {
        await this.resolveOptionalAbility(true);
      }

      await this.resolveTopOfStack(params, skipAssertion);
    }

    return model;
  }

  async questWithAll(playerId?: string) {
    this.engine.execute({
      type: "QUEST_WITH_ALL",
      playerId: playerId || this.store.activePlayer,
    });
  }

  async moveToLocation(params: {
    location: CardModel | LorcanitoCard;
    character: CardModel | LorcanitoCard;
    skipAssertion?: boolean;
  }) {
    const location = this.getCardModel(params.location);
    const character = this.getCardModel(params.character);

    this.engine.execute({
      // type: "MOVE_TO_LOCATION", should only be used in manual mode to move to a location bypassing costs
      type: "ENTER_LOCATION",
      location: location.instanceId,
      character: character.instanceId,
    });

    if (!params.skipAssertion) {
      expect(character.isAtLocation(location)).toBe(true);
      expect(location.containsCharacter(character)).toBe(true);
    }

    return { location, character };
  }

  async setCardDamage(
    characterCard: LorcanitoCharacterCard | CardModel,
    number: number,
  ) {
    const character = this.getCardModel(characterCard);

    this.engine.execute({
      type: "UPDATE_CARD_DAMAGE",
      instanceId: character.instanceId,
      damage: number,
      operation: "set",
    });

    return character;
  }

  async passTurn(playerId?: string, skipPriority = false) {
    const player = playerId || this.store.turnPlayer;
    this.engine.execute({
      type: "PASS_TURN",
      player: player,
    });

    if (!skipPriority) {
      if (this.store.priorityPlayer !== player) {
        console.warn(
          `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
        );
        // return;
      }

      this.changeActivePlayer(this.store.opponentPlayer(player));
    }
  }

  getAvailableInkwellCardCount(playerId = "player_one") {
    return this.store.tableStore
      .getPlayerZone(playerId, "inkwell")
      ?.inkAvailable();
  }

  getTotalInkwellCardCount(playerId = "player_one") {
    return this.store.tableStore.getPlayerZone(playerId, "inkwell")?.inkTotal();
  }

  changeActivePlayer(playerId?: string) {
    const activePlayer = playerId
      ? playerId
      : this.store.opponentPlayer(this.store.activePlayer);

    this.testStore.changePlayer(activePlayer);
  }

  async skipTopOfStack() {
    const topLayer = this.store.stackLayerStore.topLayer;

    if (!topLayer) {
      throw new Error(
        "Stack empty, before resolving an ability it should have something on stack",
      );
    }

    this.engine.execute({
      type: "SKIP_LAYER",
      layerId: topLayer.id,
      activePlayer: this.store.activePlayer,
    });
  }

  async drawCard(playerId = "player_one") {
    this.engine.execute({
      type: "DRAW_CARD",
      player: playerId,
    });
  }

  async resolveStackLayer(
    params: TestEngineResolveParams,
    skipAssertion = false,
  ) {
    if (this.store.priorityPlayer !== this.store.activePlayer) {
      console.warn(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
      throw new Error(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
    }
    const layerId = params.layerId;

    if (!layerId) {
      throw new Error("Layer id is required");
    }

    const scry = {
      top: params.scry?.top?.map(this.toInstanceId),
      bottom: params.scry?.bottom?.map(this.toInstanceId),
      hand: params.scry?.hand?.map(this.toInstanceId),
      inkwell: params.scry?.inkwell?.map(this.toInstanceId),
      discard: params.scry?.discard?.map(this.toInstanceId),
      play: params.scry?.play?.map(this.toInstanceId),
    };
    const convertedParams: ResolverLayerParams = {
      layerId: layerId,
      targets: params.targets?.map(this.toInstanceId),
      mode: params.mode,
      nameACard: params.nameACard,
      targetPlayer: params.targetPlayer,
      // skip: false,
      scry: Object.values(scry).some((value) => value) ? scry : undefined,
    };

    for (const key of Object.keys(convertedParams)) {
      // @ts-expect-error
      convertedParams[key] === undefined && delete convertedParams[key];
    }

    this.engine.execute({
      type: "RESOLVE_LAYER",
      activePlayer: this.store.activePlayer,
      ...convertedParams,
    });

    if (!skipAssertion && this.store.stackLayerStore.layers.length > 0) {
      // TODO: Fix cyclic dependency
      // console.error(JSON.stringify(this.store.stackLayerStore.layers, null, 2));
      throw new Error(
        "Stack not empty, after resolving an ability it should be back to empty. If this is expected please set skipAssertion to true",
      );
    }
  }

  async resolveTopOfStack(
    params: TestEngineResolveParams,
    skipAssertion = false,
  ) {
    const topLayer = this.store.stackLayerStore.topLayer;

    if (!topLayer) {
      throw new Error(
        "Stack empty, before resolving an ability it should have something on stack",
      );
    }

    if (this.store.priorityPlayer !== this.store.activePlayer) {
      console.warn(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
      throw new Error(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
    }

    const scry = {
      top: params.scry?.top?.map(this.toInstanceId),
      bottom: params.scry?.bottom?.map(this.toInstanceId),
      hand: params.scry?.hand?.map(this.toInstanceId),
      inkwell: params.scry?.inkwell?.map(this.toInstanceId),
      discard: params.scry?.discard?.map(this.toInstanceId),
      play: params.scry?.play?.map(this.toInstanceId),
    };
    const convertedParams: ResolverLayerParams = {
      layerId: params.layerId || topLayer.id,
      targets: params.targets?.map(this.toInstanceId),
      mode: params.mode,
      nameACard: params.nameACard,
      targetPlayer: params.targetPlayer,
      // skip: false,
      scry: Object.values(scry).some((value) => value) ? scry : undefined,
    };

    for (const key of Object.keys(convertedParams)) {
      // @ts-ignore
      convertedParams[key] === undefined && delete convertedParams[key];
    }

    this.engine.execute({
      type: "RESOLVE_LAYER",
      activePlayer: this.store.activePlayer,
      ...convertedParams,
    });

    if (!skipAssertion && this.store.stackLayerStore.layers.length > 0) {
      console.error(JSON.stringify(this.store.stackLayerStore.layers, null, 2));
      throw new Error(
        "Stack not empty, after resolving an ability it should be back to empty. If this is expected please set skipAssertion to true",
      );
    }
  }

  async acceptOptionalLayer(skipAssertion = false, layerId?: string) {
    const topLayer = this.store.stackLayerStore.topLayer;

    if (!topLayer) {
      throw new Error(
        "Stack empty, before resolving an ability it should have something on stack",
      );
    }

    if (this.store.priorityPlayer !== this.store.activePlayer) {
      console.warn(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
      throw new Error(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
    }

    this.engine.execute({
      type: "ACCEPT_OPTIONAL_LAYER",
      layerId: layerId || topLayer.id,
      activePlayer: this.store.activePlayer,
    });
  }

  async acceptOptionalLayerBySource({
    skipAssertion = false,
    source,
  }: {
    skipAssertion?: boolean;
    source: CardModel | LorcanitoCard;
  }) {
    const model = this.toInstanceId(source);
    const layer = this.store.stackLayerStore.layers.find(
      (layer) => layer.source.instanceId === model,
    );

    if (!layer) {
      throw new Error(
        "Layer not found, Check if source is correct or if the layer is optional",
      );
    }

    if (this.store.priorityPlayer !== this.store.activePlayer) {
      console.warn(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
      throw new Error(
        `Player executing the action doesnt have priority actual ${this.store.activePlayer} expected ${this.store.priorityPlayer}`,
      );
    }

    this.engine.execute({
      type: "ACCEPT_OPTIONAL_LAYER",
      layerId: layer.id,
      activePlayer: this.store.activePlayer,
    });
  }

  async resolveOptionalAbility(skipAssertion = false) {
    return this.acceptOptionalLayer(skipAssertion);
  }

  async acceptOptionalAbility(skipAssertion = false) {
    return this.acceptOptionalLayer(skipAssertion);
  }

  getLoreForPlayer(playerId = "player_one") {
    return this.store.tableStore.getTable(playerId).lore;
  }

  getPlayerLore(playerId = "player_one") {
    return this.getLoreForPlayer(playerId);
  }

  getZonesCardCount(player?: string) {
    return this.testStore.getZonesCardCount(player);
  }

  getCardsByZone(zone: Zones, playerId = "player_one") {
    return this.testStore.store.tableStore.getTable(playerId)?.zones?.[zone]
      ?.cards;
  }

  getCardZone(card: CardModel | LorcanitoCard) {
    if (card instanceof CardModel) {
      return card.zone;
    }

    return this.testStore.getCard(card).zone;
  }

  getCardModel(card: CardModel | LorcanitoCard, index?: number) {
    if (card instanceof CardModel) {
      return card;
    }

    return this.testStore.getCard(card, index);
  }

  turnEvents(playerId = "player_one") {
    return this.store.tableStore.getTable(playerId).turn;
  }

  get stackLayers() {
    return this.testStore.stackLayers;
  }

  private toInstanceId = (card: CardModel | LorcanitoCard) => {
    if (card instanceof CardModel) {
      return card.instanceId;
    }

    return this.getCardModel(card).instanceId;
  };

  getLayerIdForPlayer(playerId: string): string | undefined {
    return this.stackLayers.find((layer) => layer.responder === playerId)?.id;
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

  getACardFromHand(playerId = "player_one") {
    const zone = this.store.tableStore.getPlayerZone(playerId, "hand");
    const card = zone.cards[0];
    if (!card) {
      throw new Error(`No cards found in hand for player ${playerId}`);
    }
    return card;
  }

  assertThatZonesContain(
    zones: Partial<Record<Zones, number>>,
    playerId?: string,
  ) {
    expect(this.getZonesCardCount(playerId)).toEqual(
      expect.objectContaining(zones),
    );
  }
}
