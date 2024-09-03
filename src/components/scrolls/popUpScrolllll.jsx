"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "../popup.css";
import { ScrollAreaDemoooo } from "./scrollAreaaaa";
import { unFollow } from "@/actions/removeFollowing";
export default function PopUpScrolllll(props) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="Button violet">Follower</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AAlertDialogContent">
          <ScrollAreaDemoooo followers={props.followers} />
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
