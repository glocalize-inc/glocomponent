import React, { memo, useEffect, useState } from "react";
import "./sidebar.scss";
import SideBarWrapMobile from "./sidebar-wrap-mobile";
import { useHistory } from "react-router";
import { BasicButton } from "@/styles/buttons/basic/basicButton";
import { saveEdittedSideBar } from "@/data_actions/userInfo_action/userInfo_action";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

function SideBarMobile(
  {
    menuList,
    copyMenuList,
    handleDrawerToggle,
    logout,
    setOriginalMenuList,
    editMode,
    setEditMode,
    disablePreviousBtn,
    setDisablePreviousBtn,
    disableAllShow,
    editMenuList,
    showAllMenuList,
    resetMenuList,
    totalQp,
  },
  props
) {
  const userInfo = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState(0);
  const history = useHistory();

  function closeSidebar() {
    if (handleDrawerToggle) {
      handleDrawerToggle();
    } else {
      return;
    }
  }

  function setToggleValue() {
    window.FreshworksWidget("open");
  }

  //menu리스트 변경사항 저장
  function saveEdittedMenuList() {
    dispatch(saveEdittedSideBar(JSON.stringify(menuList))).then((res) => {
      setOriginalMenuList([...copyMenuList]);
    });
    setEditMode(false);
    setDisablePreviousBtn(true);
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
                    {/* <a className="navbar-brand" href="/home"> */}
                    <img
                      className="navbar-brand"
                      style={{ height: "24px" }}
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/img/temporary_logo-style-1.png"
                      }
                      alt=""
                      onClick={() => {
                        history.push("/home");
                        closeSidebar();
                      }}
                    />
                    {/* </a> */}
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
                      onClick={() => {
                        closeSidebar();
                        history.push("/my-account/profile");
                      }}
                    >
                      <div className="nav-link">
                        {userInfo?.profile?.profileImageUrl == null ? (
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/assets/img/basic-profile.svg"
                            }
                            alt="icon-profile"
                          />
                        ) : (
                          <img
                            src={userInfo?.profile?.profileImageUrl}
                            alt="icon-profile"
                          />
                        )}
                        <div className="menu-icon mobile">
                          {userInfo?.profile?.nickname}
                          {totalQp > 0 ? (
                            <div className="qpArea">
                              <img
                                className="badgeImg"
                                src={
                                  process.env.PUBLIC_URL +
                                  "/assets/img/icon-certi-badge.svg"
                                }
                                alt="badge"
                              />
                              <span>{totalQp} QP</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* main menu */}
                    <div className="menuWrap">
                      <div className="mainMenu">
                        {menuList.length
                          ? menuList.map((item, idx) => (
                              <div key={idx}>
                                <SideBarWrapMobile
                                  propItem={item}
                                  setSelected={() => setSelected(item?.id)}
                                  open={selected === item?.id}
                                  main={item?.title}
                                  sub={item?.sub.map((subItem) => ({
                                    id: subItem?.id,
                                    name: subItem?.title,
                                    link: subItem?.url,
                                    visible: subItem?.visible,
                                    external: subItem?.external,
                                  }))}
                                  onClick={setSelected}
                                  icon={process.env.PUBLIC_URL + item?.icon}
                                  iconInactive={
                                    process.env.PUBLIC_URL + item?.icon
                                  }
                                  handleDrawerToggle={handleDrawerToggle}
                                  id={item?.id}
                                  editMode={editMode}
                                  editMenuList={editMenuList}
                                />
                              </div>
                            ))
                          : null}

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
                            <span className="nav-link log-out" onClick={logout}>
                              Log out
                            </span>
                          </div>
                        </div>

                        {/* Help widget */}
                        <div className="widgetWrap">
                          <footer className="sidebar_footer">
                            {!editMode ? (
                              <button
                                className="customizeBtn mobile"
                                onClick={() => {
                                  setEditMode(!editMode);
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
                                      disablePreviousBtn ? "disalbedBtn" : null
                                    }
                                    onClick={resetMenuList}
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
                                      disableAllShow ? "disalbedBtn" : null
                                    }
                                    onClick={showAllMenuList}
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
