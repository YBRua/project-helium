import React from "react";

export function NavBarButton(props: { text?: string; onClick?: () => void }) {
  const { text, onClick } = props;
  let realText;
  if (!text) {
    realText = "Button";
  } else {
    realText = text;
  }
  return (
    <button
      className="navbar--button"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {realText}
    </button>
  );
}
