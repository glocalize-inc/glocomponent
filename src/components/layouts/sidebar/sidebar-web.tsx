import React, { memo, useCallback, useState } from "react";
import "./sidebar.scss";
import SideBarWrap from "./sidebar-wrap";
import { UserInfo } from "../../../features/user-info/user-info";
import { Menu } from "../../../assets/data/menu-list";
import _ from "lodash";

// @todo 걷어내기
import update from "immutability-helper";
import { useNavigate } from "react-router-dom";

interface Props {
  menuList: Menu[];
  setMenuList: React.Dispatch<React.SetStateAction<Menu[]>>;
  copyMenuList: Menu[];
  handleDrawerToggle?: any;
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

function SideBar(props: Props) {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  //menu리스트 변경사항 저장
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

  /**
   * @description dnd로 리스트 움직이기
   */
  const moveCard = useCallback(
    (dragIdx: number, hoverIdx: number) => {
      const dragCard = props.menuList[dragIdx];
      props.setDisablePreviousButton(false); //수정된 사항이 있으면 previous버튼 활성화 되게
      props.setMenuList(
        update(props.menuList, {
          $splice: [
            [dragIdx, 1], // Delete
            [hoverIdx, 0, dragCard], // Add
          ],
        })
      );
    },
    [props.menuList]
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
                    onClick={() => navigate("/home")}
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
                        onClick={() => navigate("/my-account/profile")}
                      >
                        <div className="nav-link">
                          <img
                            src={
                              props.userInfo.profileImage ||
                              `${process.env.PUBLIC_URL}/assets/img/basic-profile.svg`
                            }
                            alt="icon-profile"
                          />
                          <div className="menu-icon">
                            <p className="nickname">
                              {props.userInfo.nickname}
                            </p>
                            {props.totalQp > 0 ? (
                              <div className="qpArea">
                                <img
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
                      <div className="accordion" id="pcNav">
                        {props.menuList.map((menu, idx) => (
                          <div key={idx}>
                            <SideBarWrap
                              id={menu.id}
                              index={idx}
                              setSelected={() => setSelected(menu.id)}
                              open={selected === menu.id}
                              main={menu.title}
                              sub={menu.sub.map((submenu) => ({
                                id: submenu.id,
                                name: submenu.title,
                                link: submenu.url,
                                visible: submenu.visible,
                                external: submenu.external,
                              }))}
                              onClick={setSelected}
                              icon={process.env.PUBLIC_URL + menu.icon}
                              iconInactive={
                                process.env.PUBLIC_URL + menu.iconInactive
                              }
                              moveCard={moveCard}
                              editMode={props.editMode}
                              propItem={menu}
                              editMenuList={props.editMenuList}
                            />
                          </div>
                        ))}
                      </div>
                      <footer className="sidebar_footer">
                        {!props.editMode ? (
                          <button
                            className="customizeBtn"
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
                          <div className="editBtnContainer">
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
                        {props.userInfo.isError ? null : (
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
                            <div
                              className="nav-link log-out"
                              onClick={props.logout}
                            >
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

/**
 * @description 임시
 * @todo remove
 */
function BasicButton(props: any) {
  return <></>;
}
