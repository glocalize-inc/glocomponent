import { Slide, useScrollTrigger } from "@material-ui/core";

interface Props {
  children: JSX.Element;
}

export default function HideOnScroll(props: Props) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}
