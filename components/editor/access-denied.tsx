import Link from "next/link";
import { Lock } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated">
        <Lock className="h-5 w-5 text-copy-muted" />
      </div>
      <h1 className="font-semibold text-copy-primary">Access denied</h1>
      <p className="text-sm text-copy-muted">
        This project doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link href="/editor" className="text-sm text-brand hover:underline">
        Back to editor
      </Link>
    </div>
  );
}
