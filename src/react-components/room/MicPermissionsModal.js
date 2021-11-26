import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as MicrophoneIcon } from "../icons/Microphone.svg";
import styles from "./MicPermissionsModal.scss";
import { BackButton } from "../input/BackButton";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

export function MicPermissionsModal({ className, error, onClickErrorButton, errorButtonLabel, onBack, ...rest }) {
  return (
    <Modal
      title={<FormattedMessage id="mic-permissions-modal.title" defaultMessage="기기에서 접속하기" />}
      beforeTitle={<BackButton onClick={onBack} />}
      className={className}
      {...rest}
    >
      <Column padding center className={styles.content}>
        <b>
          <FormattedMessage
            id="mic-permissions-modal.grant-mic-permissions"
            defaultMessage="마이크 권한 부여하기"
          />
        </b>
        <small>
          <FormattedMessage
            id="mic-permissions-modal.mic-access-needed"
            defaultMessage="다른 이들에게 목소리를 들려주려면 마이크 권한이 필요해요.{linebreak}방에서는 마이크를 음소거 할 수 있어요."
            values={{ linebreak: <br /> }}
          />
        </small>
        <div className={styles.microphoneIconContainer}>
          <MicrophoneIcon />
        </div>
        {error && (
          <>
            <small className={styles.error}>{error}</small>
            <Button preset="primary" onClick={onClickErrorButton}>
              {errorButtonLabel}
            </Button>
          </>
        )}
      </Column>
    </Modal>
  );
}

MicPermissionsModal.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  errorButtonLabel: PropTypes.string,
  onClickErrorButton: PropTypes.func,
  onBack: PropTypes.func
};
