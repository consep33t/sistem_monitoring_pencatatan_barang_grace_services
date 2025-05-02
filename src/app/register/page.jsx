import CardLogin from "../components/card/CardLogin";

const RegisterPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1>Register Page</h1>
        <p>Please enter your credentials to Register.</p>
        <CardLogin typeOfPage="Register" />
      </div>
    </div>
  );
};
export default RegisterPage;
