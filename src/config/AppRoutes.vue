<script>
//LOGIN
import LoginPage from "@/pages/portal/LoginPage.vue";
import RecoverPassword from "@/pages/portal/RecoverPassword.vue";
import RecoverPasswordCode from "@/pages/portal/RecoverPasswordCode.vue";
import FirstAccess from "@/pages/portal/FirstAccess.vue";

//ORDERS
import RegisterOrder from "@/pages/in/RegisterOrder.vue";
import HistoryOrder from "@/pages/in/HistoryOrder.vue";
//USER PROFILE
import UserProfile from "@/pages/in/UserProfile.vue";

const routes = [
  { path: "*", redirect: "/" },
  {
    path: "/",
    component: LoginPage,
    name: "LoginPage",
    meta: { requiresAuth: false },
  },
  {
    path: "/login/recover-password",
    component: RecoverPassword,
    name: "RecoverPasswordPage",
    meta: { requiresAuth: false },
  },
  {
    path: "/login/recover-password/code",
    component: RecoverPasswordCode,
    name: "RecoverPasswordCodePage",
    meta: { requiresAuth: false },
  },
  {
    path: "/login/first-access",
    component: FirstAccess,
    name: "FirstAccessPage",
    meta: { requiresAuth: false },
  },
  //PEDIDO
  {
    path: "/in/orders/register",
    component: RegisterOrder,
    name: "RegisterOrderPage",
    meta: { requiresAuth: true },
  },
  {
    path: "/in/orders/history",
    component: HistoryOrder,
    name: "HistoryOrderPage",
    meta: { requiresAuth: true },
  },
  //USER PROFILE
  {
    path: "/in/profile/edit",
    component: UserProfile,
    name: "UserProfilePage",
    meta: { requiresAuth: true },
  },
];

export default routes;
</script>
