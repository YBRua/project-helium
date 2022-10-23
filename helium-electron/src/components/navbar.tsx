import React, { PropsWithChildren } from "react";
import "../styles/navbar.scss";
import nimoIcon from "../assets/figs/nimo-icon.png";

export function NavBarButton(props: { text?: string; onClick?: () => void }) {
  const { text, onClick } = props;
  let realText;
  if (!text) {
    realText = "Button";
  } else {
    realText = text;
  }
  return <button className="navbar--button" onClick={() => onClick()}>{realText}</button>;
}

export function NavBarControlPanel(props: PropsWithChildren) {
  return <div className="navbar--panel">{props.children}</div>;
}

export function NavigationBar(props: PropsWithChildren) {
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar--icon">
          <img width={104} height={33} src={nimoIcon} alt="NIMO" />
          <h1>Project Helium</h1>
        </div>
        {props.children}
      </div>
    </div>
  );
}
