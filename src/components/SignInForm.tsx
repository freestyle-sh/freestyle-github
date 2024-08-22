import { useCloud } from "freestyle-sh";
import Button from "./Button";
import { AuthCS } from "../cloudstate/auth";
import { useEffect, useState } from "react";
import React from "react";
import {
    handlePasskeyAuthentication,
    handlePasskeyRegistration,
} from "freestyle-auth/passkey";
import { toast, Toaster } from "sonner";
export const SignInForm = () => {
    const auth = useCloud<typeof AuthCS>("auth");
    const [username, setUsername] = useState("");

    useEffect(() => {
        console.log("user is", username);
    }, [username]);

    return (
        <div className="flex flex-col h-screen w-full items-center justify-center">
            <Toaster richColors closeButton />
            <h1>Sign In Please</h1>
            <div className="bg-[#161b22] p-4 rounded-lg mt-4 flex flex-col px-4">
                <label className="flex flex-col">
                    <span className="text-white mb-4">Username</span>

                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Beyonce"
                        type="text"
                        className="w-full bg-[#0d1117] text-white p-2 rounded-lg mt-2"
                    />
                </label>
                <div className="h-4 w-2 block" />

                <Button
                    onClick={async () => {
                        const cred = await auth.startAuthentication(username).catch((e) => {
                            toast.error("Username not found");
                            throw e;
                        });
                        const key = await handlePasskeyAuthentication(cred);
                        const usr = await auth.finishAuthentication(key);
                        if (usr) {
                            window.location.href = "/";
                        }
                    
                    }}
                    style="primary"
                >
                    Sign In
                </Button>
                <div className="h-4 w-2 block" />
                <button
                    onClick={async () => {
                        console.log("signing up");
                        if (username === "") {
                            toast.error("Username cannot be empty");
                            return;
                        }
                        if (username.length < 3) {
                            toast.error("Username must be at least 3 characters");
                            return;
                        }
                        if (username.length > 20) {
                            toast.error("Username must be less than 20 characters");
                            return;
                        }
                        if (!/^[a-zA-Z0-9_]*$/.test(username)) {
                            toast.error("Username must be alphanumeric");
                            return;
                        }

                        try {
                            console.log("signing up");
                            const cred = await auth.startRegistration(username).catch((e) => {
                                console.log("E CAUGHGT");
                                toast.error("Username already taken");
                                throw e;
                            });
                            const key = await handlePasskeyRegistration(cred);
                            const fin = await auth.finishRegistration(key);
                            if (fin) {
                                window.location.href = "/";
                            }
                        } catch (e) {
                            console.log("E CAUGHGT");
                           
                        }
                    }}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};
