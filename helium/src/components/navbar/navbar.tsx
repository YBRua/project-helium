import { PropsWithChildren } from "react";
import nimoIcon from "../../assets/figs/nimo-icon.png";

import "../../styles/navbar.scss";

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
