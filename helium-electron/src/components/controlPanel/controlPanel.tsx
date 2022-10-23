import React from "react";

import "../../styles/controlPanel.scss";

export function ControlPanel(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="control-panel">
      <div className="control-panel--button-container">
        {props.children}
      </div>
    </div>
  );
}
