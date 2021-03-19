import Dashboard from "views/Dashboard/Dashboard.js";
import ErrorPage from "views/Pages/ErrorPage.js";
import LockScreenPage from "views/Pages/LockScreenPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import PricingPage from "views/Pages/PricingPage.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import UserProfile from "views/Pages/UserProfile.js";

import SevenAForms from 'views/Forms/SevenAForms'
import FormTemplate from 'views/FormTemplate/FormTemplate'
import FormDetail from 'components/FormDetail/FormDetail'
import FieldDetail from 'components/FieldDetail/FieldDetail'

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import GridOn from "@material-ui/icons/GridOn";
import Image from "@material-ui/icons/Image";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/sevenaforms",
    name: "7(a)ware Forms",
    icon: "content_paste",
    component: SevenAForms,
    layout: "/admin"
  },
  {
    collapse: true,
    name: "7(a) Screens",
    icon: GridOn,
    invisible: true,
    views: [
      {
        path: "/formdetail",
        name: "Form Detail",
        component: FormDetail,
        layout: "/admin"
      },
      {
        path: "/fielddetail",
        name: "Field Detail",
        component: FieldDetail,
        layout: "/admin"
      },
      {
        path: "/formtemplate",
        name: "Form Tempalte",
        component: FormTemplate,
        layout: "/admin"
      },
      {
        path: "/user-page",
        name: "User Profile",
        component: UserProfile,
        layout: "/admin"
      },
    ]
  },  
  {
    collapse: true,
    name: "Pages",
    rtlName: "صفحات",
    icon: Image,
    invisible: true,
    state: "pageCollapse",
    views: [
      {
        path: "/login-page",
        name: "Authentication",
        mini: "L",
        component: LoginPage,
        layout: "/auth"
      },
      {
        path: "/user-page",
        name: "User Profile",
        rtlName: "ملف تعريفي للمستخدم",
        mini: "UP",
        rtlMini: "شع",
        component: UserProfile,
        layout: "/admin"
      },
      {
        path: "/error-page",
        name: "Error Page",
        rtlName: "صفحة الخطأ",
        mini: "E",
        rtlMini: "البريد",
        component: ErrorPage,
        layout: "/auth"
      }
    ]
  },
];
export default dashRoutes;
