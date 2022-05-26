import React, { memo, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import SideBar from "./sidebar/sidebar-web";
import SideBarMobile from "./sidebar/sidebar-mobile";
import "./layout.scss";
import Router from "../routes/router";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import { withRouter } from "react-router-dom";
import { defaultMenuList } from "../assets/data/menu-list";
import _ from "lodash";
import {
  getSideBarMenu,
  getUserType,
  saveEdittedSideBar,
} from "@/data_actions/userInfo_action/userInfo_action";
import { unwrapResult } from "@reduxjs/toolkit";
import { authenticationService } from "@/service/auth/auth.service";
import { useHistory } from "react-router-dom";
import deepEqual from "lodash.isequal";
import ReleaseNoteBubble from "./release-note";
import { userInfoSlice } from "@/data_reducers/userInfo_reducer/userInfo_reducer";
import { GA } from "@/service/ga/ga.service";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

const drawerWidth = 250;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        width: drawerWidth,
        flexShrink: 0,
      },
      zIndex: 100,
    },
    appBar: {
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        // width: `calc(100% - ${drawerWidth}px)`,
        // marginLeft: drawerWidth,
        display: "none",
      },
      zIndex: 100,
      boxShadow: "none",
      borderBottom: "1px solid #ccc",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      marginLeft: 0,
      padding: 0,
      color: "#111",
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        display: "none",
      },
    },
    toolbarLogo: {
      cursor: "pointer",
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        display: "none",
      },
    },
    toolbarProfile: {
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        display: "none",
      },
      [theme.breakpoints.down(theme.breakpoints.values.md)]: {
        display: "none",
      },
    },

    toolbar: {
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        display: "none",
      },
    },
    drawerPaper: {
      width: drawerWidth,
      [theme.breakpoints.down(theme.breakpoints.values.md)]: {
        width: "100%",
        backgroundColor: "#fff",
      },
    },
    content: {
      width: "100%",
      flexGrow: 1,
      [theme.breakpoints.down(theme.breakpoints.values.md)]: {
        marginTop: "64px",
      },
    },
    mobDrawer: {
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        display: "none",
      },
    },
  })
);

