import type { MoveResponse } from "@lorcanito/lorcana-engine";
import { notEmptyPredicate } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { donaldDuckFlusteredSorcerer } from "@lorcanito/lorcana-engine/cards/007";
import { additionalInkwellEffectPredicate } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { CardStore } from "@lorcanito/lorcana-engine/store/CardStore";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import { ZoneModel } from "@lorcanito/lorcana-engine/store/models/ZoneModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import { calculateDynamicAmount } from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
import type {
  CardMovement,
  Table,
  TableTurn,
  TableZones,
  Zones,
} from "@lorcanito/lorcana-engine/types/types";
import { makeAutoObservable } from "mobx";

type TurnChallengeMeta = {
  damage: number;
  banished: boolean;
};

export type Turn = {
  cardsMoved: Array<CardMovement>;
  challenges: Array<{
    attacker: CardModel;
    defender: CardModel;
    meta: { defender: TurnChallengeMeta; attacker: TurnChallengeMeta };
  }>;
  damages: Record<string, boolean>;
  locations: Record<string, CardModel[]>;
  quests: TableTurn["quests"];
  abilities: TableTurn["abilities"];
};

export class TableModel {
  zones: Record<Zones, ZoneModel>;
  ownerId: string;
  lore: number;
  turn: Turn;
  private rootStore: MobXRootStore;

  constructor(
    zones: Record<Zones, ZoneModel>,
    ownerId: string,
    lore: number,
    turn: Turn,
    rootStore: MobXRootStore,
    observable: boolean,
  ) {
    if (observable) {
      makeAutoObservable<TableModel, "rootStore">(this, {
        rootStore: false,
      });
    }

    this.zones = zones;
    this.ownerId = ownerId;
    this.lore = lore || 0;
    this.turn = turn;

    this.rootStore = rootStore;
  }

  sync(table: Table) {
    this.lore = table.lore || 0;
    if (table.turn) {
      this.turn = {
        cardsMoved:
          table.turn.cardsMoved
            ?.map((move) => {
              const card = this.rootStore.cardStore.cards[move.card];

              if (!card) {
                return undefined;
              }

              return {
                ...move,
                card: card,
              };
            })
            .filter(notEmptyPredicate) || [],
        challenges:
          table.turn.challenges
            ?.map((challenge) => {
              const attacker =
                this.rootStore.cardStore.cards[challenge.attacker];
              const defender =
                this.rootStore.cardStore.cards[challenge.defender];

              if (!(attacker && defender)) {
                return undefined;
              }

              return {
                attacker: attacker,
                defender: defender,
                meta: challenge.meta,
              };
            })
            .filter(notEmptyPredicate) || [],
        locations: table?.turn?.locations
          ? Object.keys(table?.turn?.locations || {}).reduce(
              (acc, key) => {
                const cardsThatMovedToLocation = table?.turn?.locations?.[key];

                if (!cardsThatMovedToLocation) {
                  return acc;
                }

                acc[key] = cardsThatMovedToLocation
                  .map((cardInstanceId) =>
                    this.rootStore.cardStore.getCard(cardInstanceId),
                  )
                  .filter(notEmptyPredicate);

                return acc;
              },
              {} as Turn["locations"],
            )
          : {},
        quests: table.turn.quests || [],
        abilities: table.turn.abilities || [],
        damages: table.turn.damages || {},
      };
    } else {
      this.turn = {
        cardsMoved: [],
        challenges: [],
        locations: {},
        quests: [],
        abilities: [],
        damages: {},
      };
    }

    for (const zone of Object.values(this.zones)) {
      zone.sync(table.zones[zone.zone]);
    }
  }

