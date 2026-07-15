/**
 * Tracks opponent connection status and manages the 30-second
 * disconnect countdown before allowing a drop.
 *
 * Uses server-authoritative `disconnectedAt` timestamps so
 * client and server agree on when the threshold elapses.
 */

const DROP_THRESHOLD_SECONDS = 30;

export class OpponentPresenceTracker {
  opponentConnected = $state(true);
  /** Server-authoritative disconnect timestamp (ms since epoch). */
  disconnectedAtMs = $state<number | null>(null);
  secondsRemaining = $state(DROP_THRESHOLD_SECONDS);
  canDrop = $derived(!this.opponentConnected && this.secondsRemaining <= 0);

  #countdownInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Handle a presence_change message from the server.
   */
  handlePresenceChange(status: "connected" | "disconnected", disconnectedAtIso?: string): void {
    if (status === "connected") {
      this.opponentConnected = true;
      this.disconnectedAtMs = null;
      this.secondsRemaining = DROP_THRESHOLD_SECONDS;
      this.#stopCountdown();
    } else {
      this.opponentConnected = false;
      this.disconnectedAtMs = disconnectedAtIso
        ? new Date(disconnectedAtIso).getTime()
        : Date.now();
      this.#updateSecondsRemaining();
      this.#startCountdown();
    }
  }

  dispose(): void {
    this.#stopCountdown();
  }

  #startCountdown(): void {
    this.#stopCountdown();
    this.#countdownInterval = setInterval(() => {
      this.#updateSecondsRemaining();
      if (this.secondsRemaining <= 0) {
        this.#stopCountdown();
      }
    }, 1000);
  }

  #stopCountdown(): void {
    if (this.#countdownInterval) {
      clearInterval(this.#countdownInterval);
      this.#countdownInterval = null;
    }
  }

  #updateSecondsRemaining(): void {
    if (this.disconnectedAtMs == null) {
      this.secondsRemaining = DROP_THRESHOLD_SECONDS;
      return;
    }
    const elapsedSec = Math.floor((Date.now() - this.disconnectedAtMs) / 1000);
    this.secondsRemaining = Math.max(0, DROP_THRESHOLD_SECONDS - elapsedSec);
  }
}
