import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as VRIcon } from "../icons/VR.svg";
import styles from "./EnterOnDeviceModal.scss";
import { BackButton } from "../input/BackButton";
import { Column } from "../layout/Column";
import { FormattedMessage, useIntl } from "react-intl";

export function EnterOnDeviceModal({
  className,
  shortUrl,
  loadingCode,
  code,
  headsetConnected,
  unsupportedBrowser,
  onEnterOnConnectedHeadset,
  onBack,
  ...rest
}) {
  const intl = useIntl();

  return (
    <Modal
      title={<FormattedMessage id="enter-on-device-modal.title" defaultMessage="기기에서 참여하기" />}
      beforeTitle={<BackButton onClick={onBack} />}
      className={className}
      {...rest}
    >
      <Column center={loadingCode ? "both" : true} padding grow>
        {loadingCode ? (
          <b>
            <FormattedMessage id="enter-on-device-modal.generating-code" defaultMessage="참여 코드 생성 중..." />
          </b>
        ) : (
          <>
            <b>
              <FormattedMessage id="enter-on-device-modal.heading" defaultMessage="무선 헤드셋/스마트폰에서 참여하기" />
            </b>
            <small>
              <FormattedMessage
                id="enter-on-device-modal.short-url-directions"
                defaultMessage="기기의 웹 브라우저에서 하단의 주소를 여세요:"
              />
            </small>
            <div className={styles.shortUrlContainer}>{shortUrl}</div>
            <small>
              <FormattedMessage
                id="enter-on-device-modal.code-directions"
                defaultMessage="그 다음 아래 OTP를 입력하세요:"
              />
            </small>
            <div className={styles.codeContainer}>
              {code.split("").map((char, i) => (
                <div key={i} className={styles.codeLetter}>
                  {char}
                </div>
              ))}
            </div>
            <strong>
              <FormattedMessage
                id="enter-on-device-modal.data-transfer"
                defaultMessage="계정과 아바타가 전송됩니다."
              />
            </strong>
            <strong>
              <FormattedMessage
                id="enter-on-device-modal.keep-page-open"
                defaultMessage="코드를 사용하기 위해서는 페이지를 열어 두세요!"
              />
            </strong>
            {headsetConnected && (
              <>
                <hr
                  data-or-text={intl.formatMessage({ id: "enter-on-device-modal.divider-label", defaultMessage: "or" })}
                />
                <b>
                  <FormattedMessage
                    id="enter-on-device-modal.headset-connected-heading"
                    defaultMessage="유선 헤드셋으로 연결하기"
                  />
                </b>
                {unsupportedBrowser ? (
                  <>
                    <small>
                      <FormattedMessage
                        id="enter-on-device-modal.unsupported-browser"
                        defaultMessage="WebVR이 이 브라우저로 사용될 수 없습니다. 오큘러스나 스팀 VR로 참여하기 위해서는 Google Chrome을 이용해 주세요."
                      />
                    </small>
                    <Button
                      as="a"
                      preset="accent2"
                      href="https://www.google.com/chrome/"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span>
                        <FormattedMessage
                          id="enter-on-device-modal.download-firefox-button"
                          defaultMessage="Google Chrome 다운로드"
                        />
                      </span>
                    </Button>
                  </>
                ) : (
                  <>
                    <small>
                      <FormattedMessage
                        id="enter-on-device-modal.headset-connected-message"
                        defaultMessage="이 기기에 VR 헤드셋이 연결되어 있습니다."
                      />
                    </small>
                    <Button preset="accent5" onClick={onEnterOnConnectedHeadset}>
                      <VRIcon />
                      <span>
                        <FormattedMessage id="enter-on-device-modal.enter-in-vr-button" defaultMessage="VR로 참여하기" />
                      </span>
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Column>
    </Modal>
  );
}

EnterOnDeviceModal.propTypes = {
  className: PropTypes.string,
  shortUrl: PropTypes.string.isRequired,
  loadingCode: PropTypes.bool,
  code: PropTypes.string,
  headsetConnected: PropTypes.bool,
  unsupportedBrowser: PropTypes.bool,
  onEnterOnConnectedHeadset: PropTypes.func,
  onBack: PropTypes.func
};
