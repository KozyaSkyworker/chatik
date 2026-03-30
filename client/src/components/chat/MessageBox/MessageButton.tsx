const TEXT_CONTENT = {
  submit: "send",
};

interface Props {
  disabled?: boolean;
  onClick?: () => void;
}

export const MessageButton = ({ disabled, onClick }: Props) => (
  <button
    className={`${
      disabled ? "pointer-events-none" : "pointer-events-auto"
    } disabled:opacity-50 bg-blue-600 cursor-pointer text-white font-medium p-2 uppercase rounded hover:bg-blue-700 active:bg-blue-800 h-max`}
    type="submit"
    onClick={onClick}
    disabled={disabled}
  >
    {TEXT_CONTENT.submit}
  </button>
);
