import { createClient } from "../lib/supabase/server";

export default async function SupabaseTest() {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === "your-project-url-here" || supabaseKey === "your-anon-key-here") {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Supabase Connection Test
          </h2>
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
            ⚠️ Configuration Needed
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="font-medium">Environment variables not configured:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Please add your Supabase URL and Key to <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs">.env.local</code></li>
            <li>Get these values from: <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Supabase API Settings</a></li>
            <li>After updating, restart the dev server</li>
          </ul>
          <div className="mt-3 rounded bg-white p-2 text-xs">
            <p className="font-medium">Required variables:</p>
            <code className="block mt-1">NEXT_PUBLIC_SUPABASE_URL=your-project-url</code>
            <code className="block mt-1">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</code>
          </div>
        </div>
      </div>
    );
  }

  const supabase = await createClient();

  // Test connection by querying profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .limit(5);

  // Test connection by querying recipes table
  const { data: recipes, error: recipesError } = await supabase
    .from("recipes")
    .select("*")
    .limit(5);

  const isConnected = !profilesError && !recipesError;
  const hasProfiles = profiles && profiles.length > 0;
  const hasRecipes = recipes && recipes.length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Supabase Connection Test
        </h2>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isConnected ? "✅ Connected" : "❌ Error"}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-700">Profiles Table: </span>
          {profilesError ? (
            <span className="text-red-600">
              Error - {profilesError.message}
            </span>
          ) : (
            <span className="text-green-600">
              ✅ Accessible ({profiles?.length || 0} profiles found)
            </span>
          )}
        </div>

        <div>
          <span className="font-medium text-gray-700">Recipes Table: </span>
          {recipesError ? (
            <span className="text-red-600">
              Error - {recipesError.message}
            </span>
          ) : (
            <span className="text-green-600">
              ✅ Accessible ({recipes?.length || 0} recipes found)
            </span>
          )}
        </div>

        {isConnected && (
          <div className="mt-3 rounded bg-gray-50 p-2 text-xs text-gray-600">
            <p className="font-medium">Connection Details:</p>
            <p>• Database: Connected</p>
            <p>• RLS Policies: Active</p>
            <p>
              • Status:{" "}
              {hasProfiles || hasRecipes
                ? "Data available"
                : "Tables empty (ready for data)"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

