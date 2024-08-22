import React, { useEffect } from "react";
import Button from "./Button";
import Input from "./Input";

export const CreateRepo = () => {
    const [repoName, setRepoName] = React.useState("");
    const [repoDescription, setRepoDescription] = React.useState("");

    const [isFormValid, setIsFormValid] = React.useState(false);

    useEffect(() => {
        if (repoName !== "") {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [repoName]);

    return (
        <div className="py-8 px-4  flex flex-row justify-center items-center w-full">
            <form
                className="flex flex-col mx-8 sm:max-w-[50%]"
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (repoName !== "" && repoDescription !== "") {
                        await useCloud<typeof RepoIndex>("repo-index").createRepo({
                            name: repoName,
                            owner: "JacobZwang",//TODO: HOOK IN KEVIN AUTH AND NOT PASS FROM FRONTEND
                            description: repoDescription,
                        }).then((repoId) => {
                            window.location.href = `/JacobZwang/${repoName}`;
                        });
                    }

                }}
            >
                <h1 className="text-2xl font-semibold">
                    Create a new repository
                </h1>
                <p className="text-gray-500 text-sm">
                    A repository the whole project. We manage them with Git. But
                    not normal Git, we have our own implemenatation written 100%
                    in TypeScript and Freestyle on the backend.
                </p>
                <div className="h-8" />
                <label>
                    <span>Repository Name</span>
                    <Input
                        onChange={(e) => setRepoName(e.target.value)}
                        name="repoName"
                        placeholder={"the-best-repo-ever"}
                    />
                </label>
                <div className="h-4" />
                <label>
                    <span>Description</span>
                    <Input
                        onChange={(e) => setRepoDescription(e.target.value)}
                        onSubmit={(e) => {
                        }}
                        name="repoDescription"
                        placeholder={"A description of the repository"}
                    />
                </label>

                <br />
                <Button style="primary" type="submit" disabled={!isFormValid}>Create Repository</Button>
            </form>
        </div>
    );
};
