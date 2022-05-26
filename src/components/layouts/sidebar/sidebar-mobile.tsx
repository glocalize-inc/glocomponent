import React, { memo, useState } from "react";
import "./sidebar.scss";
import { Menu } from "../../../assets/data/menu-list";
import SideBarWrapMobile from "./sidebar-wrap-mobile";
import { UserInfo } from "../../../features/user-info/user-info";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

interface Props {
  menuList: Menu[];
  copyMenuList: Menu[];
  handleDrawerToggle: any;
  logout: any;
  setOriginalMenuList: any;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  disablePreviousButton: boolean;
  setDisablePreviousButton: React.Dispatch<React.SetStateAction<boolean>>;
  disableAllShow: any;
  editMenuList: any;
  showAllMenuList: any;
  resetMenuList: any;
  totalQp: number;
  userInfo: UserInfo;
  saveEdittedSideBar: (stringMenuList: string) => Promise<any>;
}

function SideBarMobile(props: Props) {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  function closeSidebar() {
    if (props.handleDrawerToggle) {
      props.handleDrawerToggle();
    } else {
      return;
    }
  }

  function setToggleValue() {
    window.FreshworksWidget("open");
  }

  /**
   * @description menu리스트 변경사항 저장
   */
  function saveEdittedMenuList() {
    props.saveEdittedSideBar(JSON.stringify(props.menuList)).then(() => {
      props.setOriginalMenuList(_.cloneDeep(props.copyMenuList));
    });
    props.setEditMode(false);
    props.setDisablePreviousButton(true);
  }

  function handleNavigate(path: string) {
    closeSidebar();
    navigate(path);
  }

  return (
    <React.Fragment>
      <div id="mobNavWrap" className="fl-header main-nav-fl">
        <div className="sideNav">
          <div className="mob fl-sidenav">
            <div className="container-fluid">
              <div className="nav-wrap">
                <div className="sidebar">
                  <div className="topWrap">
                    <img
                      className="navbar-brand"
                      style={{ height: "24px" }}
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/img/temporary_logo-style-1.png"
                      }
                      alt=""
                      onClick={() => handleNavigate("/home")}
                    />
                    <button
                      type="button"
                      className="btn closeBtn"
                      onClick={closeSidebar}
                    >
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/img/icon-cancel-black.svg"
                        }
                        alt=""
                      />
                    </button>
                  </div>

                  <div className="nav">
                    {/* Profile image & nickname */}
                    <div
                      className="nav-item profile"
                      onClick={() => handleNavigate("/my-account/profile")}
                    >
                      <div className="nav-link">
                        <img
                          src={
                            props.userInfo.profileImage ||
                            `${process.env.PUBLIC_URL}/assets/img/basic-profile.svg`
                          }
                          alt="icon-profile"
                        />
                        <div className="menu-icon mobile">
                          {props.userInfo.nickname}
                          {props.totalQp > 0 ? (
                            <div className="qpArea">
                              <img
                                className="badgeImg"
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/img/icon-certi-badge.svg"
                                }
                                alt="badge"
                              />
                              <span>{props.totalQp} QP</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* main menu */}
                    <div className="menuWrap">
                      <div className="mainMenu">
                        {props.menuList.map((menu, idx) => (
                          <div key={idx}>
                            <SideBarWrapMobile
                              propItem={menu}
                              setSelected={() => setSelected(menu.id)}
                              open={selected === menu.id}
                              main={menu.title}
                              sub={menu.sub}
                              onClick={setSelected}
                              icon={process.env.PUBLIC_URL + menu.icon}
                              iconInactive={process.env.PUBLIC_URL + menu.icon}
                              handleDrawerToggle={props.handleDrawerToggle}
                              id={menu.id}
                              editMode={props.editMode}
                              editMenuList={props.editMenuList}
                            />
                          </div>
                        ))}

                        {/** Log out */}
                        <div className="buttom-menu-container">
                          <div>
                            <span
                              className="nav-link log-out"
                              onClick={() =>
                                window.open(
                                  "http://support.glozinc.com/support/tickets/new"
                                )
                              }
                            >
                              Contact us
                            </span>
                          </div>
                          <div>
                            <span
                              className="nav-link log-out"
                              onClick={props.logout}
                            >
                              Log out
                            </span>
                          </div>
                        </div>

                        {/* Help widget */}
                        <div className="widgetWrap">
                          <footer className="sidebar_footer">
                            {!props.editMode ? (
                              <button
                                className="customizeBtn mobile"
                                onClick={() => {
                                  props.setEditMode(!props.editMode);
                                }}
                              >
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/assets/img/icon-switch-arrow.png"
                                  }
                                  alt=""
                                />
                                CUSTOMIZE MENU
                              </button>
                            ) : (
                              <div className="editBtnContainer mobile">
                                <div className="editModeBtn">
                                  <div
                                    className={
                                      props.disablePreviousButton
                                        ? "disalbedBtn"
                                        : ""
                                    }
                                    onClick={props.resetMenuList}
                                  >
                                    {" "}
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/assets/img/arrow-reset-right.png"
                                      }
                                      alt=""
                                    />
                                    PREVIOUS
                                  </div>
                                  <div
                                    className={
                                      props.disableAllShow ? "disalbedBtn" : ""
                                    }
                                    onClick={props.showAllMenuList}
                                  >
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/assets/img/icon-papers.png"
                                      }
                                      alt=""
                                    />
                                    ALL SHOW
                                  </div>
                                </div>
                                <BasicButton
                                  label="SAVE"
                                  onClick={saveEdittedMenuList}
                                  styleType="BlackSmallButton"
                                />
                              </div>
                            )}
                          </footer>
                          <button
                            className="help-widget"
                            onClick={() => {
                              setToggleValue();
                            }}
                          >
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/img/icon-question-white.png"
                              }
                              alt=""
                            />
                            HELP
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default memo(SideBarMobile);

/**
 * @description 임시
 * @todo remove
 */
function BasicButton(props: any) {
  return <></>;
}
