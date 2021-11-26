import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { TextInputField } from "../input/TextInputField";
import { useForm } from "react-hook-form";
import { ApplyButton } from "../input/Button";
import { FormattedMessage } from "react-intl";
import { Column } from "../layout/Column";

export function AvatarUrlModal({ onSubmit, onClose }) {
  const { handleSubmit, register } = useForm();
  return (
    <Modal title="커스텀 아바타 주소" beforeTitle={<CloseButton onClick={onClose} />}>
      <Column as="form" padding center onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="url"
          label={<FormattedMessage id="avatar-url-modal.avatar-url-label" defaultMessage="아바타의 GLB 파일 주소" />}
          placeholder="https://wa.sans.undertale.know/very/hard/avatar.glb"
          type="url"
          required
          ref={register}
          description={
            <a href="https://hubs.mozilla.com/docs/intro-avatars.html" target="_blank" rel="noopener noreferrer">
              <FormattedMessage
                id="avatar-url-modal.custom-avatar-docs-link"
                defaultMessage="커스텀 아바타에 대해 알아보기"
              />
            </a>
          }
        />
        <ApplyButton type="submit" />
      </Column>
    </Modal>
  );
}

AvatarUrlModal.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};
