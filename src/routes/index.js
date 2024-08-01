import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import CheckMail from "../components/CheckMail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import Message from "../pages/Message";
import AuthLayouts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";
const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            children: [{
                path: "register",
                element: <AuthLayouts><Register /></AuthLayouts>
            },
            {
                path: "email",
                element: <AuthLayouts><CheckMail /></AuthLayouts>
            },
            {
                path: "password",
                element: <AuthLayouts><CheckPassword /></AuthLayouts>
            },
            {
                path: '/forgot-password',
                element: <AuthLayouts><ForgotPassword /></AuthLayouts>

            },
            {
                path: "/",
                element: <Home />,
                children: [{ path: ':userId', element: <Message /> }]

            }]
        }
    ]
)
export default router