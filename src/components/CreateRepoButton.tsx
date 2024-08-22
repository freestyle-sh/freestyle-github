import { useCloud } from "freestyle-sh";
import type { AuthCS } from "../cloudstate/auth";
import Button from "./Button";

export const CreateRepoButton = () => {
    return (
        <Button
            style="primary"
            onClick={
                async () => {
                   
                    window.location.href = "/create";
            }}
        >
            Create Repository
        </Button>
    );
};
