import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Modal } from "../modal/Modal";
import { Button, CancelButton } from "../input/Button";
import { CloseButton } from "../input/CloseButton";
import { Column } from "../layout/Column";

export function PromoteClientModal({ onClose, onConfirm, displayName }) {
  return (
    <Modal title="Promote User" beforeTitle={<CloseButton onClick={onClose} />}>
      <Column center padding>
        <p>
          <FormattedMessage
            id="promote-client-modal.message"
            defaultMessage="사용자에게 중재자 권한을 부여하면 관리자패널을 포함한 모든 것을 볼 수 있습니다.{linebreak}괜찮나요?"
            values={{ linebreak: <br /> }}
          />
        </p>
        <Button preset="accept" onClick={onConfirm}>
          <FormattedMessage
            id="promote-client-modal.confirm-prefix"
            defaultMessage="좋아요. {name}에게 권한을 부여하세요."
            values={{ name: displayName }}
          />
        </Button>
        <CancelButton preset="cancel" onClick={onClose} />
      </Column>
    </Modal>
  );
}

PromoteClientModal.propTypes = {
  displayName: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func
};
