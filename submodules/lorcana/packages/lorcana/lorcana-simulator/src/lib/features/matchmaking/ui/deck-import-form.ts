export function canSubmitDeckImport(params: {
  activeProfileId: string | null;
  deckName: string;
  deckText: string;
  submitting: boolean;
}): boolean {
  return (
    !params.submitting &&
    params.activeProfileId !== null &&
    params.deckName.trim().length > 0 &&
    params.deckText.trim().length > 0
  );
}
