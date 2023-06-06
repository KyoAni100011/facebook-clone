import { Route, Routes } from "react-router";
import { LoggedOut } from "../Page/LoggedOut";
import { Home } from "../Page/Home";
import { NotFound } from "../Page/NotFound";
import { Watch } from "../Page/Watch";
import { Market } from "../Page/Market";
import { Groups } from "../Page/Groups";
import { Gaming } from "../Page/Gaming";

export const Routers = () => {
  return (
    <Routes>
      <Route index element={<LoggedOut></LoggedOut>}></Route>
      <Route path="/home" element={<Home></Home>}></Route>
      <Route path="*" element={<NotFound></NotFound>}></Route>
      <Route path="/watch" element={<Watch></Watch>}></Route>
      <Route path="/market" element={<Market />}></Route>
      <Route path="/groups" element={<Groups></Groups>}></Route>
      <Route path="/gaming" element={<Gaming></Gaming>}></Route>
    </Routes>
  );
};
