import api from "./api";

export const signup = (data) => api.post("/auth/signup",data);

export const resendOtp = (data) => api.post("/auth/resend-otp",data)

export const verifyOtp = (data) => api.post("/auth/verify-otp", data)

export const login = async (data) => {

    const response = await api.post("/auth/login",data);
    
    const {token, user} = response.data;
    
    const expiry = Date.now() + 7 *24 * 60* 60*1000;
    localStorage.setItem("token",token);
    localStorage.setItem("tokenExpiry", expiry.toString());
    localStorage.setItem("user",JSON.stringify(user));

    return response;
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("user");
}

export const isValidToken = () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    if( !token || !expiry) return false;
    return Date.now() < Number(expiry);
};


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if( token ){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if ( error.response?.status === 401) {
            logout();
            window.location.href= "/login"
        }
        return Promise.reject(error);
    }
);

