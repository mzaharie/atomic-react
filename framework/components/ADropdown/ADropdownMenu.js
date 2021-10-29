import PropTypes from "prop-types";
import React, {forwardRef, useEffect, useRef, useState} from "react";

import {keyCodes} from "../../utils/helpers";
import {useCombinedRefs} from "../../utils/hooks";
import "./ADropdown.scss";

const ADropdownMenu = forwardRef(
  (
    {
      children,
      className: propsClassName,
      onBlur,
      onClick,
      onClose,
      onKeyDown,
      open,
      focusOnOpen = true,
      role = "menu",
      ...rest
    },
    ref
  ) => {
    const menuRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, menuRef);
    const [launcherElement, setLauncherElement] = useState(null);

    useEffect(() => {
      const close = (e) => {
        const closestDropdown = e.target.closest(".a-dropdown");
        const ourDropdown = combinedRef.current.closest(".a-dropdown");
        if (!closestDropdown || !closestDropdown.isSameNode(ourDropdown)) {
          onClose && onClose(e);
        }
      };

      if (open) {
        document.addEventListener("click", close);
        setLauncherElement(document.activeElement);
        if (focusOnOpen) {
          combinedRef.current.focus();
        }
      }

      return () => {
        document.removeEventListener("click", close);
      };
    }, [open, combinedRef, focusOnOpen, onClose]);

    let className = "a-dropdown__menu";

    if (open) {
      className += " a-dropdown__menu--is-active";
    }

    if (propsClassName) {
      className += ` ${propsClassName}`;
    }

    const getPrevious = () => {
      const items = Array.from(
        combinedRef.current.querySelectorAll(".a-dropdown__item[tabindex]")
      );
      return (
        items[
          items.findIndex((x) => x.isSameNode(document.activeElement)) - 1
        ] || items[items.length - 1]
      );
    };

    const getNext = () => {
      const items = Array.from(
        combinedRef.current.querySelectorAll(".a-dropdown__item[tabindex]")
      );
      return (
        items[
          items.findIndex((x) => x.isSameNode(document.activeElement)) + 1
        ] || items[0]
      );
    };

    const blurHandler = (e) => {
      onBlur && onBlur(e);
      if (
        !e.relatedTarget ||
        !e.relatedTarget.closest(".a-dropdown") ||
        !e.relatedTarget
          .closest(".a-dropdown")
          .isSameNode(combinedRef.current.closest(".a-dropdown"))
      ) {
        onClose && onClose(e);
      }
    };

    const closeHandler = (e) => {
      launcherElement && launcherElement.focus();
      onClose && onClose(e);
    };

    const clickHandler = (e) => {
      if (!e.target.hasAttribute("aria-disabled")) {
        onClick && onClick(e);
        closeHandler(e);
      }
    };

    const keyDownHandler = (e) => {
      if (onClose && [keyCodes.esc, keyCodes.enter].includes(e.keyCode)) {
        e.preventDefault();
        closeHandler(e);
      } else if (e.keyCode === keyCodes.tab) {
        closeHandler(e);
      } else if (e.keyCode === keyCodes.up) {
        e.preventDefault();
        const previous = getPrevious();
        previous && previous.focus();
      } else if (e.keyCode === keyCodes.down) {
        e.preventDefault();
        const next = getNext();
        next && next.focus();
      }

      onKeyDown && onKeyDown(e);
    };

    return (
      <div
        {...rest}
        className={className}
        onBlur={blurHandler}
        onClick={clickHandler}
        onKeyDown={keyDownHandler}
        role={role}
        ref={combinedRef}
        tabIndex={-1}>
        {children}
      </div>
    );
  }
);

ADropdownMenu.propTypes = {
  /**
   * Toggles whether the menu is focused when opened.
   */
  focusOnOpen: PropTypes.bool,
  /**
   * Handles the request to close the menu.
   */
  onClose: PropTypes.func,
  /**
   * Toggles the `open` state.
   */
  open: PropTypes.bool,
  /**
   * Sets the [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) role.
   */
  role: PropTypes.string
};

ADropdownMenu.displayName = "ADropdownMenu";

export default ADropdownMenu;