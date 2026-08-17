import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ReportIssue() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image");
      return;
    }

    if (!location) {
      alert("Please enter your location");
      return;
    }

    const reportData = {
      imageName: image.name,
      description,
      location,
    };

    localStorage.setItem(
      "reportData",
      JSON.stringify(reportData)
    );

    navigate("/analysis");
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
            className="text-sm text-gray-500 transition hover:text-white"
          >
            ← Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-3xl px-6 py-12">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-sm uppercase tracking-widest text-gray-500">
            Citizen Report
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Report an Issue
          </h2>

          <p className="mt-3 text-gray-500">
            Upload a photo and tell us where the issue is.
            CivicEye will analyze it using AI.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleAnalyze}
          className="rounded-2xl border border-[#292929] bg-[#0d0d0d] p-8"
        >

          {/* Image Upload */}
          <div>

            <label className="text-sm font-medium text-gray-300">
              Issue Photo
            </label>

            <div className="mt-3">

              <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#444] bg-[#080808] px-6 text-center transition hover:border-gray-500">

                {image ? (

                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                      ✓
                    </div>

                    <p className="mt-4 font-medium">
                      {image.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Click to change image
                    </p>
                  </div>

                ) : (

                  <div>

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#333] text-xl text-gray-400">
                      +
                    </div>

                    <p className="mt-4 font-medium">
                      Upload a photo
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      JPG, PNG or WEBP
                    </p>

                  </div>

                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>

            </div>

          </div>

          {/* Description */}
          <div className="mt-8">

            <label className="text-sm font-medium text-gray-300">
              Description
              <span className="ml-2 text-xs text-gray-600">
                Optional
              </span>
            </label>

            <textarea
              placeholder="Describe what you see..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-3 w-full resize-none rounded-lg border border-[#333] bg-[#080808] px-4 py-3 text-white outline-none placeholder:text-gray-600 transition focus:border-white"
            />

          </div>

          {/* Location */}
          <div className="mt-8">

            <label className="text-sm font-medium text-gray-300">
              Location
            </label>

            <input
              type="text"
              placeholder="e.g. Dharampeth, Nagpur"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-3 w-full rounded-lg border border-[#333] bg-[#080808] px-4 py-3 text-white outline-none placeholder:text-gray-600 transition focus:border-white"
            />

            <p className="mt-2 text-xs text-gray-600">
              Enter the area or location where the issue was found.
            </p>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-10 w-full rounded-lg bg-white py-3.5 font-medium text-black transition hover:bg-gray-200"
          >
            Analyze with AI →
          </button>

        </form>

        {/* Info */}
        <div className="mt-6 rounded-xl border border-[#292929] bg-[#0d0d0d] p-5">

          <p className="text-sm font-medium">
            What happens next?
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            CivicEye analyzes your photo to identify the issue,
            estimate severity, suggest the responsible department
            and calculate a civic priority score.
          </p>

        </div>

      </main>

    </div>
  );
}

export default ReportIssue;