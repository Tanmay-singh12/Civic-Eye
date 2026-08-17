import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AIAnalysis() {
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  useEffect(() => {
    const savedReport = localStorage.getItem("reportData");

    if (savedReport) {
      setReport(JSON.parse(savedReport));
    }
  }, []);

  // Temporary AI result
  const aiResult = {
    issue: "Garbage Dumping",
    category: "Solid Waste",
    confidence: 94,
    severity: "HIGH",
    department: "Health & Sanitation",
    priority: 87,
    reason:
      "Large waste accumulation detected near a public/residential area.",
  };

  const handleSubmit = () => {
    const complaintId =
      "CE-" + Math.floor(1000 + Math.random() * 9000);

    const complaint = {
      id: complaintId,
      citizenId: JSON.parse(localStorage.getItem("currentUser"))?.id,
      title: aiResult.issue,
      category: aiResult.category,
      status: "Submitted",
      priorityScore: aiResult.priority,
      location: {
        address: report?.location,
      },
      aiAnalysis: aiResult,
    };

    localStorage.setItem(
      "latestComplaint",
      JSON.stringify(complaint)
    );

    navigate(`/tracking/${complaintId}`);
  };

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
            className="text-sm text-gray-500 hover:text-white"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="mb-10">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#111] px-4 py-2 text-sm text-gray-400">

            <span className="h-2 w-2 rounded-full bg-red-500" />

            AI Analysis Complete

          </div>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight">
            We understand your complaint.
          </h2>

          <p className="mt-3 text-gray-500">
            CivicEye analyzed your report and generated an intelligent
            civic priority assessment.
          </p>

        </div>

        {/* Main Analysis Card */}
        <section className="rounded-2xl border border-[#292929] bg-[#0d0d0d] p-8">

          {/* Issue */}
          <div className="border-b border-[#292929] pb-8">

            <p className="text-xs uppercase tracking-widest text-gray-600">
              Detected Issue
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <div>
                <h3 className="text-3xl font-semibold">
                  {aiResult.issue}
                </h3>

                <p className="mt-2 text-gray-500">
                  Category: {aiResult.category}
                </p>
              </div>

              {/* Confidence */}
              <div className="md:text-right">

                <p className="text-xs uppercase tracking-widest text-gray-600">
                  AI Confidence
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {aiResult.confidence}%
                </p>

              </div>

            </div>

          </div>

          {/* Analysis Grid */}
          <div className="grid gap-4 py-8 md:grid-cols-2">

            {/* Severity */}
            <div className="rounded-xl border border-[#292929] bg-[#080808] p-6">

              <p className="text-xs uppercase tracking-widest text-gray-600">
                Severity
              </p>

              <div className="mt-4 flex items-center gap-3">

                <span className="h-3 w-3 rounded-full bg-red-500" />

                <p className="text-xl font-semibold">
                  {aiResult.severity}
                </p>

              </div>

            </div>

            {/* Department */}
            <div className="rounded-xl border border-[#292929] bg-[#080808] p-6">

              <p className="text-xs uppercase tracking-widest text-gray-600">
                Suggested Department
              </p>

              <p className="mt-4 text-xl font-semibold">
                {aiResult.department}
              </p>

            </div>

          </div>

          {/* Priority */}
          <div className="rounded-xl border border-[#333] bg-[#111] p-7">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Civic Priority Score
                </p>

                <p className="mt-2 text-gray-500">
                  Based on severity, public impact and location risk.
                </p>

              </div>

              <div className="text-left md:text-right">

                <p className="text-5xl font-semibold">
                  {aiResult.priority}
                  <span className="text-xl text-gray-600">
                    /100
                  </span>
                </p>

                <p className="mt-1 text-sm text-red-400">
                  High Priority
                </p>

              </div>

            </div>

            {/* Progress */}
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#292929]">

              <div
                className="h-full rounded-full bg-red-500"
                style={{
                  width: `${aiResult.priority}%`,
                }}
              />

            </div>

          </div>

          {/* Reasoning */}
          <div className="mt-6 rounded-xl border border-[#292929] bg-[#080808] p-6">

            <p className="text-xs uppercase tracking-widest text-gray-600">
              AI Reasoning
            </p>

            <p className="mt-4 leading-7 text-gray-400">
              {aiResult.reason}
            </p>

          </div>

          {/* Location */}
          <div className="mt-6 rounded-xl border border-[#292929] bg-[#080808] p-6">

            <p className="text-xs uppercase tracking-widest text-gray-600">
              Report Location
            </p>

            <p className="mt-3 text-lg">
              📍 {report?.location || "Location not provided"}
            </p>

          </div>

        </section>

        {/* Action */}
        <div className="mt-8 flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">

          <Link
            to="/report"
            className="text-center text-sm text-gray-500 hover:text-white"
          >
            ← Edit Report
          </Link>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-white px-8 py-3.5 font-medium text-black transition hover:bg-gray-200"
          >
            Submit Complaint →
          </button>

        </div>

        {/* Demo Notice */}
        <p className="mt-8 text-center text-xs text-gray-700">
          AI analysis shown here is prototype demonstration data.
        </p>

      </main>

    </div>
  );
}

export default AIAnalysis;