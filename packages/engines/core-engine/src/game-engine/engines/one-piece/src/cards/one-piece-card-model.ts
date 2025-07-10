/**
 * One Piece Card Model
 *
 * Enhanced card model that provides additional querying capabilities
 * and game-specific functionality for One Piece TCG cards.
 */

import type { OnePieceEngine } from "../one-piece-engine";
import type { ZoneType } from "../one-piece-engine-types";
import type { OnePieceCard } from "../one-piece-generic-types";

export class OnePieceModel {
  private engine: OnePieceEngine;
  private card: OnePieceCard;
  private instanceId: string;

  constructor({
    engine,
    card,
    instanceId,
  }: {
    engine: OnePieceEngine;
    card: OnePieceCard;
    instanceId: string;
  }) {
    this.engine = engine;
    this.card = card;
    this.instanceId = instanceId;
  }

  /**
   * ### Card Properties
   */

  get id() {
    return this.card.id;
  }

  get name() {
    return this.card.name;
  }

  get category() {
    return this.card.category;
  }

  get colors() {
    return this.card.colors;
  }

  get cost() {
    return this.card.cost;
  }

  get power() {
    if (this.card.category === "leader" || this.card.category === "character") {
      return this.card.power;
    }
    return undefined;
  }

  get life() {
    if (this.card.category === "leader") {
      return this.card.life;
    }
    return undefined;
  }

  get attribute() {
    if (this.card.category === "leader" || this.card.category === "character") {
      return this.card.attribute;
    }
    return undefined;
  }

  get counter() {
    if (this.card.category === "character" || this.card.category === "event") {
      return this.card.counter;
    }
    return undefined;
  }

  get text() {
    return this.card.text;
  }

  get types() {
    return this.card.types || [];
  }

  get set() {
    return this.card.set;
  }

  get rarity() {
    return this.card.rarity;
  }

  get implemented() {
    return this.card.implemented;
  }

  /**
   * ### Instance Properties
   */

  get instanceIdentifier() {
    return this.instanceId;
  }

  get owner() {
    return this.engine.getCardOwner(this.instanceId);
  }

  get zone(): ZoneType | undefined {
    return this.engine.getCardZone(this.instanceId);
  }

  /**
   * ### Card Type Checks
   */

  get isLeader() {
    return this.card.category === "leader";
  }

  get isCharacter() {
    return this.card.category === "character";
  }

  get isEvent() {
    return this.card.category === "event";
  }

  get isStage() {
    return this.card.category === "stage";
  }

  get isDon() {
    return this.card.category === "don";
  }

  /**
   * ### Color Checks
   */

  get isRed() {
    return this.colors.includes("red" as any);
  }

  get isGreen() {
    return this.colors.includes("green" as any);
  }

  get isBlue() {
    return this.colors.includes("blue" as any);
  }

  get isPurple() {
    return this.colors.includes("purple" as any);
  }

  get isBlack() {
    return this.colors.includes("black" as any);
  }

  get isYellow() {
    return this.colors.includes("yellow" as any);
  }

  get isColorless() {
    return this.colors.length === 0;
  }

  get isMulticolor() {
    return this.colors.length > 1;
  }

  /**
   * ### Zone Checks
   */

  get isInHand() {
    return this.zone === "hand";
  }

  get isInPlay() {
    return (
      this.zone === "leaderArea" ||
      this.zone === "characterArea" ||
      this.zone === "stageArea"
    );
  }

  get isInDeck() {
    return this.zone === "deck";
  }

  get isInTrash() {
    return this.zone === "trash";
  }

  get isInCostArea() {
    return this.zone === "costArea";
  }

  get isInLifeArea() {
    return this.zone === "lifeArea";
  }

  /**
   * ### Gameplay Checks
   */

  hasKeyword(keyword: string): boolean {
    return this.text?.toLowerCase().includes(keyword.toLowerCase());
  }

  hasType(type: string): boolean {
    return this.types.includes(type);
  }

  hasColor(color: string): boolean {
    return this.colors.some((c) => c === color);
  }

  canAttack(): boolean {
    return this.isLeader || this.isCharacter;
  }

  canBlock(): boolean {
    return this.isCharacter && this.hasKeyword("blocker");
  }

  hasRush(): boolean {
    return this.hasKeyword("rush");
  }

  hasDoubleAttack(): boolean {
    return this.hasKeyword("double attack");
  }

  hasBanish(): boolean {
    return this.hasKeyword("banish");
  }

  /**
   * ### Deck Construction Checks
   */

  canBeInDeck(): boolean {
    return !(this.isLeader || this.isDon);
  }

  isCompatibleWithLeader(leaderColors: string[]): boolean {
    if (this.isColorless) return true;
    return this.colors.some((color) => leaderColors.includes(color));
  }

  /**
   * ### Utility Methods
   */

  toString(): string {
    return `${this.name} (${this.id})`;
  }

  toJSON() {
    return {
      ...this.card,
      instanceId: this.instanceId,
      owner: this.owner,
      zone: this.zone,
    };
  }
}
