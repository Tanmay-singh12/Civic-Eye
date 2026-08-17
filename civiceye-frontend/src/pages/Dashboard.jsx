import { Link, useNavigate } from "react-router-dom";
import { complaints } from "../data/dummyData";

function Dashboard() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myComplaints = complaints.filter(
    (complaint) => complaint.citizenId === currentUser?.id
  );

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Navbar */}
      <nav className="border-b border-[#262626]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-bold text-black">
              CE
            </div>

            <div>
              <h1 className="font-bold">CivicEye</h1>
              <p className="text-xs text-gray-500">
                Civic Intelligence
              </p>
            </div>
          </Link>

          {/* User */}
          <div className="flex items-center gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500">
                Citizen
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-[#333] px-4 py-2 text-sm text-gray-300 transition hover:bg-[#1a1a1a] hover:text-white"
            >
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-8 py-12">

        {/* Welcome */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Citizen Dashboard
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              Welcome, {currentUser?.name}
            </h2>

            <p className="mt-3 text-gray-500">
              Report civic issues and track their resolution.
            </p>
          </div>

          <Link
            to="/report"
            className="w-fit rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200"
          >
            + Report an Issue
          </Link>

        </div>

        {/* Statistics */}
        <section className="mt-12 grid gap-4 md:grid-cols-3">

          {/* Total */}
          <div className="rounded-xl border border-[#292929] bg-[#0d0d0d] p-6">
            <p className="text-sm text-gray-500">
              Total Complaints
            </p>

            <h3 className="mt-4 text-4xl font-semibold">
              {myComplaints.length}
            </h3>
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-[#292929] bg-[#0d0d0d] p-6">
            <p className="text-sm text-gray-500">
              In Progress
            </p>

            <h3 className="mt-4 text-4xl font-semibold">
              {
                myComplaints.filter(
                  (c) => c.status === "In Progress"
                ).length
              }
            </h3>
          </div>

          {/* Resolved */}
          <div className="rounded-xl border border-[#292929] bg-[#0d0d0d] p-6">
            <p className="text-sm text-gray-500">
              Resolved
            </p>

            <h3 className="mt-4 text-4xl font-semibold">
              {
                myComplaints.filter(
                  (c) => c.status === "Resolved"
                ).length
              }
            </h3>
          </div>

        </section>

        {/* Complaints */}
        <section className="mt-12">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500">
                Activity
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                My Complaints
              </h2>
            </div>
          </div>

          {myComplaints.length === 0 ? (

            <div className="rounded-xl border border-dashed border-[#333] bg-[#0d0d0d] p-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#333] text-gray-500">
                +
              </div>

              <h3 className="mt-5 text-lg font-medium">
                No complaints yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Report your first civic issue to get started.
              </p>

              <Link
                to="/report"
                className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-200"
              >
                Report an Issue
              </Link>

            </div>

          ) : (

            <div className="space-y-4">

              {myComplaints.map((complaint) => (

                <div
                  key={complaint.id}
                  className="rounded-xl border border-[#292929] bg-[#0d0d0d] p-6 transition hover:border-[#444]"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-gray-500">
                          #{complaint.id}
                        </span>

                        <span className="rounded-full border border-[#333] px-3 py-1 text-xs text-gray-400">
                          {complaint.status}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-medium">
                        {complaint.title}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        📍 {complaint.location.address}
                      </p>

                    </div>

                    <div className="flex items-center gap-6">

                      <div>
                        <p className="text-xs text-gray-600">
                          Priority
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          {complaint.priorityScore}
                          <span className="text-sm text-gray-600">
                            /100
                          </span>
                        </p>
                      </div>

                      <Link
                        to={`/tracking/${complaint.id}`}
                        className="rounded-lg border border-[#333] px-4 py-2.5 text-sm font-medium transition hover:bg-[#1a1a1a]"
                      >
                        View →
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;