import Link from "next/link";

const ButtonAuth = ({ style, text, onClick, disabled }) => {
  return (
    <Link href="/">
      <button className={style} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </Link>
  );
};
export default ButtonAuth;
