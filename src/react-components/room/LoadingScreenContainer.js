import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import configs from "../../utils/configs";
import { useIntl } from "react-intl";
import { LoadingScreen } from "./LoadingScreen";
import { useRoomLoadingState } from "./useRoomLoadingState";

export function LoadingScreenContainer({ onLoaded, scene }) {
  const intl = useIntl();

  const { loading, message } = useRoomLoadingState(scene);

  useEffect(
    () => {
      if (!loading) {
        onLoaded();
      }
    },
    [loading, onLoaded]
  );

  //TODO: Make these configurable
  const infoMessages = useMemo(
    () => [
      {
        heading: intl.formatMessage({ id: "loading-screen.heading.tip", defaultMessage: "팁:" }),
        message: intl.formatMessage({
          id: "loading-screen.message.keyboard-controls",
          defaultMessage: "Q 및 E 키를 눌러 방향을 바꿀 수 있어요."
        })
      },
      {
        heading: intl.formatMessage({ id: "loading-screen.heading.whats-new", defaultMessage: "뭐가 새로워요?" }),
        message: intl.formatMessage(
          {
            id: "loading-screen.message.whats-new",
            defaultMessage: "설정에서 기본 언어를 바꿀 수 있어요. <a>더 보기</a>"
          },
          {
            // eslint-disable-next-line react/display-name
            a: chunks => (
              <a href="/whats-new" target="_blank">
                {chunks}
              </a>
            )
          }
        )
      }
    ],
    [intl]
  );

  return <LoadingScreen logoSrc={configs.image("logo")} message={message} infoMessages={infoMessages} />;
}

LoadingScreenContainer.propTypes = {
  scene: PropTypes.object.isRequired,
  onLoaded: PropTypes.func.isRequired
};
