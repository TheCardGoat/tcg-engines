import { X } from "lucide-react";

import { usePaymentSelection } from "./PaymentSelectionContext";
import classes from "./PaymentSelectionPrompt.module.css";

export function PaymentSelectionPrompt({
  surface = "desktop",
}: {
  surface?: "desktop" | "mobile";
}) {
  const { paymentSelectionActive, paymentCost, selectedPaymentCount, cancelPaymentSelection } =
    usePaymentSelection();

  if (!paymentSelectionActive) return null;

  const remaining = paymentCost - selectedPaymentCount;
  const sourceNoun = remaining === 1 ? "Eddie or Legend" : "Eddies or Legends";

  return (
    <section
      className={classes.root}
      data-surface={surface}
      aria-label="Choose payment"
      aria-live="polite"
    >
      <div className={classes.copy}>
        <strong>Choose payment</strong>
        <span>
          Select {remaining} ready {sourceNoun} on your board.
        </span>
      </div>
      <span
        className={classes.progress}
        aria-label={`${selectedPaymentCount} of ${paymentCost} selected`}
      >
        {selectedPaymentCount}/{paymentCost} €$
      </span>
      <button
        type="button"
        className={classes.cancel}
        onClick={cancelPaymentSelection}
        aria-label="Cancel payment selection"
      >
        <X size={16} aria-hidden="true" />
        <span>Cancel</span>
      </button>
    </section>
  );
}
