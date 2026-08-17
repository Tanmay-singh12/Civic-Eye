import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { users } from "../data/dummyData";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
      alert("Email already registered");
      return;
    }

    const newUser = {
      id: `U00${users.length + 1}`,
      name,
      email,
      password,
      role: "citizen",
    };

    users.push(newUser);

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Registration successful!");

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Navbar */}
      <nav className="border-b border-[#262626]">
        <div className="mx-auto flex max-w-7xl items-center px-8 py-6">

          <Link to="/" className="flex items-center gap-4">

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

          </Link>

        </div>
      </nav>

      {/* Register Section */}
      <main className="flex min-h-[calc(100vh-89px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white font-bold text-black">
              CE
            </div>

            <h2 className="text-3xl font-semibold tracking-tight">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Join CivicEye and help improve your city
            </p>

          </div>

          {/* Register Card */}
          <div className="rounded-2xl border border-[#292929] bg-[#0d0d0d] p-8">

            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#333] bg-[#080808] px-4 py-3 text-white outline-none placeholder:text-gray-600 transition focus:border-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#333] bg-[#080808] px-4 py-3 text-white outline-none placeholder:text-gray-600 transition focus:border-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-[#333] bg-[#080808] px-4 py-3 text-white outline-none placeholder:text-gray-600 transition focus:border-white"
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-white py-3.5 font-medium text-black transition hover:bg-gray-200"
              >
                Create Account
              </button>

            </form>

            {/* Login */}
            <div className="mt-6 border-t border-[#292929] pt-6 text-center">

              <p className="text-sm text-gray-500">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="mt-2 inline-block text-sm font-medium text-white hover:underline"
              >
                Login to CivicEye →
              </Link>

            </div>

          </div>

          {/* Back */}
          <div className="mt-6 text-center">

            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-white"
            >
              ← Back to CivicEye
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Register;