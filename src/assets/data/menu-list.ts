type MenuTitle =
  | "Request"
  | "Translation Tool"
  | "Project Management"
  | "Glotoon"
  | "Forum"
  | "Find Work"
  | "My Page"
  | "Setting";

export interface Menu {
  id: number;
  title: MenuTitle;
  icon: string;
  iconInactive: string;
  visible: boolean;
  link?: string;
  sub: SubMenu[];
}

type SubMenuTitle =
  | "Glotoon"
  | "Bulletin Board"
  | "My Board"
  | "Video Transcription"
  | "Video Translation"
  | "Hire Expert"
  | "Wesub"
  | "Taskboard"
  | "Globoard"
  | "Glosub"
  | "My Requests"
  | "My Tasks"
  | "My Analytics"
  | "My Withdrawal"
  | "Certification Test"
  | "Client"
  | "Project"
  | "Invoice"
  | "Dashboard"
  | "Password"
  | "Payment"
  | "Withdrawal"
  | "Notification";

export interface SubMenu {
  id: number;
  title: SubMenuTitle;
  url: string;
  visible: boolean;
  external: boolean;
  img: string;
  desc: string;
}

export const DRAWER_WIDTH = 250;

export const DEFAULT_MENU_LIST: Menu[] = [
  {
    id: 1,
    title: "Forum",
    icon: "/assets/icons/icon-menu-forum.svg",
    iconInactive: "/assets/icons/icon-menu-forum.svg",
    sub: [
      {
        id: 1,
        title: "Bulletin Board",
        url: "/forum/bulletin-board",
        visible: true,
        external: false,
        img: "/assets/img/illust-forum-bulletinboard.svg",
        desc: "A board where you can freely discuss and look for information about GloZ. Feel free to mingle with GloZpro!",
      },
      {
        id: 2,
        title: "My Board",
        url: "/forum/my-board",
        visible: true,
        external: false,
        img: "/assets/img/illust-forum-myboard.svg",
        desc: "",
      },
    ],
    visible: true,
  },
  {
    id: 2,
    title: "Request",
    icon: "/assets/img/icon-menu-project-center-active.svg",
    iconInactive: "/assets/img/icon-menu-project-center-inactive.svg",
    sub: [
      {
        id: 1,
        title: "Video Transcription",
        url: "/project/create-transcription",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-video-transcription.png",
        desc: "Request for a video subtitle through your YouTube link",
      },
      {
        id: 2,
        title: "Video Translation",
        url: "/project/create-translation",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-video-translation.png",
        desc: "Request for a video subtitle translation through your YouTube link",
      },
      {
        id: 3,
        title: "Hire Expert",
        url: "/request/hire-exports",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-hire-exports.png",
        desc: "Work together for localization",
      },
      {
        id: 4,
        title: "Wesub",
        url: "/wesub",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-wesub.png",
        desc: "From content creators to viewers and translators, we create contents together",
      },
    ],
    visible: true,
  },
  {
    id: 3,
    title: "Find Work",
    icon: "/assets/img/icon-menu-job-noti-active.svg",
    iconInactive: "/assets/img/icon-menu-job-noti-inactive.svg",
    sub: [
      {
        id: 1,
        title: "Taskboard",
        url: "/tasks/task-board",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-taskboard.png",
        desc: "Look for tasks just for you",
      },
      {
        id: 2,
        title: "Globoard",
        url: "/job-noti/",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-globoard.png",
        desc: "Look for all sorts of localization tasks here",
      },
    ],
    visible: true,
  },
  {
    id: 4,
    title: "Translation Tool",
    link: `/tasks/create`,
    icon: "/assets/img/icon-translation-tool-enabled.png",
    iconInactive: "/assets/img/icon-menu-project-center-inactive.svg",
    sub: [
      {
        id: 1,
        title: "Glosub",
        url: "/tasks/create",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-translation-tool.png",
        desc: "Create captions for your contents",
      },
      {
        id: 2,
        title: "Glotoon",
        url: "/glotoon",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-glotoon.png",
        desc: "Translate your webtoon",
      },
    ],
    visible: true,
  },
  {
    id: 5,
    title: "My Page",
    icon: "/assets/img/icon-menu-my-account-active.svg",
    iconInactive: "/assets/img/icon-menu-my-account-inactive.svg",
    sub: [
      {
        id: 1,
        title: "My Requests",
        url: "/project/lists",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-my-requests.png",
        desc: "Check the progress of the project you have requested",
      },
      {
        id: 2,
        title: "My Tasks",
        url: "/tasks/my-tasks",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-my-tasks.png",
        desc: "Manage your tasks here",
      },
      {
        id: 3,
        title: "My Analytics",
        url: "/my-page/my-analytics",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-my-analytics.png",
        desc: "Improve your quality through analysis",
      },
      {
        id: 4,
        title: "My Withdrawal",
        url: "/my-page/my-withdrawal", //withdrawal, invoice로 갈 수 있는 메뉴페이지로 이동하게 수정하기
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-my-withdrawal.png",
        desc: "Check your finished tasks and make a withdrawal",
      },
      {
        id: 5,
        title: "Certification Test",
        url: "/exam/intro",
        visible: true,
        external: false,
        img: "/assets/img/illust-menu-certi-test.png",
        desc: "Be a certified Pro to grab more tasks",
      },
    ],
    visible: true,
  },
  {
    id: 6,
    title: "Project Management",
    icon: "/assets/img/icon-pmt.svg",
    iconInactive: "/assets/img/icon-pmt.svg",
    sub: [
      {
        id: 1,
        title: "Client",
        url: "/glopmt/clients",
        visible: true,
        external: true,
        img: "/assets/img/pmt-client.png",
        desc: "",
      },
      {
        id: 2,
        title: "Project",
        url: "/glopmt/projects",
        visible: true,
        external: true,
        img: "/assets/img/pmt-project.png",
        desc: "",
      },
      {
        id: 3,
        title: "Invoice",
        url: "/glopmt/invoices",
        visible: true,
        external: true,
        img: "/assets/img/pmt-invoice.png",
        desc: "",
      },
      {
        id: 4,
        title: "Dashboard",
        url: "/glopmt",
        visible: true,
        external: true,
        img: "/assets/img/pmt-dashboard.png",
        desc: "",
      },
    ],
    visible: true,
  },
  {
    id: 7,
    title: "Setting",
    icon: "/assets/img/icon-menu-setting-active.png",
    iconInactive: "/assets/img/icon-menu-setting-inactive.png",
    sub: [
      {
        id: 1,
        title: "Password",
        url: "/my-account/security/change-password",
        visible: true,
        external: false,
        img: "",
        desc: "",
      },
      {
        id: 2,
        title: "Payment",
        url: "/payment/payment",
        visible: true,
        external: false,
        img: "",
        desc: "",
      },
      {
        id: 3,
        title: "Withdrawal",
        url: "/my-account/setting/set-pin",
        visible: true,
        external: false,
        img: "",
        desc: "",
      },
      {
        id: 4,
        title: "Notification",
        url: "/my-account/setting",
        visible: true,
        external: false,
        img: "",
        desc: "",
      },
    ],
    visible: true,
  },
];
