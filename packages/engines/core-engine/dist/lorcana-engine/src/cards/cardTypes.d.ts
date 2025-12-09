import type { Ability } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { CardColor } from "@lorcanito/shared/lorcana-engine";
import type { TargetFilter } from "../store/resolvers/filters";
export type { CardColor } from "@lorcanito/shared/lorcana-engine";
interface LorcanitoBaseCard {
    type: "character" | "item" | "action" | "location";
    missingTestCase?: boolean;
    notImplemented?: true;
    id: string;
    name: string;
    text?: string;
    flavour?: string;
    set: "TFC" | "ROF" | "ITI" | "URR" | "SSK" | "006" | "007" | "008";
    cost: number;
    colors: CardColor[];
    number: number;
    illustrator: string;
    inkwell?: boolean;
    characteristics: Array<Characteristics>;
    abilities?: Ability[] | {
        name?: string;
    }[];
    rarity: CardRarity;
    strength?: number;
    lore?: number;
    willpower?: number;
    title?: string;
    moveCost?: number;
    movementDiscounts?: {
        filters: TargetFilter[];
        amount: number;
    }[];
    cardCopyLimit?: number | "no-limit";
}
export interface LorcanitoLocationCard extends LorcanitoBaseCard {
    type: "location";
    title: string;
    lore?: number;
    moveCost: number;
    willpower: number;
    strength?: never;
}
export interface LorcanitoCharacterCard extends LorcanitoBaseCard {
    type: "character";
    title: string;
    lore: number;
    strength: number;
    cost: number;
    willpower: number;
    additionalNames?: string[];
}
export interface LorcanitoActionCard extends LorcanitoBaseCard {
    type: "action";
    title?: never;
    text: string;
}
export interface LorcanitoItemCard extends LorcanitoBaseCard {
    type: "item";
    title?: never;
    text: string;
    abilities: Ability[];
}
type CardRarity = "common" | "uncommon" | "rare" | "super_rare" | "legendary";
export type LorcanitoCard = LorcanitoLocationCard | LorcanitoCharacterCard | LorcanitoActionCard | LorcanitoItemCard;
export type Characteristics = "location" | "mage" | "song" | "madrigal" | "racer" | "robot" | "action" | "hyena" | "item" | "villain" | "knight" | "dragon" | "illusion" | "tigger" | "seven dwarfs" | "pirate" | "detective" | "sorcerer" | "queen" | "puppy" | "titan" | "alien" | "king" | "mentor" | "inventor" | "fairy" | "captain" | "hero" | "prince" | "storyborn" | "floodborn" | "dreamborn" | "broom" | "ally" | "princess" | "musketeer" | "deity";
export type Abilities = "singer" | "shift" | "challenger" | "sing-together" | "bodyguard" | "rush" | "reckless" | "evasive" | "resist" | "support" | "voiceless" | "ward" | "protector" | "vanish" | "meta" | "challenge_ready_chars";
//# sourceMappingURL=cardTypes.d.ts.map