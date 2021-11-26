import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./RoomSettingsSidebar.scss";
import { IconButton } from "../input/IconButton";
import { FormattedMessage, useIntl } from "react-intl";
import { CopyableTextInputField } from "../input/CopyableTextInputField";

export function InviteLinkInputField({ fetchingInvite, inviteUrl, onRevokeInvite }) {
  const intl = useIntl();

  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);

  const revokeInvite = useCallback(() => {
    setShowRevokeConfirmation(true);
  }, []);

  const cancelConfirmRevokeInvite = useCallback(() => {
    setShowRevokeConfirmation(false);
  }, []);

  const confirmRevokeInvite = useCallback(
    () => {
      onRevokeInvite();
      setShowRevokeConfirmation(false);
    },
    [onRevokeInvite]
  );

  return (
    <CopyableTextInputField
      label={<FormattedMessage id="invite-link-input-field.label" defaultMessage="Invite link" />}
      disabled={fetchingInvite}
      value={
        fetchingInvite
          ? intl.formatMessage({
              id: "invite-link-input-field.generating-invite",
              defaultMessage: "초대장 생성 중..."
            })
          : inviteUrl
      }
      buttonPreset="primary"
      description={
        !fetchingInvite &&
        (showRevokeConfirmation ? (
          <>
            <FormattedMessage id="invite-link-input-field.revoke-confirm" defaultMessage="정말인가요?" />{" "}
            <IconButton className={styles.confirmRevokeButton} onClick={confirmRevokeInvite}>
              <FormattedMessage id="invite-link-input-field.revoke-confirm-yes" defaultMessage="예" />
            </IconButton>{" "}
            /{" "}
            <IconButton className={styles.confirmRevokeButton} onClick={cancelConfirmRevokeInvite}>
              <FormattedMessage id="invite-link-input-field.revoke-confirm-no" defaultMessage="아니오" />
            </IconButton>
          </>
        ) : (
          <IconButton className={styles.confirmRevokeButton} onClick={revokeInvite}>
            <FormattedMessage id="invite-link-input-field.revoke" defaultMessage="만료시키기" />
          </IconButton>
        ))
      }
      fullWidth
    />
  );
}

InviteLinkInputField.propTypes = {
  fetchingInvite: PropTypes.bool,
  inviteUrl: PropTypes.string,
  onRevokeInvite: PropTypes.func.isRequired
};
