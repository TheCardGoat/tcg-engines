import type { ReactNode } from "react";
import type { openingLayout } from "./layout";
import type { SimulatorAudioCueId } from "@tcg/protocol";

export interface OpeningCard {
  readonly id: string;
  readonly name: string;
  readonly imageUrl: string;
}
export interface OpeningBeat {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly duration?: number;
  readonly cue?: SimulatorAudioCueId;
  readonly leaders: "hidden" | "showcase" | "field";
  readonly hand: "deck" | "review" | "table" | "return";
  readonly localCount: number;
  readonly rivalCount: number;
  readonly replacement?: boolean;
  readonly action?: "order" | "hand" | "reveal";
}
/** Presentation fixture inputs. Game-native opening rules stay in each game folder. */
export interface OpeningFixture {
  readonly slug: string;
  readonly coinModelUrl?: string;
  readonly layout?: typeof openingLayout;
  readonly renderTable?: (size: { width: number; height: number }) => ReactNode;
  readonly handSummary?: string;
  readonly name: string;
  readonly accent: string;
  readonly leaders: readonly [OpeningCard, OpeningCard];
  readonly cards: readonly OpeningCard[];
  readonly health: number;
  readonly deckSize: number;
  readonly auxiliaryDeck?: {
    readonly label: string;
    readonly beforeReveal: number;
    readonly afterReveal: number;
  };
  readonly handSize: number;
  readonly orderChoice: boolean;
  readonly canMulligan: boolean;
  readonly rulesUrl: string;
  readonly initial: readonly OpeningBeat[];
  readonly afterOrder: (localFirst: boolean) => readonly OpeningBeat[];
  readonly afterHand: (localFirst: boolean, replacementCount: number) => readonly OpeningBeat[];
}

export const flightDuration = 720;
export const dealStagger = 100;
