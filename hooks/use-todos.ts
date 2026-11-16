"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

const STORAGE_KEY = "ukolnicek:todos";
const EMPTY: Todo[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedTodos: Todo[] = EMPTY;

function readTodos(): Todo[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedTodos;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedTodos = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedTodos = EMPTY;
  }
  return cachedTodos;
}

function writeTodos(todos: Todo[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTodos() {
  const todos = useSyncExternalStore(subscribe, readTodos, () => EMPTY);

  const update = useCallback((fn: (current: Todo[]) => Todo[]) => {
    writeTodos(fn(readTodos()));
  }, []);

  const addTodo = useCallback(
    (text: string) =>
      update((current) => [
        { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() },
        ...current,
      ]),
    [update],
  );

  const toggleTodo = useCallback(
    (id: string) =>
      update((current) =>
        current.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo,
        ),
      ),
    [update],
  );

  const editTodo = useCallback(
    (id: string, text: string) =>
      update((current) =>
        current.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
      ),
    [update],
  );

  const deleteTodo = useCallback(
    (id: string) => update((current) => current.filter((todo) => todo.id !== id)),
    [update],
  );

  const clearDone = useCallback(
    () => update((current) => current.filter((todo) => !todo.done)),
    [update],
  );

  return { todos, addTodo, toggleTodo, editTodo, deleteTodo, clearDone };
}
