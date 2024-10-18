import { useCloudQuery } from "freestyle-sh/react";
import {
  MapPin,
  Link as LinkIcon,
  Users,
  Star,
  GitFork,
  Calendar,
} from "lucide-react";

export function AccountPage(props: {
  user: { username: string };
  repos: { id: string; name: string; description: string }[];
}) {
  return (
    <div className="text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content */}
          <div className="flex-grow">
            {/* Profile header */}
            <div className="flex items-center gap-4 mb-8">
              <img
                src="https://picsum.photos/id/1015/96/96"
                alt={`@${props.user.username}`}
                className="w-24 h-24 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold">{props.user.username}</h1>
                <p className="text-xl text-gray-400">@{props.user.username}</p>
              </div>
            </div>

            {/* Bio and follow button */}
            {/* <div className="mb-8">
              <p className="mb-4">
                Software developer passionate about open source and building
                great user experiences.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Follow
              </button>
            </div> */}

            {/* Contribution graph */}
            {/* <div className="mb-8 border border-gray-700 rounded-lg">
              <h2 className="text-lg font-semibold p-4 border-b border-gray-700">
                Contributions
              </h2>
              <div className="p-4">
                <div className="h-28 bg-gray-800 rounded-md flex items-center justify-center">
                  Placeholder for contribution graph
                </div>
              </div>
            </div> */}

            {/* Popular repositories */}
            <h2 className="text-xl font-semibold mb-4">Repositories</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {props.repos.map((repo) => (
                <div
                  key={repo}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <h3 className="text-base font-medium mb-2">
                    <a
                      href={`/${props.user.username}/${repo.name}`}
                      className="text-blue-400 hover:underline"
                    >
                      {repo.name}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {/* <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-yellow-400" />
                      JavaScript
                    </span> */}
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />0
                    </span>
                    {/* <span className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      45
                    </span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          {/* <div className="w-full md:w-1/3">
            <div className="border border-gray-700 rounded-lg p-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>
                    <strong>1.5k</strong> followers · <strong>100</strong>{" "}
                    following
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>San Francisco, CA</span>
                </li>
                <li className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-gray-400" />
                  <a href="#" className="text-blue-400 hover:underline">
                    https://johndoe.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>Joined September 2015</span>
                </li>
              </ul>
            </div> */}

          {/* <h3 className="font-semibold mt-6 mb-2">Organizations</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((org) => (
                <img
                  key={org}
                  src={`/placeholder.svg?height=32&width=32&text=Org${org}`}
                  alt={`Organization ${org}`}
                  className="w-8 h-8 rounded-md bg-gray-800"
                />
              ))}
            </div>

            <h3 className="font-semibold mt-6 mb-2">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {["Arctic Code Vault Contributor", "GitHub Star", "Pro"].map(
                (achievement) => (
                  <span
                    key={achievement}
                    className="bg-gray-800 text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {achievement}
                  </span>
                )
              )}
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
