/**
 * Tracks the opponent's AFK / inactivity status.
 * Server broadcasts `player_activity` whenever the opponent's isAfk flag flips.
 *
 * Mirrors the class-based Svelte 5 rune pattern of OpponentPresenceTracker.
 */
export class OpponentAfkTracker {
  isAfk = $state(false);
  idle = $state(false);
  tabVisible = $state(true);

  handleActivityUpdate(msg: { isAfk: boolean; idle: boolean; tabVisible: boolean }): void {
    this.isAfk = msg.isAfk;
    this.idle = msg.idle;
    this.tabVisible = msg.tabVisible;
  }

  reset(): void {
    this.isAfk = false;
    this.idle = false;
    this.tabVisible = true;
  }
}