function Layout(props) {
  const history = useHistory();
  //redux
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.userInfo);

  // const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const path = props.location.pathname;
  const [showBubble, setShowBubble] = useState(null);

  //sideBar props
  const [menuList, setMenuList] = useState([]); //편집된 사이드바 내용을 저장할 값
  let copyMenuList = _.cloneDeep(menuList); //setMenuList를 쉽게 하기 위해 카피해둔 값
  const [originalMenuList, setOriginalMenuList] = useState([]); //사용자가 편집된 내용을 취소할 경우를 위한 원본 사이드바 값
  const [editMode, setEditMode] = useState(false); //사이드바 편집모드
  const [disablePreviousBtn, setDisablePreviousBtn] = useState(false);
  const [disableAllShow, setDisableAllShow] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const totalQp = Number(sessionStorage.getItem("totalQp"));

  const logout = async (e) => {
    e.preventDefault();
    dispatch(userInfoSlice.actions.resetProfile());
    sessionStorage.removeItem("close_release_note");
    sessionStorage.removeItem("totalQp");
    authenticationService.logout();
    history.push("/sign/login");
  };

  //저장된 sideBar메뉴 불러오거나 default로 세팅하기
  useEffect(() => {
    if (!_.isEmpty(userInfo?.sideBar?.menuData)) {
      addNewMenu(JSON.parse(userInfo.sideBar.menuData["edittedMenu"]));
      fixWrongFormOfMenu(JSON.parse(userInfo.sideBar.menuData["edittedMenu"]));
    } else {
      // dispatch(getUserType());
      dispatch(getSideBarMenu())
        .then(unwrapResult)
        .then((res) => {
          addNewMenu(JSON.parse(res.menuData.edittedMenu));
          fixWrongFormOfMenu(JSON.parse(res.menuData.edittedMenu));
        })
        .catch((e) => {
          setMenuList(_.cloneDeep(defaultMenuList));
          setOriginalMenuList(_.cloneDeep(defaultMenuList));
        });
    }
  }, []);

  // useEffect(() => {
  //   dispatch(
  //     saveEdittedSideBar(
  //       '[{"id":1,"title":"Request","icon":"/assets/img/icon-menu-project-center-active.svg","iconInactive":"/assets/img/icon-menu-project-center-inactive.svg","sub":[{"id":1,"title":"Video Transcription","url":"/project/create-transcription","visible":true,"external":false,"img":"/assets/img/illust-menu-video-transcription.png","desc":"Request for a video subtitle through your YouTube link"},{"id":2,"title":"Video Translation","url":"/project/create-translation","visible":true,"external":false,"img":"/assets/img/illust-menu-video-translation.png","desc":"Request for a video subtitle translation through your YouTube link"},{"id":3,"title":"Hire Expert","url":"/request/hire-exports","visible":true,"external":false,"img":"/assets/img/illust-menu-hire-exports.png","desc":"Work together for localization"},{"id":4,"title":"Wesub","url":"/wesub","visible":true,"external":false,"img":"/assets/img/illust-menu-wesub.png","desc":"From content creators to viewers and translators, we create contents together"}],"visible":true},{"id":2,"title":"Find Work","icon":"/assets/img/icon-menu-job-noti-active.svg","iconInactive":"/assets/img/icon-menu-job-noti-inactive.svg","sub":[{"id":1,"title":"Taskboard","url":"/tasks/task-board","visible":true,"external":false,"img":"/assets/img/illust-menu-taskboard.png","desc":"Look for tasks just for you"},{"id":2,"title":"Globoard","url":"/job-noti/","visible":true,"external":false,"img":"/assets/img/illust-menu-globoard.png","desc":"Look for all sorts of localization tasks here"}],"visible":true},{"id":3,"title":"Translation Tool","link":"/tasks/create","icon":"/assets/img/icon-translation-tool-enabled.png","iconInactive":"/assets/img/icon-menu-project-center-inactive.svg","sub":[{"id":1,"title":"Glosub","url":"/tasks/create","visible":true,"external":false,"img":"/assets/img/illust-menu-translation-tool.png","desc":"Create captions for your contents"}],"visible":true},{"id":4,"title":"My Page","icon":"/assets/img/icon-menu-my-account-active.svg","iconInactive":"/assets/img/icon-menu-my-account-inactive.svg","sub":[{"id":1,"title":"My Requests","url":"/project/lists","visible":true,"external":false,"img":"/assets/img/illust-menu-my-requests.png","desc":"Check the progress of the project you have requested"},{"id":2,"title":"My Tasks","url":"/tasks/my-tasks","visible":true,"external":false,"img":"/assets/img/illust-menu-my-tasks.png","desc":"Manage your tasks here"},{"id":3,"title":"My Analytics","url":"/my-page/my-analytics","visible":true,"external":false,"img":"/assets/img/illust-menu-my-analytics.png","desc":"Improve your quality through analysis"},{"id":4,"title":"My Withdrawal","url":"/my-page/my-withdrawal","visible":true,"external":false,"img":"/assets/img/illust-menu-my-withdrawal.png","desc":"Check your finished tasks and make a withdrawal"},{"id":5,"title":"Certification Test","url":"/exam/intro","visible":true,"external":false,"img":"/assets/img/illust-menu-certi-test.png","desc":"Be a certified Pro to grab more tasks"}],"visible":true},{"id":5,"title":"PMT","icon":"/assets/img/icon-pmt.svg","iconInactive":"/assets/img/icon-pmt.svg","sub":[{"id":1,"title":"Client","url":"/glopmt/clients","visible":true,"external":true,"img":"/assets/img/illust-menu-my-requests.png","desc":""},{"id":2,"title":"Project","url":"/glopmt/projects","visible":true,"external":true,"img":"/assets/img/illust-menu-my-tasks.png","desc":""},{"id":3,"title":"Invoice","url":"/glopmt/invoices","visible":true,"external":true,"img":"/assets/img/illust-menu-my-analytics.png","desc":""},{"id":4,"title":"DashBoard","url":"/glopmt","visible":true,"external":true,"img":"/assets/img/illust-menu-my-withdrawal.png","desc":""}],"visible":true},null,null,{"id":5,"title":"Setting","icon":"/assets/img/icon-menu-setting-active.png","iconInactive":"/assets/img/icon-menu-setting-inactive.png","sub":[{"id":1,"title":"Password","url":"/my-account/security/change-password","visible":true,"external":false,"img":"","desc":""},{"id":2,"title":"Payment","url":"/payment/payment","visible":true,"external":false,"img":"","desc":""},{"id":3,"title":"Withdrawal","url":"/my-account/setting/set-pin","visible":true,"external":false,"img":"","desc":""},{"id":4,"title":"Notification","url":"/my-account/setting","visible":true,"external":false,"img":"","desc":""}],"visible":true}]'
  //     )
  //   ).then(({ payload }) => {
  //     setMenuList(JSON.parse(payload.menuData.edittedMenu));
  //     setOriginalMenuList(JSON.parse(payload.menuData.edittedMenu));
  //   });
  // }, []);

  function isNotUpdated(menu) {
    return menu === -1;
  }

  function fixWrongFormOfMenu(list) {
    const isNull = list.some((item) => item === null);
    if (isNull) {
      setMenuList(_.cloneDeep(defaultMenuList));
      setOriginalMenuList(_.cloneDeep(defaultMenuList));
      saveUpdatedMenu(defaultMenuList);
    }
  }

  function addNewMenu(list) {
    const requestMenu = list.findIndex((i) => i.title === "Request");
    const translationToolMenu = list.findIndex(
      (i) => i.title === "Translation Tool"
    );
    const pmMenu = list.findIndex((i) => i?.title === "Project Management");

    let glotoonMenu = list[translationToolMenu]?.sub?.findIndex(
      (i) => i.title === "Glotoon"
    );

    let forumMenu = list.findIndex((i) => i?.title === "Forum");

    if (
      isNotUpdated(pmMenu) ||
      isNotUpdated(glotoonMenu) ||
      isNotUpdated(forumMenu)
    ) {
      setMenuList(_.cloneDeep(defaultMenuList));
      setOriginalMenuList(_.cloneDeep(defaultMenuList));
      saveUpdatedMenu(defaultMenuList);
    } else {
      setMenuList(_.cloneDeep(list));
      setOriginalMenuList(_.cloneDeep(list));
    }
  }

  function saveUpdatedMenu(menu) {
    console.log("save : ", menu);
    dispatch(saveEdittedSideBar(JSON.stringify(menu)));
  }

  //menu세팅 변경하기 (visible값)
  function editMenuList({ id, subId, visible, subVisible }) {
    setDisablePreviousBtn(false); //수정된 값이 있으면 previous 버튼이 활성화 되게.
    //subId값이 있는 경우 sub array의 값을 변경해야 하고, subId값이 없는 경우는 가장 바깥 레이어의 오브젝트 값 수정하면 됨
    const idx = copyMenuList.findIndex((i) => i.id === id);
    const subVisibleCount = copyMenuList[idx]?.sub?.filter(
      (i) => i?.visible === true
    ).length;
    if (id && subId) {
      //sub메뉴 수정 부분
      const subIdx = copyMenuList[idx].sub.findIndex((i) => i.id === subId);
      //sub menu가 1개 뿐인 상태에서 sub menu visible을 false / true로 주는 경우 상위 메뉴 visible값도 함께 변하게 함
      //sub array에서 visible=true만 필터한 legnth가 1일 때 상위메뉴를 비활성화
      if (subVisibleCount === 1 && !subVisible) {
        copyMenuList[idx].visible = false;
        copyMenuList[idx].sub[subIdx].visible = subVisible;
        //sub array에서 visible=true만 필터한 legnth가 0일 때 상위메뉴를 활성화
      } else if (
        (subVisibleCount === 0 && subVisible) ||
        (subVisibleCount === 0 && subVisible)
      ) {
        copyMenuList[idx].visible = true;
        copyMenuList[idx].sub[subIdx].visible = subVisible;
      } else {
        copyMenuList[idx].sub[subIdx].visible = subVisible;
      }
    } else {
      //대메뉴 수정 부분
      copyMenuList[idx].visible = visible;
      copyMenuList[idx].sub.forEach((item, idx) => {
        item.visible = visible;
      });
    }
    setMenuList(copyMenuList);
  }

  //show All로 menu리스트 세팅하는 경우
  function showAllMenuList() {
    copyMenuList.forEach((item, idx) => {
      if (!item.visible) {
        item.visible = true;
      }
      item.sub.forEach((subItem, subIdx) => {
        if (!subItem.visible) {
          subItem.visible = true;
        }
      });
      setMenuList(copyMenuList);
    });
    setDisableAllShow(true);
  }

  //menu리스트 변경사항 이전으로 돌리기
  function resetMenuList() {
    setMenuList([...originalMenuList]);
    setDisablePreviousBtn(true);
  }

  useEffect(() => {
    copyMenuList = _.cloneDeep(menuList);
  }, [menuList]);

  //만약 LNB메뉴가 모두 보여지고 있는 상태라면 ALL SHOW버튼 비활성화
  //메뉴에 변경사항이 없을 경우 Previous 버튼 비활성화
  useEffect(() => {
    const visibleCount = menuList.filter((item, idx) => !item?.visible);
    const firstMenu = menuList[0]?.sub?.filter((item, idx) => !item?.visible);
    const secondMenu = menuList[1]?.sub?.filter((item, idx) => !item?.visible);
    const thirdMenu = menuList[2]?.sub?.filter((item, idx) => !item?.visible);
    const fourthMenu = menuList[3]?.sub?.filter((item, idx) => !item?.visible);
    const fifthMenu = menuList[4]?.sub?.filter((item, idx) => !item?.visible);
    const hasChanged = !deepEqual(menuList, originalMenuList);

    if (
      visibleCount?.length === 0 &&
      firstMenu?.length === 0 &&
      secondMenu?.length === 0 &&
      thirdMenu?.length === 0 &&
      fourthMenu?.length === 0 &&
      fifthMenu?.length === 0
    ) {
      setDisableAllShow(true);
    } else {
      setDisableAllShow(false);
    }

    if (hasChanged) {
      setDisablePreviousBtn(false);
    } else {
      setDisablePreviousBtn(true);
    }
  }, [, menuList, originalMenuList]);

  // const container = window !== undefined ? () => window().document.body : undefined;

  function HideOnScroll({ children }) {
    const trigger = useScrollTrigger();
    return (
      <Slide appear={false} direction={"down"} in={!trigger}>
        {children}
      </Slide>
    );
  }
  useEffect(() => {
    if (userInfo?.profile?.email !== undefined) {
      // const finish_release_note = localStorage.getItem(userInfo?.profile?.email) === 'finish_release_note';
      const close_release_note = sessionStorage.getItem("close_release_note");
      if (/* !finish_release_note &&  */ !close_release_note)
        setShowBubble(true);
      if (
        /* finish_release_note ||  */ path !== "/home" ||
        new Date() >= new Date("Thu May 25 2022 00:00:00 GMT+0900")
      ) {
        setShowBubble(false);
      }
    }
  }, [path, userInfo?.profile?.email]);

  function goToTry() {
    window.open("/glopmt/invoices", "_self");
    sessionStorage.setItem("close_release_note", "true");
    GA.trackClickEvent(
      "Release_Note",
      "Release_Note/Button_Click",
      "click try button"
    );
    // localStorage.setItem(userInfo?.profile?.email, 'finish_release_note');
  }

  return (
    <div className={classes.root}>
      <ReleaseNoteBubble
        show={showBubble}
        goToTry={goToTry}
        onHide={() => setShowBubble(!showBubble)}
      />
      {!props.location.pathname.includes("/glotoon/work") && (
        <>
          <CssBaseline />
          <HideOnScroll>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <div className="leftBox">
                  {/* Menu button */}
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                  {/* Logo */}
                  <img
                    style={{ height: "24px" }}
                    className={classes.toolbarLogo + " navbar-brand"}
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/img/temporary_logo-style-1.png"
                    }
                    onClick={() => history.push("/home")}
                    alt=""
                  />
                  {/* Profile image */}
                  <div
                    className="profileImage"
                    onClick={() => history.push("/my-account/profile")}
                  >
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
                  </div>
                </div>

                {/* Profile */}
                <div className={classes.toolbarProfile + " nav-item profile"}>
                  <a className="nav-link">
                    {userInfo?.profile?.profileImageUrl == null && (
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/assets/img/basic-profile.svg"
                        }
                        alt="icon-profile"
                      />
                    )}
                    {userInfo?.profile?.profileImageUrl != null && (
                      <img
                        src={userInfo?.profile?.profileImageUrl}
                        alt="icon-profile"
                      />
                    )}
                    <span className="menu-icon">
                      {userInfo?.profile?.nickname}
                    </span>
                  </a>
                </div>
              </Toolbar>
            </AppBar>
          </HideOnScroll>
          <nav className={classes.drawer}>
            {/* 960px 이하에서 메뉴 icon클릭시 보여지는 Nav */}
            <Hidden xsUp implementation="css">
              <Drawer
                // container={container}
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                className={classes.mobDrawer}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                <SideBarMobile
                  {...props}
                  handleDrawerToggle={handleDrawerToggle}
                  menuList={menuList}
                  copyMenuList={copyMenuList}
                  setOriginalMenuList={setOriginalMenuList}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  disablePreviousBtn={disablePreviousBtn}
                  setDisablePreviousBtn={setDisablePreviousBtn}
                  disableAllShow={disableAllShow}
                  editMenuList={editMenuList}
                  showAllMenuList={showAllMenuList}
                  resetMenuList={resetMenuList}
                  logout={logout}
                  totalQp={totalQp}
                />
              </Drawer>
            </Hidden>
            {/* 960px 이상에서 보여지는 Nav */}
            <Hidden smDown implementation="css">
              <Drawer
                className={classes.drawer}
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                <SideBar
                  {...props}
                  menuList={menuList}
                  setMenuList={setMenuList}
                  copyMenuList={copyMenuList}
                  setOriginalMenuList={setOriginalMenuList}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  disablePreviousBtn={disablePreviousBtn}
                  setDisablePreviousBtn={setDisablePreviousBtn}
                  disableAllShow={disableAllShow}
                  editMenuList={editMenuList}
                  showAllMenuList={showAllMenuList}
                  resetMenuList={resetMenuList}
                  logout={logout}
                  totalQp={totalQp}
                />
              </Drawer>
            </Hidden>
          </nav>{" "}
        </>
      )}

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Router {...props} />
      </main>
    </div>
  );
}

Layout.propTypes = {
  window: PropTypes.func,
};

export default withRouter(Layout);
