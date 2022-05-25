import {
  Profile,
  SideBar,
  UserInfo as IUserInfo,
} from "./user-info.interfaces";

/**
 * @todo getter 값이 없는경우 기본값
 */
export class UserInfo implements IUserInfo {
  sidebar: SideBar;
  profile: Profile;
  isError: any;

  constructor(sidebar: SideBar, profile: Profile) {
    this.sidebar = sidebar;
    this.profile = profile;
  }

  get email() {
    return this.profile.email;
  }

  get menuData() {
    return this.sidebar.menuData;
  }

  get edittedMenu() {
    return this.sidebar.menuData.edittedMenu;
  }

  get profileImage() {
    return this.profile.profileImageurl;
  }

  get nickname() {
    return this.profile.nickname;
  }
}
