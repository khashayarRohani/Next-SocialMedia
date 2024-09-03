"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "./popup.css";
import { ScrollAreaDemo } from "./scrollArea";
import { unFollow } from "@/actions/removeFollowing";
export default function PopUpScroll(props) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="Button violet">Followings</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AAlertDialogContent">
          <ScrollAreaDemo
            unFollow={props.unFollow}
            followers={props.followers}
            userId={props.userId}
          />
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
