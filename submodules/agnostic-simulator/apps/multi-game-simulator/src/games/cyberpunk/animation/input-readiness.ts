/** Visual playback can overlap commands once the displayed state is current. */
export function isCyberpunkPresentationPending(
  presentationVersion: number | null,
  authoritativeVersion: number,
): boolean {
  // Equality also covers rollback/sync; an older authoritative version is not
  // interchangeable with a newer displayed version.
  return presentationVersion !== authoritativeVersion;
}
