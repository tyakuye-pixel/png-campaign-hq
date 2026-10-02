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
  ActivityType,
  activityTypeLabel,
  dateInputToTimestamp,
} from "@/lib/electorates";
import { AlertCircle, CalendarDays, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.event,
  ActivityType.contact,
  ActivityType.note,
];

interface AddActivityFormProps {
  isSaving: boolean;
  error: string | null;
  onAdd: (input: {
    activityType: ActivityType;
    date: bigint;
    description: string;
  }) => void;
}

export function AddActivityForm({
  isSaving,
  error,
  onAdd,
}: AddActivityFormProps) {
  const [open, setOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>(
    ActivityType.event,
  );
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const wasSaving = useRef(false);

  const canSubmit = description.trim().length > 0 && date.length > 0;

  // Reset and close only after a save that actually succeeded. A failed
  // mutation keeps the form open with the entered values so it can be retried.
  useEffect(() => {
    if (wasSaving.current && !isSaving && !error) {
      setDescription("");
      setActivityType(ActivityType.event);
      setDate(new Date().toISOString().slice(0, 10));
      setOpen(false);
    }
    wasSaving.current = isSaving;
  }, [isSaving, error]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onAdd({
      activityType,
      date: dateInputToTimestamp(date),
      description: description.trim(),
    });
  }

  if (!open) {
    return (
      <Button
        type="button"
        size="sm"
        data-ocid="electorate.add_activity_button"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-3.5" />
        Add activity
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="electorate.activity_form"
      className="w-full space-y-4 rounded-lg border border-border bg-secondary/40 p-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="activity-type">Type</Label>
          <Select
            value={activityType}
            onValueChange={(value) => setActivityType(value as ActivityType)}
          >
            <SelectTrigger
              id="activity-type"
              data-ocid="electorate.activity_type_select"
              className="w-full"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {activityTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity-date">Date</Label>
          <Input
            id="activity-date"
            type="date"
            data-ocid="electorate.activity_date_input"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity-description">Description</Label>
        <Textarea
          id="activity-description"
          data-ocid="electorate.activity_description_textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What happened, who was contacted, and what comes next"
          rows={3}
        />
      </div>

      {error ? (
        <p
          role="alert"
          data-ocid="electorate.activity_error"
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
          data-ocid="electorate.activity_submit_button"
          disabled={isSaving || !canSubmit}
        >
          <CalendarDays className="size-3.5" />
          {isSaving ? "Recording…" : "Record activity"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-ocid="electorate.activity_cancel_button"
          onClick={() => setOpen(false)}
          disabled={isSaving}
        >
          <X className="size-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