  static fromTable(
    table: Table,
    ownerId: string,
    cardStore: CardStore,
    rootStore: MobXRootStore,
    observable = false,
  ): TableModel {
    const zones: Record<Zones, ZoneModel> = {
      hand: new ZoneModel(
        "hand",
        (table.zones?.hand
          ?.map((cardId) => cardStore.cards[cardId])
          .filter(Boolean) as CardModel[]) ?? [],
        ownerId,
        rootStore,
        observable,
      ),
      play: new ZoneModel(
        "play",
        (table.zones?.play
          ?.map((cardId) => cardStore.cards[cardId])
          .filter(Boolean) as CardModel[]) ?? [],
        ownerId,
        rootStore,
        observable,
      ),
      discard: new ZoneModel(
        "discard",
        (table.zones?.discard
          ?.map((cardId) => cardStore.cards[cardId])
          .filter(Boolean) as CardModel[]) ?? [],
        ownerId,
        rootStore,
        observable,
      ),
      deck: new ZoneModel(
        "deck",
        (table.zones?.deck
          ?.map((cardId) => cardStore.cards[cardId])
          .filter(Boolean) as CardModel[]) ?? [],
        ownerId,
        rootStore,
        observable,
      ),
      inkwell: new ZoneModel(
        "inkwell",
        (table.zones?.inkwell
          ?.map((cardId) => cardStore.cards[cardId])
          .filter(Boolean) as CardModel[]) ?? [],
        ownerId,
        rootStore,
        observable,
      ),
    };

    const initialTurn: Turn = {
      abilities: [],
      cardsMoved: [],
      challenges: [],
      locations: {},
      quests: [],
      damages: {},
    };

    const turnModel: TableModel["turn"] = table.turn
      ? {
          abilities: table.turn?.abilities || [],
          cardsMoved:
            table.turn.cardsMoved
              ?.map((move) => {
                const card = cardStore.getCard(move.card);

                if (!card) {
                  return undefined;
                }

                return {
                  ...move,
                  card: card,
                };
              })
              .filter(notEmptyPredicate) || [],
          challenges:
            table.turn.challenges
              ?.map((challenge) => {
                const attacker = cardStore.getCard(challenge.attacker);
                const defender = cardStore.getCard(challenge.defender);

                if (!(attacker && defender)) {
                  return undefined;
                }

                return {
                  attacker: attacker,
                  defender: defender,
                  meta: challenge.meta,
                };
              })
              .filter(notEmptyPredicate) || [],
          locations: table?.turn?.locations
            ? Object.keys(table.turn?.locations || {}).reduce(
                (acc, key) => {
                  const cardsThatMovedToLocation = table.turn?.locations?.[key];

                  if (!cardsThatMovedToLocation) {
                    return acc;
                  }

                  acc[key] = cardsThatMovedToLocation
                    .map((cardInstanceId) => cardStore.getCard(cardInstanceId))
                    .filter(notEmptyPredicate);

                  return acc;
                },
                {} as Turn["locations"],
              )
            : {},
          quests: table.turn.quests || [],
          damages: table.turn.damages || {},
        }
      : initialTurn;

    return new TableModel(
      zones,
      ownerId,
      table.lore || 0,
      turnModel,
      rootStore,
      observable,
    );
  }

  toJSON(): Table {
    const tableZones: TableZones = {
      hand: this.zones.hand.toJSON() || [],
      play: this.zones.play.toJSON() || [],
      discard: this.zones.discard.toJSON() || [],
      deck: this.zones.deck.toJSON() || [],
      inkwell: this.zones.inkwell.toJSON() || [],
    };

    const turn: TableTurn = {
      abilities: this.turn?.abilities || [],
      cardsMoved: this.turn.cardsMoved.map((move) => ({
        ...move,
        card: move.card.instanceId,
      })),
      challenges: this.turn.challenges.map((challenge) => ({
        attacker: challenge.attacker.instanceId,
        defender: challenge.defender.instanceId,
        meta: challenge.meta,
      })),
      locations: Object.keys(this.turn?.locations || {}).reduce(
        (acc, key) => {
          const locations = this.turn.locations || {};
          const cardsAtLocation = locations[key];

          if (!(locations && cardsAtLocation)) {
            return acc;
          }

          acc[key] = cardsAtLocation.map((card) => card.instanceId);

          return acc;
        },
        {} as NonNullable<TableTurn["locations"]>,
      ),
      quests: this.turn.quests,
      damages: this.turn.damages,
    };

    return {
      zones: tableZones,
      lore: this.lore || 0,
      turn: turn,
    };
  }

  // TODO: We should check here cost reduction, and that items pays costs
  canPayInkCost(
    card: CardModel,
    params: { shift?: number; byPass?: number } = {},
  ) {
    // TODO: this is complete garbage, fix this
    const cost = params.byPass || params.shift || card.cost;
    return this.inkAvailable() >= cost;
  }

