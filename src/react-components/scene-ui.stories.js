/* eslint-disable @calm/react-intl/missing-formatted-message */
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FormattedMessage, useIntl } from "react-intl";
import configs from "../utils/configs";
import IfFeature from "./if-feature";
import styles from "../assets/stylesheets/scene-ui.scss";
import { createAndRedirectToNewHub, getReticulumFetchUrl } from "../utils/phoenix-utils";
import { ReactComponent as HmcLogo } from "./icons/HmcLogo.svg";
import { ReactComponent as Twitter } from "./icons/Twitter.svg";
import { ReactComponent as Pen } from "./icons/Pen.svg";
import { ReactComponent as CodeBranch } from "./icons/CodeBranch.svg";

export default {
  title: "ScenePreview/SceneUI",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/J6YKkb2vWDlk81zm4kxUzA/Hubs-discoverability-and-onboarding?node-id=903%3A1324"
    },
    layout: "fullscreen"
  }
};

// TODO: use storybook args/controls instead of booleans in props

export const SceneUI = ({
  scene,
  sceneLoaded,
  sceneUrl,
  unavailable,
  showCreateRoom = true,
  sceneAttributions,
  sceneScreenshotURL,
  sceneName,
  isOwner = true,
  sceneProjectId,
  sceneId,
  sceneAllowRemixing = true
}) => {
  const isHmc = configs.feature("show_cloud");
  const intl = useIntl();
  const tweetText = intl.formatMessage(
    {
      id: "scene-page.default-tweet",
      defaultMessage: "{sceneName} in {shareHashtag}"
    },
    {
      sceneName: sceneName,
      shareHashtag: configs.translation("share-hashtag")
    }
  );
  const tweetLink = `https://twitter.com/share?url=${encodeURIComponent(sceneUrl)}&text=${encodeURIComponent(
    tweetText
  )}`;

  const unknown = intl.formatMessage({ id: "scene-page.unknown", defaultMessage: "unknown" });

  let attributions;

  const toAttributionSpan = ({ title, name, url, author, remix }) => {
    let source = "";

    if (!author && !url) {
      return null;
    }

    const _name = name || title || unknown;
    const _author = author || unknown;

    source = url && url.includes("sketchfab.com") ? "Sketchfab" : "";

    if (remix) {
      <span className="remix">
        <FormattedMessage
          id="scene-page.remix-attribution"
          defaultMessage="(Remixed from <a>{name} by {author}</a>)"
          values={{
            name: _name,
            author: _author,
            a: chunks =>
              url ? (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {chunks}
                </a>
              ) : (
                <>{chunks}</>
              )
          }}
        />
      </span>;
    } else if (source) {
      return (
        <span key={url}>
          <FormattedMessage
            id="scene-page.attribution-with-source"
            defaultMessage="<a>{name} by {author} on {source}</a>"
            values={{
              name: _name,
              author: _author,
              source,
              a: chunks =>
                url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ) : (
                  <>{chunks}</>
                )
            }}
          />
        </span>
      );
    } else {
      return (
        <span key={`${_name} ${_author}`}>
          <FormattedMessage
            id="scene-page.attribution"
            defaultMessage="<a>{name} by {author}</a>"
            values={{
              name: _name,
              author: _author,
              a: chunks =>
                url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ) : (
                  <>{chunks}</>
                )
            }}
          />
        </span>
      );
    }
  };
  if (sceneAttributions) {
    if (!sceneAttributions.extras) {
      attributions = (
        <span>
          <span>
            {sceneAttributions.creator ? (
              <FormattedMessage
                id="scene-page.scene-attribution"
                defaultMessage="by {creator}"
                values={{ creator: sceneAttributions.creator || unknown }}
              />
            ) : (
              ""
            )}
          </span>

          <br />
          <div className={styles.attribution}>
            {sceneAttributions.content && sceneAttributions.content.map(toAttributionSpan)}
          </div>
        </span>
      );
    } else {
      // Legacy
      attributions = <span>{sceneAttributions.extras}</span>;
    }
  }
  return (
    <div className={styles.ui}>
      <div
        className={classNames({
          [styles.screenshot]: true,
          [styles.screenshotHidden]: sceneLoaded
        })}
      >
        {<img src={sceneScreenshotURL} />}
      </div>
      <div className={styles.whiteOverlay} />
      <div className={styles.grid}>
        <div className={styles.mainPanel}>
          <a href="/" className={styles.logo}>
            {isHmc ? (
              <HmcLogo className="hmc-logo" />
            ) : (
              <img
                src={configs.image("logo")}
                alt={<FormattedMessage id="scene-page.logo-alt" defaultMessage="Logo" />}
              />
            )}
          </a>
          <div className={styles.logoTagline}>{configs.translation("app-tagline")}</div>
          <div className={styles.scenePreviewButtonWrapper}>
            {showCreateRoom && (
              <button className={styles.scenePreviewButton} onClick={() => {}}>
                <FormattedMessage id="scene-page.create-button" defaultMessage="Create a room with this scene" />
              </button>
            )}
            {isOwner ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={getReticulumFetchUrl(`/spoke/projects/${sceneProjectId}`)}
                className={styles.scenePreviewButton}
              >
                <Pen />
                <FormattedMessage
                  id="scene-page.edit-button"
                  defaultMessage="Edit in {editorName}"
                  values={{ editorName: configs.translation("editor-name") }}
                />
              </a>
            ) : (
              sceneAllowRemixing && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getReticulumFetchUrl(`/spoke/projects/new?sceneId=${sceneId}`)}
                  className={styles.scenePreviewButton}
                >
                  <CodeBranch />
                  <FormattedMessage
                    id="scene-page.remix-button"
                    defaultMessage="Remix in {editorName}"
                    values={{ editorName: configs.translation("editor-name") }}
                  />
                </a>
              )
            )}

            <a href={tweetLink} rel="noopener noreferrer" target="_blank" className={styles.scenePreviewButton}>
              <Twitter />
              <FormattedMessage id="scene-page.tweet-button" defaultMessage="Share on Twitter" />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{sceneName}</div>
        <div className={styles.attribution}>{attributions}</div>
      </div>
      <IfFeature name="enable_spoke">
        <div className={styles.spoke}>
          <div className={styles.madeWith}>
            <FormattedMessage
              id="scene-page.made-with"
              defaultMessage="made with <a/>"
              values={{
                a: () => (
                  <a href="/spoke">
                    <img src={configs.image("editor_logo")} />
                  </a>
                )
              }}
            />
          </div>
        </div>
      </IfFeature>
    </div>
  );
};

export const NotAvailable = () => {
  return (
    <div className={styles.ui}>
      <div className={styles.unavailable}>
        <div>
          <FormattedMessage id="scene-page.unavailable" defaultMessage="This scene is no longer available." />
        </div>
      </div>
    </div>
  );
};
