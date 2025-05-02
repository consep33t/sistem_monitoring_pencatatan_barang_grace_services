const ButtonAuth = ({ style, text, onClick, disabled }) => {
  return (
    <button className={style} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
export default ButtonAuth;
