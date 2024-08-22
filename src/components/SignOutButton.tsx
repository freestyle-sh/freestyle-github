import { useCloud } from "freestyle-sh";
import type { AuthCS } from "../cloudstate/auth";

export const SignOutButton = () => {
    return (
        <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
            onClick={
                async () => {
                    // delete cookie
                    const auth = useCloud<typeof AuthCS>("auth");
                   await  auth.signOut();
                    window.location.href = "/signout";
            }}
        >
            Sign Out
        </button>
    );
};
