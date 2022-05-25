export interface UserInfo {
  sidebar: SideBar;
  profile: Profile;
}

export interface SideBar {
  menuData: {
    edittedMenu: any;
  };
}

export interface Profile {
  email?: string;
  nickname?: string;
  profileImageurl?: Nullable<string>;
}
