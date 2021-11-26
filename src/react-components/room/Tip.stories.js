import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import { Tip } from "./Tip";

export default {
  title: "Room/Tip",
  parameters: {
    layout: "fullscreen"
  }
};

export const Base = () => (
  <RoomLayout
    viewport={
      <Tip onDismiss={() => {}} dismissLabel="건너뛰기">
        {"어서 오세요! 클릭하고 드래그하여 구경해 보세요."}
      </Tip>
    }
  />
);
