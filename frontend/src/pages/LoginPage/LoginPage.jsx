import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImgLogin from "../../assets/image.png";
import Logocnpm from "../../assets/logocnpm.png";

function ForgetPassword({ setShowForgetPassword }) {
  const modelRef = useRef(null);
  const [email, setEmail] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  function closeForgetPassword() {
    if (modelRef.current) {
      modelRef.current.classList.add("animate-zoomOut");
      modelRef.current.parentElement.classList.add("bg-transparent");
      modelRef.current.addEventListener("animationend", () => {
        setShowForgetPassword(false);
      });
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}auth/forgot_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === false) {
        toast.error(data.message);
      } else {
        toast.success(`Mật khẩu mới đã được gửi tới ${data.email}`);
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="bg-[rgba(128,128,128,0.5)] absolute top-0 right-0 left-0 bottom-0  flex items-center justify-center">
      <div
        ref={modelRef}
        className="animate animate-zoomIn  rounded-xl mx-3 h-[340px]  text-center  flex flex-col px-12 pt-3 pb-14 bg-white shadow-2xl sm:w-[600px]"
      >
        <CloseOutlined
          onClick={closeForgetPassword}
          className="ml-auto text-xl hover:bg-[#D2ECF4] hover:cursor-pointer p-2"
        />
        <h1 className="text-2xl font-bold ">Quên mật khẩu</h1>
        <p className="mt-4">
          Vui lòng nhập email đã đăng ký với hệ thống, chúng tôi sẽ giúp bạn lấy
          lại quyền truy cập tài khoản.
        </p>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Vui lòng nhập địa chỉ email"
          className="px-4 py-2 mt-4 mb-6 rounded-xl focus:outline-none border-[1px] border-black"
        />
        <button
          onClick={handleForgotPassword}
          className="bg-[#0688B4] hover:shadow font-bold hover:shadow-[#0688B4] text-white  py-3 rounded-xl"
        >
          Quên mật khẩu
        </button>
      </div>
    </div>
  );
}

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [iconShowPassword, setIconShowPassword] = useState(true);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const passwordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const cheklogin = async () => {
      try {
        const response = await fetch(`${apiUrl}auth/check`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        console.log(data);

        if (response.ok && data.status === false) {
          navigate("/home");
        }
      } catch (error) {
        toast.error("Lỗi khi kiểm tra đăng nhập.");
      }
    };
    cheklogin();
    const passwordInput = passwordRef.current;
    if (showPassword) {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }, [showPassword, navigate, apiUrl]);

  function toggleShowPassword() {
    setShowPassword(!showPassword);
    setIconShowPassword(!iconShowPassword);
  }

  function toggleForgetPassword(e) {
    e.preventDefault();
    setShowForgetPassword(!showForgetPassword);
  }

  function handleKeyDownPW(e) {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  }

  function handleKeyDownEmail(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordRef.current.focus();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}auth/log_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);
        localStorage.setItem("so_trang", data.so_trang);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="flex sm:p-10 p-4 justify-center sm:bg-transparent ms:items-center h-dvh">
      <ToastContainer />
      {/* column left */}
      <div className="sm:flex-1 sm:p-10 p-5 my-auto h-fit text-[#6F6F6F] bg-white rounded-xl sm:rounded-none">
        {/* logo in mobile */}
        <div className="sm:hidden mb-6 flex items-center gap-3 justify-center">
          <img src={Logocnpm} alt="" className="w-10" />
          <span className="text-[#0688B4] font-bold text-3xl">BK SSPS</span>
        </div>
        <h1 className="sm:text-3xl text-lg text-black font-bold text-center">
          DỊCH VỤ XÁC THỰC HCMUT_SSO
        </h1>
        <p className="text-balance text-center mt-6">
          Xin mời bạn nhập đầy đủ thông tin đăng nhập. Sau đó bạn sẽ có quyền
          truy cập và sử dụng các dịch vụ của chúng tôi.
        </p>
        <form
          className="flex flex-col sm:w-[450px] m-auto mt-8"
          onSubmit={handleSubmit}
        >
          <label>Tên đăng nhập</label>
          <input
            type="text"
            placeholder="Vui lòng nhập tên đăng nhập"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDownEmail}
            className="border-[1px] mt-2 mb-4 focus:outline-none border-black sm:w-[450px] px-6 py-2 rounded-xl"
          />
          <label className="">Mật khẩu</label>
          <div className="border-[1px] border-black rounded-xl mt-2 mb-2 flex justify-between w-auto">
            <input
              ref={passwordRef}
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDownPW}
              className="flex-1 block mr-auto focus:outline-none px-6 rounded-xl"
            />
            {iconShowPassword && (
              <EyeInvisibleOutlined
                onClick={toggleShowPassword}
                className="hover:cursor-pointer hover:text-black hover:scale-110 p-[10px] text-xl"
              />
            )}
            {!iconShowPassword && (
              <EyeOutlined
                onClick={toggleShowPassword}
                className="hover:cursor-pointer hover:text-black hover:scale-110 p-[10px] text-xl"
              />
            )}
          </div>

          <button
            onClick={toggleForgetPassword}
            className="text-end px-3 py-2 w-fit ml-auto select-none hover:underline text-[#0688B4]"
          >
            Quên mật khẩu ?
          </button>
          <button
            type="submit"
            className="bg-[#0688B4] px-3 py-3 text-white font-bold rounded-xl mt-6 hover:shadow hover:shadow-[#0688B4]"
          >
            Đăng nhập
          </button>
        </form>
        <div className="text-center mt-20">
          Bạn chưa có tài khoản?
          <Link to="/auth/register" className="text-[#0688B4] hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
      {/* column right */}
      <div className="hidden sm:flex flex-col flex-1 bg-[#D2ECF4] rounded-xl h-[90vh] items-center justify-center gap-6 pt-4">
        <div className="flex items-center justify-center gap-3">
          <img src={Logocnpm} alt="" className="w-14" />
          <h2 className="text-[#0688B4] font-bold text-3xl">BK SSPS</h2>
        </div>
        <img src={ImgLogin} alt="login" className="object-cover" />
      </div>
      {/* pop up forget password */}
      {showForgetPassword && (
        <ForgetPassword setShowForgetPassword={setShowForgetPassword} />
      )}
    </div>
  );
}

export default Login;
