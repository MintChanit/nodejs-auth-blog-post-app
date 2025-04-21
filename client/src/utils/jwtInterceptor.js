import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const hastoken = Boolean(window.localStorage.getItem("token"))
    if(hastoken){
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    }

    return req;
  });

  axios.interceptors.response.use(
    (req) => {
      return req;
    },
    (error) => {
      if(error.response.status === 401 &&
        error.response.statusText === "unauthorized"
      ) {
        window.localStorage.removeItem("token")
        window.location.replace("/")
      }

      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;
