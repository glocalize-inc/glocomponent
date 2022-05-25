# 사이드바

pmt를 진행하면서 job-noti에 있는 사이드바 코드를 복제해서 리팩토링을 진행하였습니다.

프로젝트가 다르다보니 한쪽이 변경될때마다 다른쪽도 같이 반영해야 하는 불편함이 생겨버렸습니다.

그래서 분리를 하려고 하는 와중에 pmt 시작할때 보았던 사이드바 코드가 많이 바뀐것을 보고

어떤 내용이 바뀌었는지 정리겸 다시 리팩토링 해보았습니다.

실제로 실행해본 코드는 아니어서 실험적인 코드가 존재합니다.

## 의존 패키지

- @material-ui v4
- lodash
- react-router-dom
- react-dnd
- immutability-helper
- styled-components

## 구조

```
layouts/
  - layout.tsx
  - sidebar/
    - sidebar-wrap.tsx
    - sidebar-web.tsx
    - sidebar-wrap-mobile.tsx
    - sidebar-mobile.tsx
before-layouts/                          --- 리팩토링 전
  - layout.tsx
  - sidebar/
    - sidebar-wrap.tsx
    - sidebar-web.tsx
    - sidebar-wrap-mobile.tsx
    - sidebar-mobile.tsx
```
