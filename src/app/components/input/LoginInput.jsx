const LoginInput = ({ id, type, style, placeholder }) => {
  return (
    <input id={id} type={type} placeholder={placeholder} className={style} />
  );
};
export default LoginInput;
