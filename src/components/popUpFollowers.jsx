"use client";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import AvatarDemo from "./Avatar";

import "./popup.css";
import { unFollower } from "@/actions/removeFollowers";
import { ScrollAreaDemoFollowers } from "./scrollAreaFollowers";
export default function PopUpFollowers(props) {
  let id = props.id;

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="Button violet">Followers</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AAlertDialogContent">
          <ScrollAreaDemoFollowers
            unFollower={props.unFollower}
            followings={props.followings}
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
