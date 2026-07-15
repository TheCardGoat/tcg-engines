class CardHoverCardRegistry {
  activeKey = $state<symbol | null>(null);

  open(key: symbol): void {
    this.activeKey = key;
  }

  close(key: symbol): void {
    if (this.activeKey === key) {
      this.activeKey = null;
    }
  }
}

export const cardHoverCardRegistry = new CardHoverCardRegistry();
