import { useCloud } from "freestyle-sh";
import type { AuthCS } from "../cloudstate/auth";
import Button from "./Button";

export const SignOutButton = () => {
    return (
        <Button
            style="secondary"
            onClick={
                async () => {
                    // delete cookie
                    const auth = useCloud<typeof AuthCS>("auth");
                   await  auth.signOut();
                    window.location.href = "/signout";
            }}
        >
            Sign Out
        </Button>
    );
};
