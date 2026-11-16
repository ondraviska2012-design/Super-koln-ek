"use client";

import { useState, type FormEvent } from "react";

export function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onAdd(text);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <label htmlFor="new-todo" className="sr-only">
        Nový úkol
      </label>
      <input
        id="new-todo"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Napiš nový úkol..."
        autoComplete="off"
        maxLength={140}
        className="min-w-0 flex-1 -rotate-1 rounded-none border-4 border-white bg-black px-4 py-3 font-comic text-2xl tracking-wide text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        className="rotate-2 border-4 border-white bg-accent px-5 font-comic text-2xl tracking-wider text-black shadow-[5px_5px_0_0_#fff] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        Přidat!
      </button>
    </form>
  );
}
