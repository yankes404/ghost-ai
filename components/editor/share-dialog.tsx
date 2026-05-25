"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Link, Loader2, Mail, Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PersonData {
  email: string;
  name: string | null;
  imageUrl: string | null;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [owner, setOwner] = useState<PersonData | null>(null);
  const [collaborators, setCollaborators] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchCollaborators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (res.ok) {
        const data = await res.json();
        setOwner(data.owner ?? null);
        setCollaborators(data.collaborators ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      fetchCollaborators();
      setInviteEmail("");
      setInviteError(null);
    }
  }, [open, fetchCollaborators]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      if (res.ok) {
        setInviteEmail("");
        await fetchCollaborators();
      } else {
        const data = await res.json().catch(() => ({}));
        setInviteError(data.error ?? "Failed to invite collaborator");
      }
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email);
    try {
      await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await fetchCollaborators();
    } finally {
      setRemovingEmail(null);
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/editor/${projectId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const totalPeople = (owner ? 1 : 0) + collaborators.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl bg-elevated border border-surface-border p-6 gap-0">
        <DialogHeader className="mb-5">
          <DialogTitle className="font-semibold text-copy-primary">
            Share project
          </DialogTitle>
          <p className="text-sm text-copy-muted">
            Invite collaborators, copy the workspace link, and manage access.
          </p>
        </DialogHeader>

        {/* Workspace link */}
        <div className="mb-5 flex items-center justify-between rounded-xl border border-surface-border bg-subtle px-4 py-3">
          <div>
            <p className="text-sm font-medium text-copy-primary">
              Workspace link
            </p>
            <p className="text-xs text-copy-muted mt-0.5">
              Share a direct link with teammates after you grant them access.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="ml-4 shrink-0 rounded-xl border-surface-border text-copy-secondary hover:text-copy-primary"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-state-success" />
                Copied!
              </>
            ) : (
              <>
                <Link className="h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>

        {/* Invite form — owners only */}
        {isOwner && (
          <form onSubmit={handleInvite} className="mb-5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-copy-muted pointer-events-none" />
                <Input
                  type="email"
                  placeholder="teammate@company.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setInviteError(null);
                  }}
                  disabled={inviting}
                  className="pl-9 rounded-xl bg-subtle border-surface-border text-copy-primary placeholder:text-copy-muted text-sm h-10"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={inviting || !inviteEmail.trim()}
                className="rounded-xl shrink-0 h-10 px-4"
              >
                {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Invite
              </Button>
            </div>
            {inviteError && (
              <p className="mt-2 text-xs text-state-error">{inviteError}</p>
            )}
          </form>
        )}

        {/* People with access */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-copy-primary">
              People with access
            </p>
            {totalPeople > 0 && (
              <span className="text-xs text-copy-muted">
                {totalPeople} total
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-copy-muted" />
            </div>
          ) : (
            <ul className="space-y-2">
              {owner && (
                <PersonRow
                  person={owner}
                  badge="OWNER"
                  badgeClass="bg-accent-dim text-brand border border-brand/20"
                />
              )}
              {collaborators.map((c) => (
                <PersonRow
                  key={c.email}
                  person={c}
                  badge="COLLABORATOR"
                  badgeClass="bg-subtle text-copy-muted border border-surface-border"
                  onRemove={isOwner ? () => handleRemove(c.email) : undefined}
                  removing={removingEmail === c.email}
                />
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PersonRowProps {
  person: PersonData;
  badge: string;
  badgeClass: string;
  onRemove?: () => void;
  removing?: boolean;
}

function PersonRow({
  person,
  badge,
  badgeClass,
  onRemove,
  removing,
}: PersonRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-surface-border bg-subtle px-3 py-2.5">
      <Avatar
        name={person.name}
        email={person.email}
        imageUrl={person.imageUrl}
      />
      <div className="flex-1 min-w-0">
        {person.name ? (
          <>
            <p className="text-sm font-medium text-copy-primary truncate">
              {person.name}
            </p>
            <p className="text-xs text-copy-muted truncate">{person.email}</p>
          </>
        ) : (
          <p className="text-sm text-copy-primary truncate">{person.email}</p>
        )}
      </div>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
      >
        {badge}
      </span>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          disabled={removing}
          aria-label={`Remove ${person.email}`}
          className="shrink-0 text-copy-muted hover:text-state-error hover:bg-state-error/10"
        >
          {removing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </li>
  );
}

function Avatar({
  name,
  email,
  imageUrl,
}: {
  name: string | null;
  email: string;
  imageUrl: string | null;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : email[0].toUpperCase();

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name ?? email}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div className="h-9 w-9 rounded-full bg-accent-dim border border-brand/20 flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-brand">{initials}</span>
    </div>
  );
}
