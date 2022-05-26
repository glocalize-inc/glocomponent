import React, { useEffect, useState } from "react";
import "./layout.scss";

// router
import { useNavigate, useLocation } from "react-router-dom";

// components
import SideBar from "./sidebar/sidebar-web";
import SideBarMobile from "./sidebar/sidebar-mobile";
import ReleaseNoteBubble from "../common/release-note";
import HideOnScroll from "../common/hide-on-scroll";

// constant
import {
  DEFAULT_MENU_LIST,
  DRAWER_WIDTH,
  Menu,
  SubMenu,
} from "../../assets/data/menu-list";

// material-ui
import {
  AppBar,
  CssBaseline,
  Drawer,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

// util
import _ from "lodash";
import { UserInfo } from "../../features/user-info/user-info";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
      },
      zIndex: 100,
    },
    appBar: {
      [theme.breakpoints.up(theme.breakpoints.values.md)]: {
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
      width: DRAWER_WIDTH,
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

interface Props {
  isFetching: boolean;
  isLogin: boolean;
  logout: (e: any) => Promise<void>;
  userInfo: UserInfo;
  updateMenu: (menuList: string) => void;
  trackClickEvent: any;
}

function Layout(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showBubble, setShowBubble] = useState(false);

  //sideBar props
  const [menuList, setMenuList] = useState<Menu[]>([]); //편집된 사이드바 내용을 저장할 값
  const [originalMenuList, setOriginalMenuList] = useState<Menu[]>([]); //사용자가 편집된 내용을 취소할 경우를 위한 원본 사이드바 값
  const [editMode, setEditMode] = useState(false); //사이드바 편집모드
  const [disableAllShow, setDisableAllShow] = useState(false);
  const [disablePreviousButton, setDisablePreviousButton] = useState(false);
  let copyMenuList = _.cloneDeep(menuList); //setMenuList를 쉽게 하기 위해 카피해둔 값

  const totalQp = Number(sessionStorage.getItem("totalQp"));

  /**
   * @description 서버에 저장된 메뉴 또는 기본 메뉴 동기화
   */
  function syncMenuList() {
    const edittedMenu: Menu[] = JSON.parse(props.userInfo.edittedMenu);
    if (!_.isEmpty(edittedMenu)) {
      if (edittedMenu.some((menu) => menu === null)) {
        fixWrongFormOfMenu(edittedMenu);
      } else {
        addMenu(edittedMenu);
      }
    } else {
      setMenuList(_.cloneDeep(DEFAULT_MENU_LIST));
      setOriginalMenuList(_.cloneDeep(DEFAULT_MENU_LIST));
    }
  }

  useEffect(() => {
    syncMenuList();
  }, []);

  /**
   * @description 서버에 저장했던 메뉴 추가
   * @before addNewMenu
   */
  function addMenu(edittedMenu: Menu[]) {
    const forumMenu = edittedMenu.find((menu) => menu.title === "Forum");
    const projectManagementMenu = edittedMenu.find(
      (menu) => menu.title === "Project Management"
    );

    // submenu
    const translationToolMenu = edittedMenu.find(
      (menu) => menu.title === "Translation Tool"
    );
    const glotoonMenu = translationToolMenu?.sub.find(
      (submenu) => submenu.title === "Glotoon"
    );

    // !! 새로운 메뉴가 추가될때마다 아래와 같이 처리 해주어야 함
    //    1. saveUpdatedMenu 할때마다 DEFAULT_MENU_LIST가 덮어써짐
    if (!projectManagementMenu || !glotoonMenu || !forumMenu) {
      setMenuList(_.cloneDeep(DEFAULT_MENU_LIST));
      setOriginalMenuList(_.cloneDeep(DEFAULT_MENU_LIST));
      saveUpdatedMenu(DEFAULT_MENU_LIST);
    } else {
      setMenuList(_.cloneDeep(edittedMenu));
      setOriginalMenuList(_.cloneDeep(edittedMenu));
    }
  }

  function fixWrongFormOfMenu(edittedMenu: Menu[]) {
    const isNull = edittedMenu.some((menu) => menu === null);
    if (isNull) {
      setMenuList(_.cloneDeep(DEFAULT_MENU_LIST));
      setOriginalMenuList(_.cloneDeep(DEFAULT_MENU_LIST));
      saveUpdatedMenu(DEFAULT_MENU_LIST);
    }
  }

  /**
   * @description DEFAULT_MENU_LIST를 서버에 저장
   */
  function saveUpdatedMenu(menuList: Menu[]) {
    props.updateMenu(JSON.stringify(menuList));
  }

  interface EditMenuParams {
    id: number;
    subId: number;
    visible: boolean;
    subVisible: boolean;
  }

  function reduceVisibleCount(result: number, submenu: SubMenu) {
    return result + (submenu.visible ? 1 : 0);
  }

  //menu세팅 변경하기 (visible값)
  /**
   * @description menu세팅 변경하기 (visible값)
   * @before editMenuList
   */
  function handleEditMenuList(params: EditMenuParams) {
    //수정된 값이 있으면 previous 버튼이 활성화 되게.
    setDisablePreviousButton(false);

    // subId값이 있는 경우 sub array의 값을 변경해야 하고,
    // subId값이 없는 경우는 가장 바깥 레이어의 오브젝트 값 수정하면 됨
    const currentMenu = copyMenuList.find((menu) => menu.id === params.id);
    if (!currentMenu) return;
    const subVisibleCount = currentMenu?.sub.reduce(reduceVisibleCount, 0);

    if (params.id && params.subId) {
      // sub메뉴 수정 부분
      const subMenu = currentMenu.sub.find(
        (submenu) => submenu.id === params.subId
      );
      if (!subMenu) return;

      // sub menu가 1개 뿐인 상태에서 sub menu visible을 false / true로 주는 경우 상위 메뉴 visible값도 함께 변하게 함
      // sub array에서 visible=true만 필터한 legnth가 1일 때 상위메뉴를 비활성화
      if (subVisibleCount === 1 && !params.subVisible) {
        currentMenu.visible = false;
      } else if (subVisibleCount === 0 && params.subVisible) {
        // sub array에서 visible=true만 필터한 legnth가 0일 때 상위메뉴를 활성화
        currentMenu.visible = true;
      }
      subMenu.visible = params.subVisible;
    } else {
      // 대메뉴 수정 부분
      currentMenu.visible = params.visible;
      currentMenu.sub.forEach((menu) => (menu.visible = params.visible));
    }
    setMenuList(copyMenuList);
  }

  //show All로 menu리스트 세팅하는 경우
  /**
   * @description show All로 menu리스트 세팅하는 경우
   * @before showAllMenuList
   */
  function handleShowAllMenuList() {
    if (!disableAllShow) {
      copyMenuList.forEach((menu) => {
        menu.visible = true;
        menu.sub.forEach((submenu) => {
          submenu.visible = true;
        });
      });
      setMenuList(copyMenuList);
      setDisableAllShow(true);
    }
  }

  /**
   * @description menu리스트 변경사항 이전으로 돌리기
   * @before resetMenuList
   */
  function handleResetMenuList() {
    if (!disablePreviousButton) {
      setMenuList(_.cloneDeep(originalMenuList));
      setDisablePreviousButton(true);
    }
  }

  useEffect(() => {
    copyMenuList = _.cloneDeep(menuList);
  }, [menuList]);

  const isInvisible = (item: Menu | SubMenu) => item.visible === false;

  /**
   * @description 만약 LNB메뉴가 모두 보여지고 있는 상태라면 ALL SHOW 버튼 비활성화
   */
  function updateDisableAllShow() {
    const someInvisibleMenu = menuList.some((menu) => {
      return isInvisible(menu) || menu.sub.some(isInvisible);
    });
    setDisableAllShow(!someInvisibleMenu);
  }

  /**
   * @description 메뉴에 번경사항이 없을 경우 Previous 버튼 비활성화
   */
  function updateDisablePreviousButton(source: Menu[], target: Menu[]) {
    const hasChanged = !_.isEqual(source, target);
    setDisablePreviousButton(!hasChanged);
  }

  useEffect(() => {
    updateDisableAllShow();
    updateDisablePreviousButton(originalMenuList, menuList);
  }, [menuList, originalMenuList]);

  /**
   * @description 릴리즈 기한이 지나면 show button = false
   */
  function updateReleaseNote() {
    if (!props.userInfo.email) {
      const closeReleaseNote = sessionStorage.getItem("close_release_note");
      if (!closeReleaseNote) setShowBubble(true);
      if (
        location.pathname !== "/home" ||
        new Date() > new Date("Thu May 25 2022 00:00:00 GMT+0900")
      )
        setShowBubble(false);
    }
  }

  useEffect(() => {
    updateReleaseNote();
  }, [location.pathname, props.userInfo.email]);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleNavigateInvoice() {
    window.open("/glopmt/invoices", "_self");
    sessionStorage.setItem("close_release_note", "true");
    props.trackClickEvent(
      "Release_Note",
      "Release_Note/Button_Click",
      "click try button"
    );
  }

  function handleHideReleaseNote() {
    setShowBubble(!showBubble);
    sessionStorage.setItem("close_release_note", "true");
  }

  /**
   * @todo 데이터 가져오고 있을때 보여줄 화면
   */
  if (props.isFetching) {
    <div>...data fetching</div>;
  }

  return (
    <div className={classes.root}>
      <ReleaseNoteBubble
        show={showBubble}
        goToTry={handleNavigateInvoice}
        onHide={handleHideReleaseNote}
      />
      {!location.pathname.includes("/glotoon/work") ? (
        <React.Fragment>
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
                    onClick={() => navigate("/home")}
                    alt=""
                  />

                  {/* Profile image */}
                  <div
                    className="profileImage"
                    onClick={() => navigate("/my-account/profile")}
                  >
                    <img
                      src={
                        props.userInfo.profileImage ||
                        `${process.env.PUBLIC_URL}/assets/img/basic-profile.svg`
                      }
                      alt="icon-profile"
                    />
                  </div>
                </div>

                {/* Profile */}
                <div className={classes.toolbarProfile + " nav-item profile"}>
                  <a className="nav-link">
                    <img
                      src={
                        props.userInfo.profileImage ||
                        `${process.env.PUBLIC_URL}/assets/img/basic-profile.svg`
                      }
                      alt="icon-profile"
                    />
                    <span className="menu-icon">{props.userInfo.nickname}</span>
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
                  handleDrawerToggle={handleDrawerToggle}
                  menuList={menuList}
                  copyMenuList={copyMenuList}
                  setOriginalMenuList={setOriginalMenuList}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  disablePreviousButton={disablePreviousButton}
                  setDisablePreviousButton={setDisablePreviousButton}
                  disableAllShow={disableAllShow}
                  editMenuList={handleEditMenuList}
                  showAllMenuList={handleShowAllMenuList}
                  resetMenuList={handleResetMenuList}
                  logout={props.logout}
                  totalQp={totalQp}
                  userInfo={props.userInfo}
                  saveEdittedSideBar={() => {
                    return new Promise(() => {});
                  }}
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
                  menuList={menuList}
                  setMenuList={setMenuList}
                  copyMenuList={copyMenuList}
                  setOriginalMenuList={setOriginalMenuList}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  disablePreviousButton={disablePreviousButton}
                  setDisablePreviousButton={setDisablePreviousButton}
                  disableAllShow={disableAllShow}
                  editMenuList={handleEditMenuList}
                  showAllMenuList={handleShowAllMenuList}
                  resetMenuList={handleResetMenuList}
                  logout={props.logout}
                  totalQp={totalQp}
                  userInfo={props.userInfo}
                  saveEdittedSideBar={() => {
                    return new Promise(() => {});
                  }}
                  isLogin={props.isLogin}
                />
              </Drawer>
            </Hidden>
          </nav>{" "}
        </React.Fragment>
      ) : (
        ""
      )}

      {/**
       * @todo 사이드바 영역만 배포되어야함
       */}
      {/* <main className={classes.content}>
        <div className={classes.toolbar} />
        <Router {...props} />
      </main> */}
    </div>
  );
}

export default Layout;
