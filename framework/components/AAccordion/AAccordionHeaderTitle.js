import PropTypes from "prop-types";
import React, {forwardRef, useContext} from "react";

import AAccordionContext from "./AAccordionContext";
import AAccordionPanelContext from "./AAccordionPanelContext";
import {keyCodes} from "../../utils/helpers";
import "./AAccordion.scss";

import AIcon from "../AIcon";

const AAccordionHeaderTitle = forwardRef(
  (
    {
      chevron = true,
      children,
      className: propsClassName,
      onBlur,
      onClick,
      onFocus,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const {panelId, setIsFocused, hasBody} = useContext(AAccordionPanelContext);
    const {openedPanels, setOpenedPanels} = useContext(AAccordionContext);

    const togglePanel = () => {
      if (openedPanels.includes(panelId)) {
        setOpenedPanels(openedPanels.filter((x) => x !== panelId));
      } else {
        setOpenedPanels([...openedPanels, panelId]);
      }
    };

    const handleClick = (e) => {
      hasBody && togglePanel();
      onClick && onClick(e);
    };

    const handleKeyDown = (e) => {
      if (hasBody && [keyCodes.enter, keyCodes.space].includes(e.keyCode)) {
        e.preventDefault();
        togglePanel();
      }

      onKeyDown && onKeyDown(e);
    };

    const handleBlur = (e) => {
      hasBody && setIsFocused(false);
      onBlur && onBlur(e);
    };

    const handleFocus = (e) => {
      hasBody && setIsFocused(true);
      onFocus && onFocus(e);
    };

    let className = "a-accordion__link";

    if (propsClassName) {
      className += ` ${propsClassName}`;
    }

    const chevronIcon = !openedPanels.includes(panelId)
      ? "chevron-right"
      : "chevron-down";

    const props = {};

    if (hasBody) {
      props.tabIndex = 0;
      props.role = "button";
    }

    return (
      <div
        {...rest}
        {...props}
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={ref}
        className={className}>
        {chevron && <AIcon>{chevronIcon}</AIcon>}
        {children}
      </div>
    );
  }
);

AAccordionHeaderTitle.defaultProps = {
  chevron: true
};

AAccordionHeaderTitle.propTypes = {
  /**
   * Toggles the chevron.
   */
  chevron: PropTypes.bool
};

AAccordionHeaderTitle.displayName = "AAccordionHeaderTitle";

export default AAccordionHeaderTitle;