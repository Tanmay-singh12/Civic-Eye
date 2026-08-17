import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ComplaintTracking() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const savedComplaint = localStorage.getItem("latestComplaint");

    if (savedComplaint) {
      setComplaint(JSON.parse(savedComplaint));
    }
  }, []);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#080808] text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              Complaint not found
            </h2>

            <Link
              to="/dashboard"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-sm font-medium text-black"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    "Submitted",
    "AI Classified",
    "Assigned",
    "In Progress",
    "Resolution",
    "Verified",
  ];

  const currentIndex = steps.indexOf(complaint.status);

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Navbar */}
      <nav className="border-b border-[#262626]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <Link to="/dashboard" className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-bold text-black">
              CE
            </div>

            <div>
              <h1 className="font-bold">
                CivicEye
              </h1>

              <p className="text-xs text-gray-500">
                Civic Intelligence
              </p>
            </div>

          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-gray-500 transition hover:text-white"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="mb-10">

          <p className="font-mono text-sm text-gray-600">
            COMPLAINT #{id}
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            {complaint.title}
          </h2>

          <p className="mt-3 text-gray-500">
            📍 {complaint.location.address}
          </p>

        </div>

        {/* Complaint Overview */}
        <section className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-[#292929] bg-[#0d0d0d] p-6">
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Current Status
            </p>

            <p className="mt-3 text-xl font-medium">
              {complaint.status}
            </p>
          </div>

          <div className="rounded-xl border border-[#292929] bg-[#0d0d0d] p-6">
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Priority Score
            </p>

            <p className="mt-3 text-xl font-medium">
              {complaint.priorityScore}
              <span className="text-sm text-gray-600">
                /100
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-[#292929] bg-[#0d0d0d] p-6">
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Department
            </p>

            <p className="mt-3 text-xl font-medium">
              {complaint.aiAnalysis.department}
            </p>
          </div>

        </section>

        {/* Timeline */}
        <section className="mt-10 rounded-xl border border-[#292929] bg-[#0d0d0d] p-8">

          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Complaint Lifecycle
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              Track your complaint
            </h3>
          </div>

          <div className="space-y-0">

            {steps.map((step, index) => {

              const completed = index < currentIndex;
              const current = index === currentIndex;
              const upcoming = index > currentIndex;

              return (
                <div
                  key={step}
                  className="relative flex gap-5"
                >

                  {/* Timeline line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-[15px] top-8 h-full w-px ${
                        index < currentIndex
                          ? "bg-white"
                          : "bg-[#333]"
                      }`}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                      completed
                        ? "border-white bg-white text-black"
                        : current
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-[#444] bg-[#0d0d0d] text-gray-600"
                    }`}
                  >
                    {completed ? "✓" : index + 1}
                  </div>

                  {/* Content */}
                  <div className="pb-10">

                    <p
                      className={`font-medium ${
                        upcoming
                          ? "text-gray-600"
                          : "text-white"
                      }`}
                    >
                      {step}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {completed
                        ? "Completed"
                        : current
                        ? "Current stage"
                        : "Waiting"}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* AI Analysis */}
        <section className="mt-6 rounded-xl border border-[#292929] bg-[#0d0d0d] p-8">

          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-gray-600">
              AI Intelligence
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              Complaint Analysis
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-lg border border-[#292929] bg-[#080808] p-5">
              <p className="text-sm text-gray-600">
                Detected Issue
              </p>

              <p className="mt-2 font-medium">
                {complaint.aiAnalysis.issue}
              </p>
            </div>

            <div className="rounded-lg border border-[#292929] bg-[#080808] p-5">
              <p className="text-sm text-gray-600">
                AI Confidence
              </p>

              <p className="mt-2 font-medium">
                {complaint.aiAnalysis.confidence}%
              </p>
            </div>

            <div className="rounded-lg border border-[#292929] bg-[#080808] p-5">
              <p className="text-sm text-gray-600">
                Severity
              </p>

              <p className="mt-2 font-medium">
                {complaint.aiAnalysis.severity}
              </p>
            </div>

            <div className="rounded-lg border border-[#292929] bg-[#080808] p-5">
              <p className="text-sm text-gray-600">
                Suggested Department
              </p>

              <p className="mt-2 font-medium">
                {complaint.aiAnalysis.department}
              </p>
            </div>

          </div>

        </section>

        {/* Back */}
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </main>

    </div>
  );
}

export default ComplaintTracking;