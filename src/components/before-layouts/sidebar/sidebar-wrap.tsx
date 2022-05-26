import React, { useEffect, useRef, useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import "./sidebar.scss";
import { useHistory } from "react-router-dom";
import { useDrag, useDrop } from "react-dnd";
import { authenticationService } from "@/service/auth/auth.service";

type DragObject = {
  index: number;
};

export default function SideBarWrap({
  id,
  index,
  moveCard,
  setSelected,
  open,
  main,
  sub,
  onClick,
  icon,
  iconInactive = null,
  editMode,
  propItem,
  editMenuList,
}) {
  const history = useHistory();
  const url = window.location.pathname;
  const [direction, setDirection] = useState("");
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "list",
    hover(item: DragObject, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
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
      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "list",
    item: { type: "list", id, index },
    canDrag: editMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // 드래그가 완전히 끝났을때 실행됨.
    end: (item) => {
      setDirection("");
    },
  });

  drag(drop(ref));

  const moveToExternalLink = async (e, link, external) => {
    e.preventDefault();
    if (authenticationService.isLogin) {
      if (external) {
        window.open(link, "_self");
      } else {
        history.push(link);
      }
    } else {
      history.push("/sign/login");
    }
  };

  useEffect(() => {
    const currentPage = sub?.filter((item) => item.link === url);
    if (!currentPage?.length) {
      return;
    } else {
      setSelected();
    }
  }, [url]);

  return (
    <>
      {(!propItem?.visible && editMode) || propItem?.visible ? (
        <div
          className={
            "itemWrap " +
            (editMode ? "draggingBox " : null) +
            (!propItem?.visible && editMode ? "visibleFalse " : null) +
            " " +
            direction
          }
          ref={ref}
          id={id}
        >
          <div className={"innerWrap " + (editMode ? "draggingBox" : null)}>
            <div className="nav-item">
              <span
                className="nav-link"
                style={{ color: "#111" }}
                onClick={() => (open ? onClick(0) : setSelected())}
              >
                {icon && <img src={icon} alt="" />}
                {main}
              </span>
              {/* edit mode btn */}
              {!propItem?.visible && editMode ? (
                <img
                  className="visibilityIcon"
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/img/icon-visibility-off.png"
                  }
                  alt=""
                  onClick={() =>
                    editMenuList({
                      id: id,
                      subId: false,
                      visible: true,
                      subVisible: false,
                    })
                  }
                />
              ) : editMode ? (
                <img
                  className="visibilityIcon"
                  src={
                    process.env.PUBLIC_URL +
                    "/assets/img/icon-visibility-on.svg"
                  }
                  alt=""
                  onClick={() =>
                    editMenuList({
                      id: id,
                      subId: false,
                      visible: false,
                      subVisible: false,
                    })
                  }
                />
              ) : null}
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <div /* component='div' */>
                {sub?.map((subItem, index) => {
                  return (
                    <div key={index}>
                      {(!subItem?.visible && editMode) || subItem?.visible ? (
                        <div
                          className={
                            "subItem " +
                            (!subItem?.visible && editMode
                              ? "visibleFalse "
                              : null) +
                            (editMode ? " editMode " : null)
                          }
                        >
                          <div
                            className="sub-nav-container"
                            onClick={(e) =>
                              moveToExternalLink(
                                e,
                                subItem?.link,
                                subItem?.external
                              )
                            }
                          >
                            <ListItem button /* className={classes.nested} */>
                              <span
                                className={
                                  "sub-nav " +
                                  (url === subItem?.link ? "active" : "")
                                }
                              >
                                {subItem?.name}
                              </span>
                            </ListItem>
                          </div>
                          {/* edit mode btn */}
                          {!subItem?.visible && editMode ? (
                            <img
                              className="visibilityIcon"
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/img/icon-visibility-off.png"
                              }
                              alt=""
                              onClick={() =>
                                editMenuList({
                                  id: id,
                                  subId: subItem?.id,
                                  visible: true,
                                  subVisible: true,
                                })
                              }
                            />
                          ) : editMode ? (
                            <img
                              className="visibilityIcon"
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/img/icon-visibility-on.svg"
                              }
                              alt=""
                              onClick={() =>
                                editMenuList({
                                  id: id,
                                  subId: subItem?.id,
                                  visible: true,
                                  subVisible: false,
                                })
                              }
                            />
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Collapse>
          </div>
        </div>
      ) : null}
    </>
  );
}
