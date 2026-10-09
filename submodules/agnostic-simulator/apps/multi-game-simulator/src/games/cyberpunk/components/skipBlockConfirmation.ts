export const SKIP_BLOCK_CONFIRMATION_EVENT = "cyberpunk:skip-block-confirmation";

export interface SkipBlockConfirmationEventDetail {
  armed: boolean;
}

export function announceSkipBlockConfirmation(armed: boolean): void {
  window.dispatchEvent(
    new CustomEvent<SkipBlockConfirmationEventDetail>(SKIP_BLOCK_CONFIRMATION_EVENT, {
      detail: { armed },
    }),
  );
}
