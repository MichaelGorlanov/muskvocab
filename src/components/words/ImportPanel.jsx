import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { importWords } from "@/lib/server-fns";
import { parseWordBlock, SAMPLE_IMPORT } from "@/lib/parseWords";

export default function ImportPanel({ open, onOpenChange, defaultUnit, units, onSaved }) {
  const [unit, setUnit] = useState(defaultUnit || "Unit 1");
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setUnit(defaultUnit || "Unit 1");
    setText("");
  }, [open, defaultUnit]);

  const { rows, problems } = parseWordBlock(text);

  const mutation = useMutation({
    mutationFn: (payload) => importWords({ data: payload }),
    onSuccess: () => {
      onSaved();
      onOpenChange(false);
    },
    onError: (err) => setError(err?.message || "Those words could not be imported."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">Paste your list</DialogTitle>
          <DialogDescription>
            One word per line, columns separated by a pipe or a tab: word | definition | synonyms |
            antonyms | root | root meaning. Anything after the word is optional.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4">
          <div className="grid gap-1.5 sm:max-w-[220px]">
            <Label htmlFor="import-unit">Add to unit</Label>
            <Input
              id="import-unit"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              list="import-units"
              placeholder="Unit 1"
            />
            <datalist id="import-units">
              {units.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="import-text">Words</Label>
            <Textarea
              id="import-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={10}
              className="font-mono text-xs leading-relaxed"
              placeholder={SAMPLE_IMPORT}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              <span className="font-mono text-foreground">{rows.length}</span> ready to import
            </span>
            {problems.length ? (
              <span className="text-destructive">
                {problems.length} line{problems.length === 1 ? "" : "s"} skipped — no second column
              </span>
            ) : null}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!rows.length || !unit.trim() || mutation.isPending}
              onClick={() => mutation.mutate({ unit: unit.trim(), words: rows })}
              className="rounded-full"
            >
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Import {rows.length || ""} words
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}