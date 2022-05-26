import React from "react";
import { useHistory } from "react-router";
import styled, { css, keyframes } from "styled-components";

function ReleaseNoteBubble({ show, onHide, goToTry }) {
  return (
    <React.Fragment>
      <Bubble show={show}>
        <ContentContainer>
          <strong style={{ fontSize: "1rem" }}>
            The new Project Management feature is here!
          </strong>
          <img
            onClick={() => {
              onHide();
              sessionStorage.setItem("close_release_note", "true");
            }}
            style={{ opacity: 0.5, cursor: "pointer" }}
            src={process.env.PUBLIC_URL + "/assets/img/icon-close-black.svg"}
            alt="delete-icon"
            id="close_release_note"
          />
        </ContentContainer>

        <ul style={{ paddingLeft: "18px", lineHeight: 1.5, marginTop: "8px" }}>
          <li>
            With the Project Management feature, you can:
            <ol style={{ paddingLeft: "18px", lineHeight: 1.5 }}>
              <li>Send invoices to clients!</li>
              <ul style={{ paddingLeft: "18px", lineHeight: 1.5 }}>
                <li>
                  Add your email address to CC invoices sent using the Project
                  Management feature.
                </li>
                <li>Invoice files are automatically attached to emails.</li>
              </ul>

              <li>
                View your projected income and actual income in your dashboard.
                💳
              </li>
              <li>
                Access an overview of your main clients, project categories, and
                areas of expertise in your dashboard.{" "}
              </li>
            </ol>
          </li>
        </ul>
        <ParagraphContainer>
          Quickly find the feature you need with the tool navigation button!💪
          <TryBtn onClick={goToTry} id="release_note">
            TRY IT
          </TryBtn>
        </ParagraphContainer>
      </Bubble>
    </React.Fragment>
  );
}

export default ReleaseNoteBubble;

type BubbleProps = {
  show: boolean;
};

const Bubble = styled.div<BubbleProps>`
  display: flex;
  opacity: 0;
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  ${({ show }) =>
    show
      ? css`
          animation: ${boxFadeIn} 0.3s;
          animation-fill-mode: forwards;
        `
      : css`
          animation: ${boxFadeOut} 0.3s;
          animation-fill-mode: forwards;
        `}
  flex-direction: column;
  transition: visibility 0.3s linear;
  z-index: 111;
  position: fixed;
  max-width: 50em;
  bottom: 100px;
  right: 30px;
  margin-left: 30px;
  background-color: #fff;
  padding: 1.125em 1.5em;
  font-size: 1em;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3),
    0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
  &:before {
    /* 말주머니 화살표 */
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    bottom: 130px;
    left: 49.5em;
    border: 0.75rem solid transparent;
    border-top: none;
    transform: rotate(90deg);
    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.15));
    @media screen and (max-width: 760px) {
      bottom: -11px;
      left: 5.4em;
      transform: rotate(180deg);
      /* filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.15)); */
    }
  }
`;

const ContentContainer = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const ParagraphContainer = styled(ContentContainer)`
  font-size: 10px;
  color: #888;
`;

const TryBtn = styled.button`
  width: 84px;
  border: 1px solid #111111;
  padding: 8px;
  background-color: #1a61f7;

  box-shadow: 0px 2px 0px #000000;
  border-radius: 8px;
  font-weight: bold;
  font-size: 12px;
  transition: all 0.5s;
  color: #fff;
  :hover {
    transform: scale(1.05);
  }
`;
const boxFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }

`;

const boxFadeOut = keyframes`
  from {
    opacity: 1;

  }
  to {
    opacity: 0;
  }
`;