  resetTurn() {
    const newTurn: Turn = {
      cardsMoved: [],
      challenges: [],
      abilities: [],
      quests: [],
      locations: {},
      damages: {},
    };
    this.turn = newTurn;
  }

  canAddToInkwell(): boolean {
    const additionalCards = this.rootStore.effectStore
      .getPlayerEffects(this.ownerId)
      .map((effect) =>
        additionalInkwellEffectPredicate(effect.effect)
          ? effect.effect
          : undefined,
      )
      .filter(notEmptyPredicate)
      .reduce((acc, effect) => {
        return (
          acc +
          calculateDynamicAmount(
            effect.amount || 0,
            this.rootStore,
            [],
            undefined,
          )
        );
      }, 0);

    // TODO: Yeah I know this is hacky
    const bellesInPlay = this.zones.play.cards.filter(
      (card) => card.fullName.toLowerCase() === "belle - strange but special",
    ).length;
    const limit = additionalCards + bellesInPlay + 1;

    return (
      this.turn.cardsMoved.filter(
        (move) =>
          move.from === "hand" &&
          move.to === "inkwell" &&
          move.how === "inkwell",
      ).length < limit
    );
  }

  get opponentHasDonalDuckFlutteringWizard() {
    const opponent = this.rootStore.opponentPlayer(this.ownerId);
    const opponentTable = this.rootStore.cardStore.characterCardsInPlay.find(
      (card) =>
        card.publicId === donaldDuckFlusteredSorcerer.id &&
        card.ownerId === opponent,
    );

    return !!this.rootStore.cardStore.characterCardsInPlay.find(
      (card) =>
        card.publicId === donaldDuckFlusteredSorcerer.id &&
        card.ownerId === opponent,
    );
  }

  hasChallengedThisTurn(glimmer: CardModel) {
    return this.turn.challenges.some(
      (challenge) =>
        challenge.attacker.instanceId === glimmer.instanceId ||
        challenge.defender.instanceId === glimmer.instanceId,
    );
  }

  hasUsedAbility(name: string, sourceId: string) {
    if (!this.turn.abilities) {
      return false;
    }

    return this.turn.abilities.some(
      (ability) => ability.ability === name && ability.card === sourceId,
    );
  }

  addUsedAbility(name: string, sourceId: string) {
    if (this.turn.abilities) {
      this.turn.abilities.push({
        card: sourceId,
        ability: name,
      });
    } else {
      this.turn.abilities = [
        {
          card: sourceId,
          ability: name,
        },
      ];
    }
  }

  cardMoved(movement: CardMovement) {
    this.turn.cardsMoved.push(movement);
  }

  inkAvailable() {
    return this.zones.inkwell.inkAvailable();
  }

