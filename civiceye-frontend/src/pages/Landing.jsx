import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Navbar */}
      <nav className="border-b border-[#262626]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white font-bold text-black">
              CE
            </div>

            <div>
              <h1 className="text-xl font-bold">
                CivicEye
              </h1>

              <p className="text-sm text-gray-500">
                Civic Intelligence
              </p>
            </div>
          </div>

          {/* Authentication */}
          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="rounded-lg border border-[#333] px-5 py-2.5 text-sm font-medium transition hover:bg-[#1a1a1a]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
            >
              Register
            </Link>

          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6">

        <div className="w-full max-w-3xl text-center">

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#111] px-4 py-2 text-sm text-gray-400">

            <span className="h-2 w-2 rounded-full bg-red-500"></span>

            AI-powered civic intelligence

          </div>

          {/* Heading */}
          <h2 className="text-6xl font-semibold leading-tight tracking-tight md:text-8xl">

            See it.
            <br />

            Report it.
            <br />

            <span className="text-gray-500">
              Resolve it.
            </span>

          </h2>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-gray-400">

            CivicEye helps citizens report civic issues,
            track their complaints and verify resolutions.

          </p>

          {/* Authentication buttons */}
          <div className="mt-10 flex justify-center gap-4">

            <Link
              to="/login"
              className="rounded-lg border border-[#333] px-8 py-3.5 font-medium transition hover:bg-[#161616]"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-white px-8 py-3.5 font-medium text-black transition hover:bg-gray-200"
            >
              Create Account
            </Link>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626]">

        <div className="mx-auto flex max-w-7xl justify-center px-8 py-5 text-sm text-gray-600">

          © 2026 CivicEye · AI-powered civic intelligence

        </div>

      </footer>

    </div>
  );
}

export default Landing;