import { createContext } from "react";
import type { EngineAction } from "../../engine";

export type PaymentAction = Extract<
  EngineAction,
  {
    type:
      | "playCard"
      | "callLegend"
      | "goSolo"
      | "activateAbility"
      | "resolveCardToPlay"
      | "resolveRedirectDefeat";
  }
>;

export interface PaymentSelectionContextValue {
  readonly paymentSelectionActive: boolean;
  readonly paymentCost: number;
  readonly selectedPaymentCount: number;
  /** Card instance awaiting payment, for the prompt's art thumbnail. */
  readonly paymentCardId: string | null;
  readonly eligiblePaymentSourceIds: ReadonlySet<string>;
  readonly selectedPaymentSourceIds: ReadonlySet<string>;
  /**
   * Settle the payment without further picks. Keeps any selected sources;
   * the engine pays the remainder automatically (Eddie pool first, then
   * Legends in spend priority).
   */
  readonly payAutomatically: () => void;
  readonly togglePaymentSource: (sourceId: string) => void;
  readonly cancelPaymentSelection: () => void;
  /** Route a costed action through the payment-selection gate. */
  readonly dispatchCostedAction: (action: PaymentAction) => boolean;
}

/** This module has no runtime engine imports, so hot updates retain context identity. */
export const PaymentSelectionContext = createContext<PaymentSelectionContextValue | null>(null);
