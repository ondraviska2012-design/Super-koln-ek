"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import { TodoInput } from "@/components/todo-input";
import { TodoItem } from "@/components/todo-item";

type Filter = "all" | "active" | "done";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Vše" },
  { value: "active", label: "Zbývá" },
  { value: "done", label: "Hotovo" },
];

function pluralize(count: number) {
  if (count === 1) return "úkol";
  if (count >= 2 && count <= 4) return "úkoly";
  return "úkolů";
}

export function TodoApp() {
  const { todos, addTodo, toggleTodo, editTodo, deleteTodo, clearDone } = useTodos();
  const [filter, setFilter] = useState<Filter>("all");

  const remaining = todos.filter((todo) => !todo.done).length;
  const doneCount = todos.length - remaining;
  const visible = todos.filter((todo) =>
    filter === "all" ? true : filter === "active" ? !todo.done : todo.done,
  );

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-5 py-12 sm:py-16">
      <header className="flex flex-col items-start gap-3">
        <p className="-rotate-2 bg-accent px-3 py-1 font-comic text-lg tracking-widest text-black">
          Můj seznam
        </p>
        <h1 className="font-graffiti text-6xl leading-none text-white sm:text-8xl">
          Úkolníček
        </h1>
        <p className="font-comic text-xl tracking-wide text-white/70" aria-live="polite">
          {todos.length === 0
            ? "Zatím nic. Začni psát!"
            : `${remaining} ${pluralize(remaining)} zbývá · ${doneCount} hotovo`}
        </p>
      </header>

      <TodoInput onAdd={addTodo} />

      {todos.length > 0 && (
        <nav aria-label="Filtr úkolů" className="flex flex-wrap items-center gap-3">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`border-4 px-4 py-1 font-comic text-xl tracking-wider transition-colors focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                filter === value
                  ? "border-accent bg-accent text-black"
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              {label}
            </button>
          ))}
          {doneCount > 0 && (
            <button
              type="button"
              onClick={clearDone}
              className="ml-auto font-comic text-xl tracking-wider text-white/70 underline decoration-2 underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              Smazat hotové
            </button>
          )}
        </nav>
      )}

      {visible.length > 0 ? (
        <ul className="flex flex-col gap-5">
          {visible.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      ) : (
        todos.length > 0 && (
          <p className="font-comic text-2xl tracking-wide text-white/50">
            {filter === "done" ? "Ještě nic není hotové." : "Všechno hotovo. Paráda!"}
          </p>
        )
      )}

      <footer className="mt-auto pt-8 font-comic text-base tracking-wide text-white/40">
        Dvojklikem na úkol ho upravíš. Uloženo v tvém prohlížeči.
      </footer>
    </main>
  );
}
