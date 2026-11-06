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
import { saveWord } from "@/lib/server-fns";

const EMPTY = {
  term: "",
  partOfSpeech: "",
  definition: "",
  synonyms: "",
  antonyms: "",
};

export default function WordFormDialog({ open, onOpenChange, initial, defaultUnit, units, onSaved }) {
  const [unit, setUnit] = useState(defaultUnit || "Lesson 1");
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setUnit(initial?.unit || defaultUnit || "Lesson 1");
    setForm(
      initial
        ? {
            term: initial.term || "",
            partOfSpeech: initial.partOfSpeech || "",
            definition: initial.definition || "",
            synonyms: (initial.synonyms || []).join(", "),
            antonyms: (initial.antonyms || []).join(", "),
          }
        : EMPTY
    );
  }, [open, initial, defaultUnit]);

  const mutation = useMutation({
    mutationFn: (payload) => saveWord({ data: payload }),
    onSuccess: () => {
      onSaved();
      onOpenChange(false);
    },
    onError: (err) => setError(err?.message || "That word could not be saved."),
  });

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.term.trim() || !unit.trim()) {
      setError("A word needs a unit and the word itself.");
      return;
    }
    mutation.mutate({
      id: initial?.id,
      unit: unit.trim(),
      word: {
        term: form.term,
        partOfSpeech: form.partOfSpeech,
        definition: form.definition,
        synonyms: form.synonyms.split(/[,;]/).map((s) => s.trim()).filter(Boolean),
        antonyms: form.antonyms.split(/[,;]/).map((s) => s.trim()).filter(Boolean),
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal">
            {initial ? "Edit word" : "Add a word"}
          </DialogTitle>
          <DialogDescription>
            Only the word and its unit are required — the rest builds more question types.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-2 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="word-term">Word</Label>
              <Input id="word-term" value={form.term} onChange={set("term")} placeholder="benevolent" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="word-pos">Part of speech</Label>
              <Input
                id="word-pos"
                value={form.partOfSpeech}
                onChange={set("partOfSpeech")}
                placeholder="adj."
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="word-unit">Unit</Label>
              <Input
                id="word-unit"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="Lesson 5"
                list="word-units"
              />
              <datalist id="word-units">
                {units.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="word-definition">Definition</Label>
            <Textarea
              id="word-definition"
              value={form.definition}
              onChange={set("definition")}
              rows={2}
              placeholder="kind and wanting to help others"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="word-synonyms">Synonyms</Label>
              <Input
                id="word-synonyms"
                value={form.synonyms}
                onChange={set("synonyms")}
                placeholder="kindhearted, generous"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="word-antonyms">Antonyms</Label>
              <Input
                id="word-antonyms"
                value={form.antonyms}
                onChange={set("antonyms")}
                placeholder="cruel, spiteful"
              />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="rounded-full">
              {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {initial ? "Save changes" : "Add word"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}