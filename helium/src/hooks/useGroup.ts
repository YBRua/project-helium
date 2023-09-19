import { useState } from "react";

export interface IPersonEntry {
  name: string;
  weekday: number;
  time: number;
}

export function personEntryToString(personEntry: IPersonEntry) {
  return `${personEntry.name}-${personEntry.weekday}-${personEntry.time}`;
}

export function useGroups(init: Map<string, number>) {
  const maxGroupId: number = 9;

  const [groups, setGroupsData] = useState(init);

  const cycleGroups = (personEntry: IPersonEntry, offset: number = 1) => {
    const personEntryString = personEntryToString(personEntry);
    setGroupsData((prev) => {
      const newGroups = new Map(prev);
      const groupId = newGroups.get(personEntryString);
      console.log(groupId);
      if (groupId === undefined) {
        newGroups.set(personEntryString, 0);
      } else {
        newGroups.set(personEntryString, (groupId + offset) % maxGroupId);
      }
      return newGroups;
    })
  }

  const unsetGroups = (personEntry: IPersonEntry) => {
    const personEntryString = personEntryToString(personEntry);
    setGroupsData((prev) => {
      const newGroups = new Map(prev);
      newGroups.delete(personEntryString);
      return newGroups;
    })
  }

  return [
    groups,
    cycleGroups,
    unsetGroups,
    setGroupsData,
  ] as const;
}