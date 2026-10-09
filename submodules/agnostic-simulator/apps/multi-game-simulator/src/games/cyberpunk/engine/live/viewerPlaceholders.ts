export const VIEWER_UNKNOWN_CARD_DEFINITION_ID = "viewer:unknown-card";
export const VIEWER_UNKNOWN_LEGEND_DEFINITION_ID = "viewer:unknown-legend";

export function isViewerHiddenIdentityDefinitionId(definitionId: string): boolean {
  return (
    definitionId === VIEWER_UNKNOWN_CARD_DEFINITION_ID ||
    definitionId === VIEWER_UNKNOWN_LEGEND_DEFINITION_ID
  );
}
