import ButtonAuth from "../button/ButtonAuth";
import LoginInput from "../input/LoginInput";

const CardLogin = ({ typeOfPage }) => {
  return (
    <div className="card w-96 shadow-sm">
      <div className="card-body">
        {typeOfPage === "Login" ? (
          <div className="flex flex-col items-center justify-center gap-2.5">
            <LoginInput
              id="username"
              type="text"
              placeholder="User Name"
              style="input bg-transparent input-info"
            />
            <LoginInput
              id="password"
              type="text"
              placeholder="Password"
              style="input bg-transparent input-info"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5">
            <LoginInput
              id="username"
              type="text"
              placeholder="User Name"
              style="input bg-transparent input-info"
            />
            <LoginInput
              id="password"
              type="text"
              placeholder="Password"
              style="input bg-transparent input-info"
            />
          </div>
        )}
        <div className="mt-6">
          <ButtonAuth style="btn btn-primary btn-block" text={typeOfPage} />
        </div>
      </div>
    </div>
  );
};

export default CardLogin;
