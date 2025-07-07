import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "../../router/routes";

const TEXT_CONTENT = {
  title: "Hi there",
  submit: "join",
};

interface FormValuesProps {
  name: string;
  room: string;
}

export const Form = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValuesProps>({
    name: "",
    room: "",
  });

  const formSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimName = formValues.name.trim();

    if (trimName) {
      navigate(`${ROUTES.CHAT}?name=${trimName}&room=${formValues.room}`);
    }
  };

  return (
    <form
      className="bg-white w-1/4 flex flex-col gap-6 p-6 rounded"
      onSubmit={formSubmit}
    >
      <h1 className="w-max mx-auto text-xl font-bold">{TEXT_CONTENT.title}</h1>
      <input
        className={`border rounded px-2 py-1`}
        type="text"
        value={formValues.name}
        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        name="name"
        id="name"
        placeholder="Name"
      />
      <input
        className={`border rounded px-2 py-1`}
        type="text"
        value={formValues.room}
        onChange={(e) => setFormValues({ ...formValues, room: e.target.value })}
        name="room"
        id="room"
        placeholder="Room"
      />
      <button
        className={`${
          formValues.name.trim() ? "pointer-events-auto" : "pointer-events-none"
        } disabled:opacity-50 bg-teal-600 cursor-pointer text-white font-medium p-2 uppercase rounded hover:bg-teal-700 active:bg-teal-800`}
        disabled={!formValues.name.trim() || !formValues.room.trim()}
        type="submit"
      >
        {TEXT_CONTENT.submit}
      </button>
    </form>
  );
};
