import React from "react";

import "../../styles/persons.scss";
import { ITimeSlot } from "../../interfaces/timeslots";

export function Person(props: {
  name: string;
  selectedPerson: string;
  assigned: Map<string, ITimeSlot[]>;
  enableDuplicate: Map<string, boolean>;
  setSelectedPerson: (selected: string) => void;
  toggleEnableDuplicate: (person: string) => void;
}) {
  const {
    name,
    selectedPerson,
    assigned,
    enableDuplicate,
    setSelectedPerson,
    toggleEnableDuplicate,
  } = props;
  const isSelected = selectedPerson === name;
  const extraClass = isSelected ? "person--selected" : "";
  const duplicateEnabled = enableDuplicate.get(name) === true;
  const duplicateExtraClass = duplicateEnabled
    ? "person--duplicate-enabled"
    : "";

  return (
    <div className={"person--item " + extraClass}>
      <div
        className={"person--duplicate-toggle " + duplicateExtraClass}
        onClick={() => {
          toggleEnableDuplicate(name);
        }}
      >
        {duplicateEnabled ? `重复 (${assigned.get(name)?.length ?? 0})` : "单次"}
      </div>
      <div
        className="person--item-name"
        onClick={() => {
          if (isSelected) {
            setSelectedPerson("");
          } else {
            setSelectedPerson(name);
          }
        }}
      >
        {name}
      </div>
    </div>
  );
}
