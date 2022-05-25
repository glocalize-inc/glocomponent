import React, { useEffect, useRef } from "react";
import Collapse from "@material-ui/core/Collapse";
import "./sidebar.scss";
import { NavLink, useHistory } from "react-router-dom";

export default function SideBarWrapMobile(
  {
    id,
    propItem,
    setSelected,
    open,
    main,
    sub,
    onClick,
    icon,
    iconInactive,
    handleDrawerToggle,
    editMode,
    editMenuList,
  },
  props
) {
  const url = window.location.pathname;
  const history = useHistory();

  const moveToExternalLink = async (e, link, external) => {
    e.preventDefault();

    if (external) {
      window.open(link, "_self");
    } else {
      history.push(link);
      if (handleDrawerToggle) {
        handleDrawerToggle();
      }
    }
  };

  useEffect(() => {
    const currentPage = sub?.filter((item) => item.link === url);
    if (!currentPage?.length) {
      return;
    } else {
      setSelected();
    }
  }, [url]);

  return (
    <div className="itemWrap">
      {/* Main menu */}
      {/* item.visible = false인 경우면 editMode = true 일때만 보여주고, 아닌 경우 visible=true만 보여줌 */}
      {(!propItem?.visible && editMode) || propItem?.visible ? (
        <div
          //button
          onClick={() => {
            if (editMode) {
              onClick(0);
            }
            open ? onClick(0) : setSelected();
          }}
          className={
            "nav-item" +
            (open ? " active " : " addBoxShadow ") +
            (!propItem?.visible && editMode ? " visibleFalse " : null)
          }
        >
          {sub?.findIndex((i) => i.link === url) !== -1 ? (
            <span className={"nav-link"}>
              {icon && (
                <img
                  src={icon}
                  alt=""
                  style={{ opacity: !propItem?.visible && editMode ? 0.3 : 1 }}
                />
              )}
              <span
                style={{ opacity: !propItem?.visible && editMode ? 0.3 : 1 }}
              >
                {main}
              </span>
            </span>
          ) : (
            <span className={"nav-link"}>
              {iconInactive && (
                <img
                  src={iconInactive}
                  alt=""
                  style={{ opacity: !propItem?.visible && editMode ? 0.3 : 1 }}
                />
              )}
              <span
                style={{ opacity: !propItem?.visible && editMode ? 0.3 : 1 }}
              >
                {main}
              </span>
            </span>
          )}

          {/* edit mode btn */}
          {!propItem?.visible && editMode ? (
            <img
              className="visibilityIcon"
              src={
                process.env.PUBLIC_URL + "/assets/img/icon-visibility-off.png"
              }
              alt=""
              onClick={() =>
                editMenuList({
                  id: id,
                  subId: false,
                  visible: true,
                  subVisible: false,
                })
              }
            />
          ) : editMode ? (
            <img
              className="visibilityIcon"
              src={
                process.env.PUBLIC_URL + "/assets/img/icon-visibility-on.svg"
              }
              alt=""
              onClick={() =>
                editMenuList({
                  id: id,
                  subId: false,
                  visible: false,
                  subVisible: false,
                })
              }
            />
          ) : null}
        </div>
      ) : null}
      {/* Sub menu */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <div /* component='div' */>
          {sub?.map((subItem, index) => {
            return (
              <div key={index}>
                {(!subItem?.visible && editMode) || subItem?.visible ? (
                  <React.Fragment>
                    <div
                      onClick={(e) => {
                        if (editMode) {
                          return;
                        }
                        moveToExternalLink(e, subItem?.link, subItem?.external);
                      }}
                      className="sub-item"
                    >
                      <div
                        //button
                        //className={classes.nested}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          className={
                            "sub-nav " + (url === subItem?.link ? "active" : "")
                          }
                          style={{
                            opacity: !subItem?.visible && editMode ? 0.3 : 1,
                          }}
                        >
                          {subItem?.name}
                        </span>
                        {/* edit mode btn */}
                        {!subItem?.visible && editMode ? (
                          <img
                            className="visibilityIcon"
                            src={
                              process.env.PUBLIC_URL +
                              "/assets/img/icon-visibility-off.png"
                            }
                            alt=""
                            onClick={() =>
                              editMenuList({
                                id: id,
                                subId: subItem?.id,
                                visible: true,
                                subVisible: true,
                              })
                            }
                          />
                        ) : editMode ? (
                          <img
                            className="visibilityIcon"
                            src={
                              process.env.PUBLIC_URL +
                              "/assets/img/icon-visibility-on.svg"
                            }
                            alt=""
                            onClick={() =>
                              editMenuList({
                                id: id,
                                subId: subItem?.id,
                                visible: true,
                                subVisible: false,
                              })
                            }
                          />
                        ) : null}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}
