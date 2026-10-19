import { Loader } from "@mantine/core";
import { useEngine } from "../engine";
import classes from "./CommandFeedback.module.css";

/** Outside the animation boundary so pending feedback is visible and announced immediately. */
export function CommandFeedback() {
  const { hasPendingRemoteMove } = useEngine();
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className={classes.status}>
      {hasPendingRemoteMove && (
        <span className={classes.message} data-testid="command-feedback">
          <Loader size={14} color="yellow" aria-hidden="true" />
          Sending move…
        </span>
      )}
    </div>
  );
}
