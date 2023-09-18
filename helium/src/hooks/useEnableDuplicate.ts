import { useState } from "react";


export function useEnableDuplicate(init: Map<string, boolean>) {
  const [enableDuplicate, setEnableDuplicate] = useState(init);

  const setEnableDuplicatePersons = (persons: string[]) => {
    const newSet = new Map<string, boolean>();
    persons.forEach((person) => {
      newSet.set(person, false);
    });
    setEnableDuplicate(newSet);
  }

  const toggleEnableDuplicate = (person: string) => {
    setEnableDuplicate((prev) => {
      const newSet = new Map(prev);
      newSet.set(person, !newSet.get(person));
      return newSet;
    });
  }

  return [
    enableDuplicate,
    setEnableDuplicatePersons,
    toggleEnableDuplicate,
  ] as const;
}