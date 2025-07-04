import Image from "next/image";
import ButtonAuth from "../button/ButtonAuth";
import LoginInput from "../input/LoginInput";

const CardLogin = ({ typeOfPage }) => {
  return (
    <div className="card w-96 shadow-sm bg-blend-color-burn bg-white/10 backdrop-blur-sm bg-opacity-30 rounded-lg">
      <div className="card-body">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto mb-4 rounded-full w-32 h-32"
        />
        <div className="text-center mb-4">
          <p className="text-[#0B0B0F] text-xl font-bold">
            Silahkan Masukkan Akun Anda untuk Login.
          </p>
        </div>
        {typeOfPage === "Login" ? (
          <div className="flex flex-col items-center justify-center gap-2.5">
            <LoginInput
              id="username"
              type="text"
              placeholder="User Name"
              style="input bg-transparent input-neutral text-neutral"
            />
            <LoginInput
              id="password"
              type="text"
              placeholder="Password"
              style="input bg-transparent input-neutral text-neutral"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5">
            <LoginInput
              id="username"
              type="text"
              placeholder="User Name"
              style="input bg-transparent input-neutral text-neutral"
            />
            <LoginInput
              id="password"
              type="text"
              placeholder="Password"
              style="input bg-transparent input-neutral text-neutral"
            />
          </div>
        )}
        <div className="mt-6">
          <ButtonAuth
            style="btn bg-[#A21E20] btn-block border-0 hover:bg-transparent hover:text-[#A21E20] hover:border-[#A21E20] hover:border-2"
            text={typeOfPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CardLogin;
