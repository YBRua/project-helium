import React from "react";

import "../../styles/persons.scss";

export function Person(props: {
  name: string;
  selectedPerson: string;
  setSelectedPerson: (selected: string) => void;
}) {
  const { name, selectedPerson, setSelectedPerson } = props;
  const isSelected = selectedPerson === name;
  const extraClass = isSelected ? "person--selected" : "";
  return (
    <div className={"person--item " + extraClass}>
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
