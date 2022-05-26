import React, { useEffect, useMemo, useRef } from "react";
import "./sidebar.scss";
import Collapse from "@material-ui/core/Collapse";
import { Menu, SubMenu } from "../../../assets/data/menu-list";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  id: number;
  setSelected: any;
  open: boolean;
  main: string;
  sub: SubMenu[];
  onClick: any;
  icon: any;
  iconInactive: Nullable<any>;
  editMode: boolean;
  propItem: Menu;
  editMenuList: any;
  handleDrawerToggle: any;
}

export default function SideBarWrapMobile(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const moveToExternalLink = async (e: any, link: string, external: any) => {
    e.preventDefault();

    if (external) {
      window.open(link, "_self");
    } else {
      navigate(link);
      if (props.handleDrawerToggle) {
        props.handleDrawerToggle();
      }
    }
  };

  useEffect(() => {
    const currentPage = props.sub.find(
      (submenu) => submenu.url === location.pathname
    );
    if (!currentPage) return;
    props.setSelected();
  }, [location.pathname]);

  if (!(props.propItem.visible && props.editMode)) return null;
  const visible = useMemo(
    () => !props.propItem?.visible && props.editMode,
    [props.propItem, props.editMode]
  );
  const opacity = useMemo(() => (visible ? 0.3 : 1), [visible]);
  return (
    <div className="itemWrap">
      <div
        onClick={() => {
          if (props.editMode) {
            props.onClick(0);
          }
          props.open ? props.onClick(0) : props.setSelected();
        }}
        className={`nav-item ${props.open ? "active" : "addBoxShadow"} ${
          visible ? "visibleFalse" : ""
        }`}
      >
        {props.sub?.find((submenu) => submenu.url === location.pathname) ? (
          <span className={"nav-link"}>
            {props.icon ? (
              <img
                src={props.icon}
                alt=""
                style={{
                  opacity,
                }}
              />
            ) : null}
            <span
              style={{
                opacity,
              }}
            >
              {props.main}
            </span>
          </span>
        ) : (
          <span className={"nav-link"}>
            {props.iconInactive ? (
              <img
                src={props.iconInactive}
                alt=""
                style={{
                  opacity,
                }}
              />
            ) : null}
            <span
              style={{
                opacity,
              }}
            >
              {props.main}
            </span>
          </span>
        )}

        {/* edit mode btn */}
        {visible ? (
          <img
            className="visibilityIcon"
            src={process.env.PUBLIC_URL + "/assets/img/icon-visibility-off.png"}
            alt=""
            onClick={() =>
              props.editMenuList({
                id: props.id,
                subId: false,
                visible: true,
                subVisible: false,
              })
            }
          />
        ) : props.editMode ? (
          <img
            className="visibilityIcon"
            src={process.env.PUBLIC_URL + "/assets/img/icon-visibility-on.svg"}
            alt=""
            onClick={() =>
              props.editMenuList({
                id: props.id,
                subId: false,
                visible: false,
                subVisible: false,
              })
            }
          />
        ) : null}
      </div>
      {/* Sub menu */}
      <Collapse in={props.open} timeout="auto" unmountOnExit>
        <div /* component='div' */>
          {props.sub?.map((submenu, index) => {
            return (
              <div key={index}>
                {(!submenu?.visible && props.editMode) || submenu?.visible ? (
                  <React.Fragment>
                    <div
                      onClick={(e) => {
                        if (props.editMode) {
                          return;
                        }
                        moveToExternalLink(e, submenu.url, submenu.external);
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
                            "sub-nav " +
                            (location.pathname === submenu.url ? "active" : "")
                          }
                          style={{
                            opacity:
                              !submenu?.visible && props.editMode ? 0.3 : 1,
                          }}
                        >
                          {submenu.title}
                        </span>
                        {/* edit mode btn */}
                        {!submenu?.visible && props.editMode ? (
                          <img
                            className="visibilityIcon"
                            src={
                              process.env.PUBLIC_URL +
                              "/assets/img/icon-visibility-off.png"
                            }
                            alt=""
                            onClick={() =>
                              props.editMenuList({
                                id: props.id,
                                subId: submenu.id,
                                visible: true,
                                subVisible: true,
                              })
                            }
                          />
                        ) : props.editMode ? (
                          <img
                            className="visibilityIcon"
                            src={
                              process.env.PUBLIC_URL +
                              "/assets/img/icon-visibility-on.svg"
                            }
                            alt=""
                            onClick={() =>
                              props.editMenuList({
                                id: props.id,
                                subId: submenu.id,
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
