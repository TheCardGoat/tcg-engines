import { Eye, LockKeyhole } from "lucide-react";
import { useId } from "react";

export function FabSpectatorNotice({ displayName }: { readonly displayName: string }) {
  const titleId = useId();
  return (
    <section className="fab-spectator-notice" aria-labelledby={titleId}>
      <div className="fab-spectator-notice-heading">
        <span className="fab-spectator-notice-icon" aria-hidden="true">
          <Eye size={17} strokeWidth={1.8} />
        </span>
        <div>
          <strong id={titleId}>Watching live</strong>
          <span>{displayName}’s perspective</span>
        </div>
      </div>
      <p className="fab-spectator-privacy">
        <LockKeyhole size={14} strokeWidth={1.8} aria-hidden="true" />
        Private cards stay hidden.
      </p>
    </section>
  );
}