  // TODO: This is not triggering discard effect
  // prince john greediest of all, does not trigger
  moveCard(
    card: CardModel,
    to: Zones,
    position: "first" | "last" = "last",
    skipLog?: boolean,
    discard?: boolean,
    attacker?: CardModel,
    defender?: CardModel,
    effectSource?: CardModel,
    opts: {
      triggerDraw?: boolean;
      movedHow?: CardMovement["how"];
      isPrivate?: boolean;
    } = {},
  ): MoveResponse {
    const from = card.zone;
    const fromZone = this.zones[from];

    const leavesPlay = card.zone === "play" && to !== "play";
    const returnsToHand = card.zone === "discard" && to === "hand";
    const isBanish = card.zone === "play" && to === "discard";
    const isDiscard = card.zone === "hand" && to === "discard" && discard;
    const isCardDraw = card.zone === "deck" && to === "hand";
    const isPutIntoInkwell = to === "inkwell";

    if (!fromZone.hasCard(card)) {
      return this.rootStore.sendNotification({
        type: "icon",
        title: "Card not found in zone",
        message: "Card not found in zone",
        icon: "warning",
        autoClear: true,
      });
    }

    if (from === to && from !== "deck") {
      return this.rootStore.moveResponse(true);
    }

    // TODO: confirm ruling
    // if (shifted && shifted.instanceId !== card.instanceId) {
    //   this.moveCard(shifted, "discard", "last", isDiscard);
    // }
    const shifted = card.shiftedCharacter;
    if (shifted && shifted.instanceId !== card.instanceId) {
      this.moveCard(shifted, to, "last", isDiscard);
    }

    if (!skipLog) {
      this.rootStore.log({
        type: "MOVE_CARD",
        instanceId: card.instanceId,
        from: from,
        to,
        position,
        owner: card.ownerId,
        isPrivate: opts.isPrivate,
      });
    }

    if (leavesPlay) {
      this.rootStore.triggeredStore.onLeavePlay(card, to, from);
    }
    // TODO: We can simplify this trigger, instead of having one per combination of zones, we can have one that triggers on move
    // fixitFelixJrPintsizedHero
    if (returnsToHand) {
      // this.rootStore.triggeredStore.onReturnToHand(card);
      this.rootStore.triggeredStore.onLeavePlay(card, to, from);
    }

    fromZone.removeCard(card);
    this.zones[to].addCard(card, position);
    this.removeDuplicates(card, to);

    if (isBanish) {
      this.rootStore.cardStore.addToTemporary(this.rootStore.moveCount, card);
      this.rootStore.triggeredStore.onBanish(card, { attacker, defender });
    }

    if (isDiscard) {
      this.rootStore.triggeredStore.onDiscard(card);
    }

    if (isPutIntoInkwell) {
      this.rootStore.tableStore
        .getTable(card.ownerId)
        .turn.cardsMoved.push({ card, from, to, how: opts.movedHow });
      this.rootStore.triggeredStore.onPutIntoInkwell(card);
    }

    if (opts.triggerDraw && isCardDraw) {
      this.rootStore.triggeredStore.onDraw(card, effectSource);
    }

    try {
      if (card.type === "location") {
        const charactersAtLocation = card.meta.characters || [];
        for (const character of charactersAtLocation) {
          this.rootStore.cardStore.getCard(character)?.leaveLocation();
        }
      }

      if (card.type === "character") {
        card.leaveLocation();
      }
    } catch (e) {
      console.error(e);
      this.rootStore.debug("Error leaving location");
    }

    const isRevealed = card.meta.revealed;
    card.meta.resetMeta();

    if (isRevealed) {
      card.updateCardMeta({
        revealed: true,
      });
    }

    if (["play", "inkwell"].includes(to)) {
      card.updateCardMeta({
        playedThisTurn: true,
      });
    }

    if (isBanish || leavesPlay || returnsToHand) {
      this.rootStore.continuousEffectStore.onLeave(card);
    }

    return this.rootStore.moveResponse(true);
  }

  onEnterLocation(
    character: CardModel,
    location: CardModel,
    previousLocation?: CardModel,
  ) {
    const turnLocation = this.turn.locations[location.instanceId];

    if (turnLocation) {
      turnLocation.push(character);
    } else {
      this.turn.locations[location.instanceId] = [character];
    }
  }

  onQuest(character: CardModel) {
    if (this.turn.quests) {
      this.turn.quests.push(character.instanceId);
    } else {
      this.turn.quests = [character.instanceId];
    }
  }

  onDamage(card: CardModel, damageDealt: number) {
    if (!this.turn.damages) {
      this.turn.damages = {};
    }

    this.turn.damages[card.instanceId] = true;
  }

  removeDuplicates(card: CardModel, ignoreZone: Zones) {
    for (const zone of Object.keys(this.zones || {}) as Zones[]) {
      const aZone = this.zones[zone];

      if (zone !== ignoreZone && aZone.hasCard(card)) {
        aZone.removeCard(card);

        this.rootStore.debug("Removing duplicates!!! ", zone, card.instanceId);
      }
    }
  }

  updateLore(lore: number) {
    const prevLore = this.lore || 0;

    const hasRestriction = this.rootStore.effectStore.hasGainLoreRestriction(
      this.ownerId,
    );

    if (Number.isNaN(lore)) {
      return this.rootStore.moveResponse(true);
    }

    if (hasRestriction) {
      return this.rootStore.log({
        type: "LORE_CHANGE",
        player: this.ownerId,
        restrictedBy: hasRestriction.source?.instanceId,
        from: prevLore,
        to: lore < 0 ? 0 : lore,
      });
    }

    this.lore = lore < 0 ? 0 : lore;
    return this.rootStore.log({
      type: "LORE_CHANGE",
      player: this.ownerId,
      from: prevLore,
      to: lore,
    });
  }
}
