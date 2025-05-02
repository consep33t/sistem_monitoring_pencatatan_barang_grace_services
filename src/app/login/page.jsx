import CardLogin from "../components/card/CardLogin";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>Login Page</h1>
      <p>Please enter your credentials to log in.</p>
      <CardLogin typeOfPage="Login" />
    </div>
  );
};
export default LoginPage;
