import React from "react";
export const CodeBar = () => {
    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-row space-x-2">
                <button>
                    Branch Button
                </button>
                <button>
                    Number of Branches button
                </button>
            </div>
            <div className="flex flex-row space-x-2">
                <input placeholder="Search files" className="bg-none " />

                <button>
                    code button
                </button>
            </div>
        </div>
    );
};
