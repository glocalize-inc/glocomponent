import React, { memo, useCallback, useEffect, useState } from "react";
import "./sidebar.scss";
import SideBarWrap from "./sidebar-wrap";
import { useHistory } from "react-router-dom";
import update from "immutability-helper";
import { BasicButton } from "@/styles/buttons/basic/basicButton";
import { saveEdittedSideBar } from "@/data_actions/userInfo_action/userInfo_action";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

function SideBar(
  {
    menuList,
    setMenuList,
    copyMenuList,
    setOriginalMenuList,
    logout,
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
  const history = useHistory();
  const userInfo = useAppSelector((state) => state.userInfo);
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState(0);

  //menu리스트 변경사항 저장
  function saveEdittedMenuList() {
    dispatch(saveEdittedSideBar(JSON.stringify(menuList))).then((res) => {
      setOriginalMenuList([...copyMenuList]);
    });
    setEditMode(false);
    setDisablePreviousBtn(true);
  }

  //dnd로 리스트 움직이기
  const moveCard = useCallback(
    (dragIdx, hoverIdx) => {
      const dragCard = menuList[dragIdx];
      setDisablePreviousBtn(false); //수정된 사항이 있으면 previous버튼 활성화 되게
      setMenuList(
        update(menuList, {
          $splice: [
            [dragIdx, 1], // Delete
            [hoverIdx, 0, dragCard], // Add
          ],
        })
      );
    },
    [menuList]
  );

  return (
    <React.Fragment>
      <div id="pcNavWrap" className="fl-header main-nav-fl">
        <div className="sideNav">
          <div className="pc fl-sidenav">
            <div className="container-fluid">
              <div className="nav-wrap">
                <div className="sidebar">
                  <p
                    style={{
                      display: "flex",
                      height: "24px",
                      marginBottom: "12px",
                    }}
                    className="navbar-brand"
                    onClick={() => history.push("/home")}
                  >
                    <img
                      style={{ height: "24px" }}
                      src={
                        process.env.PUBLIC_URL +
                        "/assets/img/temporary_logo-style-1.png"
                      }
                      alt=""
                    />
                  </p>
                  <div className="sidebar-sticky">
                    <div className="nav flex-column">
                      <div
                        className="nav-item profile"
                        onClick={() => history.push("/my-account/profile")}
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
                          <div className="menu-icon">
                            <p className="nickname">
                              {userInfo?.profile?.nickname}
                            </p>
                            {totalQp > 0 ? (
                              <div className="qpArea">
                                <img
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
                      <div className="accordion" id="pcNav">
                        {menuList.length
                          ? menuList.map((item, idx) => (
                              <div key={idx}>
                                <SideBarWrap
                                  id={item?.id}
                                  index={idx}
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
                                    process.env.PUBLIC_URL + item?.iconInactive
                                  }
                                  moveCard={moveCard}
                                  editMode={editMode}
                                  propItem={item}
                                  editMenuList={editMenuList}
                                />
                              </div>
                            ))
                          : null}
                      </div>
                      <footer className="sidebar_footer">
                        {!editMode ? (
                          <button
                            className="customizeBtn"
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
                          <div className="editBtnContainer">
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
                        {userInfo.isError ? null : (
                          <div className="nav-item">
                            <div
                              className="nav-link log-out"
                              onClick={() =>
                                window.open(
                                  "http://support.glozinc.com/support/tickets/new"
                                )
                              }
                            >
                              Contact Us
                            </div>
                            <div className="nav-link log-out" onClick={logout}>
                              Log out
                            </div>
                          </div>
                        )}
                      </footer>
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

export default memo(SideBar);
