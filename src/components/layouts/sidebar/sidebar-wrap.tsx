import React, { useEffect, useMemo, useRef, useState } from "react";
import "./sidebar.scss";
import { useDrag, useDrop } from "react-dnd";
import { Menu, SubMenu } from "../../../assets/data/menu-list";

import { Collapse, ListItem } from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";

type DragObject = {
  index: number;
};

interface Props {
  id: number;
  index: number;
  moveCard: any;
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
  isLogin: boolean;
}

export default function SideBarWrap(props: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [direction, setDirection] = useState("");
  const sidebarRef = useRef<Nullable<HTMLDivElement>>(null);
  const draggingBoxClass = useMemo(
    () => (props.editMode ? "draggingBox" : ""),
    [props.editMode]
  );

  const [, drop] = useDrop({
    accept: "list",
    hover(item: DragObject, monitor) {
      if (!sidebarRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = sidebarRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (clientOffset === null) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        setDirection("downward");
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        setDirection("upward");
        return;
      }
      props.moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [__, drag] = useDrag({
    type: "list",
    item: { type: "list", id: props.id, index: props.index },
    canDrag: props.editMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // 드래그가 완전히 끝났을때 실행됨.
    end: (item) => setDirection(""),
  });

  drag(drop(sidebarRef));

  const moveToExternalLink = async (e: any, link: string, external: any) => {
    e.preventDefault();
    if (props.isLogin) {
      if (external) {
        window.open(link, "_self");
      } else {
        navigate(link);
      }
    } else {
      navigate("/sign/login");
    }
  };

  useEffect(() => {
    const currentPage = props.sub.find(
      (submenu) => submenu.url === location.pathname
    );
    if (!currentPage) return;
    props.setSelected();
  }, [location.pathname]);

  const isCurrentSubItem = (link: string) => {
    const pathname = location.pathname;
    const goodPathname =
      pathname[pathname.length - 1] === "/"
        ? pathname.slice(0, pathname.length - 1)
        : pathname;
    const isBaseUrl = link.split("/").length === 2;
    return isBaseUrl ? goodPathname === link : goodPathname.includes(link);
  };

  const renderSubItems = (subItem: any, index: number) => {
    if (!(subItem.visible || props.editMode)) return null;
    const visibleClass = subItem.visible === false ? "visiblefalse" : "";
    const editModeClass = props.editMode ? "editMode" : "";
    const activeClass = isCurrentSubItem(subItem.link) ? "active" : "";
    return (
      <div key={index}>
        <div className={`subItem ${visibleClass} ${editModeClass}`}>
          <div
            className="sub-nav-container"
            onClick={(e) =>
              moveToExternalLink(e, subItem.link, subItem.external)
            }
          >
            <ListItem button>
              <span className={`sub-nav ${activeClass}`}>{subItem.name}</span>
            </ListItem>
          </div>

          {/* edit mode btn */}
          <EditVisibleIcon
            visible={subItem.visible}
            editMode={props.editMode}
            updateMenuList={() =>
              props.editMenuList({
                id: props.id,
                subId: subItem.id,
                visible: true,
                subVisible: !subItem.visible,
              })
            }
          />
        </div>
      </div>
    );
  };

  if (!(props.propItem.visible && props.editMode)) return null;
  const visibleClass = !props.propItem.visible ? "visibleFalse" : "";
  return (
    <React.Fragment>
      <div
        className={`itemWrap ${draggingBoxClass} ${visibleClass} direction`}
        ref={sidebarRef}
        id={props.id.toString()}
      >
        <div className={`innerWrap ${draggingBoxClass}`}>
          <div className="nav-item">
            <span
              className="nav-link"
              style={{ color: "#111" }}
              onClick={() =>
                props.open ? props.onClick(0) : props.setSelected()
              }
            >
              {props.icon ? <img src={props.icon} alt="" /> : ""}
              {props.main}
            </span>

            {/* edit mode btn */}
            <EditVisibleIcon
              visible={props.propItem.visible}
              editMode={props.editMode}
              updateMenuList={() =>
                props.editMenuList({
                  id: props.id,
                  subId: false,
                  visible: !props.propItem.visible,
                  subVisible: false,
                })
              }
            />
          </div>
          <Collapse in={props.open} timeout="auto" unmountOnExit>
            <div>{props.sub.map(renderSubItems)}</div>
          </Collapse>
        </div>
      </div>
    </React.Fragment>
  );
}

interface EditVisibleIconProps {
  visible: boolean;
  editMode: boolean;
  updateMenuList: any;
}

function EditVisibleIcon({
  visible,
  editMode,
  updateMenuList,
}: EditVisibleIconProps) {
  const src = useMemo(() => {
    return visible
      ? `${process.env.PUBLIC_URL}/assets/img/icon-visibility-on.svg`
      : `${process.env.PUBLIC_URL}/assets/img/icon-visibility-off.png`;
  }, [visible]);
  if (!editMode) return null;
  return (
    <img
      className="visibilityIcon"
      src={src}
      alt="visibility icon"
      onClick={updateMenuList}
    />
  );
}
