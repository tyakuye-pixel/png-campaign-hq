import { SupportLevelBadge } from "@/components/SupportLevelBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type Electorate,
  SUPPORT_LEVELS,
  type SupportLevel,
  supportLevelDescription,
  supportLevelLabel,
} from "@/lib/electorates";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Pencil, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CampaignStatusPanelProps {
  electorate: Electorate;
  isAdmin: boolean;
  isSaving: boolean;
  error: string | null;
  onSave: (details: {
    supportLevel: SupportLevel;
    campaignManager: string;
    notes: string;
  }) => void;
}

export function CampaignStatusPanel({
  electorate,
  isAdmin,
  isSaving,
  error,
  onSave,
}: CampaignStatusPanelProps) {
  const [editing, setEditing] = useState(false);
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(
    electorate.supportLevel,
  );
  const [campaignManager, setCampaignManager] = useState(
    electorate.campaignManager,
  );
  const [notes, setNotes] = useState(electorate.notes);
  const wasSaving = useRef(false);

  // Close the editor only after a save that actually succeeded. A failed
  // mutation leaves the form open so the admin can retry.
  useEffect(() => {
    if (wasSaving.current && !isSaving && !error) {
      setEditing(false);
    }
    wasSaving.current = isSaving;
  }, [isSaving, error]);

  function startEditing() {
    setSupportLevel(electorate.supportLevel);
    setCampaignManager(electorate.campaignManager);
    setNotes(electorate.notes);
    setEditing(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ supportLevel, campaignManager: campaignManager.trim(), notes });
  }

  return (
    <section
      data-ocid="electorate.campaign_panel"
      className="rounded-lg border border-border bg-card shadow-subtle"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">
            Campaign Status
          </h2>
          <p className="text-xs text-muted-foreground">
            Support position, manager, and field notes
          </p>
        </div>
        {isAdmin && !editing ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="electorate.edit_button"
            onClick={startEditing}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
        ) : null}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="support-level">Support level</Label>
            <Select
              value={supportLevel}
              onValueChange={(value) => setSupportLevel(value as SupportLevel)}
            >
              <SelectTrigger
                id="support-level"
                data-ocid="electorate.support_select"
                className="w-full"
              >
                <SelectValue placeholder="Select support level" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORT_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {supportLevelLabel(level)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {supportLevelDescription(supportLevel)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-manager">Campaign manager</Label>
            <Input
              id="campaign-manager"
              data-ocid="electorate.manager_input"
              value={campaignManager}
              onChange={(event) => setCampaignManager(event.target.value)}
              placeholder="Assign a campaign manager"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-notes">Notes</Label>
            <Textarea
              id="campaign-notes"
              data-ocid="electorate.notes_textarea"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Context, risks, and follow-ups for this electorate"
              rows={4}
            />
          </div>

          {error ? (
            <p
              role="alert"
              data-ocid="electorate.save_error"
              className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
              {error}
            </p>
          ) : null}

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              size="sm"
              data-ocid="electorate.save_button"
              disabled={isSaving}
            >
              <Check className="size-3.5" />
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-ocid="electorate.cancel_button"
              onClick={() => setEditing(false)}
              disabled={isSaving}
            >
              <X className="size-3.5" />
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <p className="label-caps">Support level</p>
            <div className="flex flex-wrap items-center gap-3">
              <SupportLevelBadge
                level={electorate.supportLevel}
                className="text-sm"
              />
              <span className="text-sm text-muted-foreground">
                {supportLevelDescription(electorate.supportLevel)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="label-caps">Campaign manager</p>
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <UserRound className="size-4 text-muted-foreground" />
              {electorate.campaignManager.trim() || (
                <span className="font-normal text-muted-foreground">
                  Unassigned
                </span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <p className="label-caps">Notes</p>
            <p
              className={cn(
                "whitespace-pre-wrap text-sm leading-relaxed",
                electorate.notes.trim()
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {electorate.notes.trim() || "No campaign notes recorded yet."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
