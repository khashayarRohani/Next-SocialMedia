"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import "../popup.css";

import { ScrollAreaDemoFollowerssss } from "./scrollAreaFollowerssss";
export default function PopUpFollowerssss(props) {
  let id = props.id;

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="Button violet">Followings</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AAlertDialogContent">
          <ScrollAreaDemoFollowerssss followings={props.followings} />
          <AlertDialog.Cancel asChild>
            <button className="Button mauve" style={{ margin: "2%" }}>
              Return
            </button>
          </AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
//
