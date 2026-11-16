"use client";

import { useState, type KeyboardEvent } from "react";
import type { Todo } from "@/hooks/use-todos";

type TodoItemProps = {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

const TILTS = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-[0.5deg]", "rotate-[0.75deg]"];

export function TodoItem({ todo, index, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const tilt = TILTS[index % TILTS.length];

  function commit() {
    const text = draft.trim();
    if (text) onEdit(todo.id, text);
    else setDraft(todo.text);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      if (event.nativeEvent.isComposing || event.keyCode === 229) return;
      commit();
    } else if (event.key === "Escape") {
      setDraft(todo.text);
      setIsEditing(false);
    }
  }

  return (
    <li
      className={`group flex items-center gap-4 border-4 border-black bg-white px-4 py-3 text-black shadow-[6px_6px_0_0_var(--accent)] ${tilt} transition-transform hover:rotate-0`}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        aria-pressed={todo.done}
        aria-label={todo.done ? `Označit „${todo.text}“ jako nehotové` : `Označit „${todo.text}“ jako hotové`}
        className={`flex size-9 shrink-0 items-center justify-center rounded-full border-4 border-black font-comic text-xl leading-none transition-colors focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black ${
          todo.done ? "bg-black text-accent" : "bg-white text-transparent hover:bg-accent"
        }`}
      >
        <span aria-hidden="true">✓</span>
      </button>

      {isEditing ? (
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          maxLength={140}
          aria-label="Upravit úkol"
          className="min-w-0 flex-1 border-b-4 border-black bg-transparent font-comic text-2xl tracking-wide focus:outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => {
            setDraft(todo.text);
            setIsEditing(true);
          }}
          className={`min-w-0 flex-1 break-words font-comic text-2xl tracking-wide ${
            todo.done ? "text-black/40 line-through decoration-4" : ""
          }`}
        >
          {todo.text}
        </span>
      )}

      <div className="flex shrink-0 gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => {
            setDraft(todo.text);
            setIsEditing(true);
          }}
          aria-label={`Upravit „${todo.text}“`}
          className="px-2 font-comic text-lg tracking-wider underline decoration-2 underline-offset-4 hover:text-black/60 focus-visible:outline-2 focus-visible:outline-black"
        >
          Upravit
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`Smazat „${todo.text}“`}
          className="flex size-9 items-center justify-center border-4 border-black bg-black font-comic text-xl leading-none text-white hover:bg-accent hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </li>
  );
}
