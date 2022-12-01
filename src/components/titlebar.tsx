import * as React from "react";
import {
  FaWindowMaximize,
  FaWindowMinimize,
  FaWindowClose,
} from "react-icons/fa";
import { appWindow } from "@tauri-apps/api/window";

interface TitleProps {}

interface TitleState {}

class Title extends React.Component<TitleProps, TitleState> {
  state = {};
  render() {
    return (
      <div data-tauri-drag-region className="titlebar">
        <div className="titlebar-button" onClick={this.minimize}>
          <FaWindowMinimize className="text-gray-500" />
        </div>
        <div className="titlebar-button" onClick={this.maximize}>
          <FaWindowMaximize className="text-gray-500" />
        </div>
        <div className="titlebar-button" onClick={this.close}>
          <FaWindowClose className="text-gray-500" />
        </div>
      </div>
    );
  }
  minimize = () => {
    appWindow.minimize();
  };
  maximize = () => {
    appWindow.toggleMaximize();
  };
  close = () => {
    appWindow.close();
  };
}

export default Title;
