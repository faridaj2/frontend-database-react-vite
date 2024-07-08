import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

function Middleware() {

    const login = useSelector((state) => state.isAuthenticated);
    const navigate = useNavigate();
    return useEffect(() => {
        if (!login) {
            navigate("/");
        } else {
            navigate("/dashboard");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
export default Middleware