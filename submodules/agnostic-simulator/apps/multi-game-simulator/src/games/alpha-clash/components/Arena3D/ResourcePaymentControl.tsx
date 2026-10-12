import { useId } from "react";
import { Popover } from "@mantine/core";
import { ChevronDown } from "lucide-react";
import styles from "./resource-payment-control.module.css";

export function ResourcePaymentControl({
  automatic,
  onChange,
  compact = false,
}: {
  automatic: boolean;
  onChange: (automatic: boolean) => void;
  compact?: boolean;
}) {
  const id = useId();
  const choices = (
    <fieldset className={styles.choices}>
      <legend>Resource payment</legend>
      <p id={`${id}-hint`} className={styles.hint}>
        By default, we choose ready resources to pay the cost. You can choose them yourself.
      </p>
      <div className={styles.options}>
        {[
          { value: true, text: "Automatic" },
          { value: false, text: "Choose resources" },
        ].map(({ value, text }) => (
          <label
            key={text}
            className={styles.option}
            data-selected={automatic === value || undefined}
          >
            <input
              type="radio"
              name={`${id}-payment`}
              checked={automatic === value}
              onChange={() => onChange(value)}
              aria-describedby={`${id}-hint`}
            />
            {text}
          </label>
        ))}
      </div>
      {!automatic && <p className={styles.hint}>After you play, choose resources to pay.</p>}
    </fieldset>
  );
  if (!compact) return choices;
  return (
    <Popover position="bottom-end" withArrow trapFocus>
      <Popover.Target>
        <button
          type="button"
          className={styles.trigger}
          aria-label={`Resource payment: ${automatic ? "Automatic" : "Choose resources"}`}
        >
          <span>
            Payment: <b>{automatic ? "Automatic" : "Choose resources"}</b>
          </span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </Popover.Target>
      <Popover.Dropdown className={styles.dropdown}>{choices}</Popover.Dropdown>
    </Popover>
  );
}
