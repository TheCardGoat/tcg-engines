/** Persistent, dismissible action feedback shared by FAB match surfaces. */
export function FabActionNotice({
  title,
  message,
  onDismiss,
}: {
  readonly title: string;
  readonly message: string;
  readonly onDismiss: () => void;
}) {
  return (
    <section className="fab-practice-reversal-notice" role="alert">
      <span>
        <strong>{title}</strong>
        <span>{message}</span>
      </span>
      <button type="button" aria-label="Dismiss action notice" onClick={onDismiss}>
        Dismiss
      </button>
    </section>
  );
}
