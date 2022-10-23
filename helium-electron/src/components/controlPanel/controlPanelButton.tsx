import React from "react";

import '../../styles/controlPanel.scss';

export function ControlPanelButton(props: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button className="control-panel--button" onClick={() => props.onClick()}>
      {props.text}
    </button>
  );
}
