import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl, defineMessages } from "react-intl";
import { Tip } from "./Tip";
import { useEffect } from "react";
import { discordBridgesForPresences, hasEmbedPresences } from "../../utils/phoenix-utils";
import configs from "../../utils/configs";

// These keys are hardcoded in the input system to be based on the physical location on the keyboard rather than character
let moveKeys = "W A S D";
let turnLeftKey = "Q";
let turnRightKey = "E";

// TODO The API to map from physical key to character is experimental. Depending on prospects of this getting wider
// implimentation we may want to cook up our own polyfill based on observing key inputs
if (window.navigator.keyboard !== undefined && window.navigator.keyboard.getLayoutMap) {
  window.navigator.keyboard
    .getLayoutMap()
    .then(function(map) {
      moveKeys = `${map.get("KeyW") || "W"} ${map.get("KeyA") || "A"} ${map.get("KeyS") || "S"} ${map.get("KeyD") ||
        "D"}`.toUpperCase();
      turnLeftKey = map.get("KeyQ")?.toUpperCase();
      turnRightKey = map.get("KeyE")?.toUpperCase();
    })
    .catch(function(e) {
      // This occurs on Chrome 93 when the Hubs page is in an iframe
      console.warn(`Unable to remap keyboard: ${e}`);
    });
}

const onboardingMessages = defineMessages({
  "tips.mobile.look": {
    id: "tips.mobile.look",
    defaultMessage: "어서오세요! 터치하고 드래그하여 구경하세요."
  },
  "tips.mobile.locomotion": {
    id: "tips.mobile.locomotion",
    defaultMessage: "잘 했어요! 엄지와 검지 손가락으로 확대하여 움직일 수 있어요."
  },
  "tips.mobile.invite": {
    id: "tips.mobile.invite",
    defaultMessage: "이 방을 공유하기 위해 공유 버튼을 이용할 수 있어요."
  },
  "tips.desktop.look": {
    id: "tips.desktop.look",
    defaultMessage: "{appName}에 오신 것을 환영합니다! 간단하게 알아보자구요. 👋 클릭하고 드래그하여 구경하세요."
  },
  "tips.desktop.locomotion": {
    id: "tips.desktop.locomotion",
    defaultMessage: "{moveKeys}키를 눌러 움직이고 쉬프트 키를 눌러 더 빠르게 움직이세요."
  },
  "tips.desktop.turning": {
    id: "tips.desktop.turning",
    defaultMessage: "완벽해요. {turnLeftKey}와 {turnRightKey} 키로 회전할 수 있어요."
  },
  "tips.desktop.invite": {
    id: "tips.desktop.invite",
    defaultMessage: "아무도 없어 보여요. 공유하는 것은 어떨까요?"
  }
});

function OkDismissLabel() {
  return <FormattedMessage id="tips.dismiss.ok" defaultMessage="Ok" />;
}

function SkipDismissLabel() {
  return <FormattedMessage id="tips.dismiss.skip" defaultMessage="Skip" />;
}

export function FullscreenTip(props) {
  return (
    <Tip {...props} dismissLabel={<OkDismissLabel />}>
      <FormattedMessage id="tips.fullscreen" defaultMessage="전체화면 모드입니다. ESC 키를 눌러 UI를 확인해 주세요." />
    </Tip>
  );
}

export function TipContainer({ hide, inLobby, inRoom, isStreaming, isEmbedded, scene, store, hubId, presences }) {
  const intl = useIntl();
  const [lobbyTipDismissed, setLobbyTipDismissed] = useState(false);
  const [broadcastTipDismissed, setBroadcastTipDismissed] = useState(() =>
    store.state.confirmedBroadcastedRooms.includes(hubId)
  );
  const [streamingTipDismissed, setStreamingTipDismissed] = useState(false);
  const [embeddedTipDismissed, setEmbeddedTipDismissed] = useState(false);
  const [onboardingTipId, setOnboardingTipId] = useState(null);

  const onSkipOnboarding = useCallback(
    () => {
      scene.systems.tips.skipTips();
    },
    [scene]
  );

  useEffect(
    () => {
      function onSceneTipChanged({ detail: tipId }) {
        setOnboardingTipId(tipId);
      }

      scene.addEventListener("tip-changed", onSceneTipChanged);

      setOnboardingTipId(scene.systems.tips.activeTip);
    },
    [scene]
  );

  const discordBridges = presences ? discordBridgesForPresences(presences) : [];
  const isBroadcasting = discordBridges.length > 0;

  // TODO: This only exists because we store local state in this component.
  // If we move tip state to a context then we can remove this and not render this component at all.
  if (hide) {
    return null;
  }

  if (inLobby) {
    if (lobbyTipDismissed) {
      return null;
    }

    return (
      <Tip onDismiss={() => setLobbyTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
        <FormattedMessage id="tips.lobby" defaultMessage="여기는 로비입니다. 아무도 당신을 보거나 들을 수 없어요." />
      </Tip>
    );
  } else if (inRoom) {
    if (onboardingTipId) {
      return (
        <Tip onDismiss={onSkipOnboarding} dismissLabel={<SkipDismissLabel />}>
          {intl.formatMessage(onboardingMessages[onboardingTipId], {
            appName: configs.translation("app-name"),
            moveKeys,
            turnLeftKey,
            turnRightKey
          })}
        </Tip>
      );
    }

    if (isStreaming && !streamingTipDismissed) {
      return (
        <Tip onDismiss={() => setStreamingTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
          <FormattedMessage
            id="tips.streaming"
            defaultMessage="로비에서 방송중이에요."
          />
        </Tip>
      );
    }

    if (isBroadcasting && !broadcastTipDismissed) {
      return (
        <Tip onDismiss={() => setBroadcastTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
          <FormattedMessage
            id="tips.discord"
            defaultMessage="채팅이 디스코드의 {broadcastTarget} 채널과 연동되고 있어요."
            values={{ broadcastTarget: discordBridges.map(channelName => "#" + channelName).join(", ") }}
          />
        </Tip>
      );
    }

    if ((isEmbedded || hasEmbedPresences(presences)) && !embeddedTipDismissed) {
      return (
        <Tip onDismiss={() => setEmbeddedTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
          <FormattedMessage
            id="tips.embedded"
            defaultMessage="이 방은 활성화되어 있으므로 다른 사이트에서 볼 수 있어요."
          />
        </Tip>
      );
    }

    return null;
  }

  return null;
}

TipContainer.propTypes = {
  hide: PropTypes.bool,
  inLobby: PropTypes.bool,
  inRoom: PropTypes.bool,
  isStreaming: PropTypes.bool,
  isEmbedded: PropTypes.bool,
  scene: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  hubId: PropTypes.string,
  presences: PropTypes.object
};
