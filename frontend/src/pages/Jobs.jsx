import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllJobErrors, fetchJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { jobs, loading, error } = useSelector((state) => state.jobs);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche]);

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
  };

  const handleNicheChange = (selectedNiche) => {
    setNiche(selectedNiche);
  };

  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  const cities = [
    "All",
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "New York",
    "Ghaziabad",
  ];

  const nichesArray = [
    "All",
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search for jobs..."
            />
            <button onClick={handleSearch}>Find Job</button>
            <FaSearch />
          </div>
          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job By City</h2>
                {cities.map((cityOption, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={cityOption}
                      name="city"
                      value={cityOption}
                      checked={city === cityOption}
                      onChange={() => handleCityChange(cityOption)}
                    />
                    <label htmlFor={cityOption}>{cityOption}</label>
                  </div>
                ))}
              </div>
              <div className="niches">
                <h2>Filter Job By Niche</h2>
                {nichesArray.map((nicheOption, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={nicheOption}
                      name="niche"
                      value={nicheOption}
                      checked={niche === nicheOption}
                      onChange={() => handleNicheChange(nicheOption)}
                    />
                    <label htmlFor={nicheOption}>{nicheOption}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  <option value="">Filter By City</option>
                  {cities.map((cityOption, index) => (
                    <option value={cityOption} key={index}>
                      {cityOption}
                    </option>
                  ))}
                </select>
                <select
                  value={niche}
                  onChange={(e) => handleNicheChange(e.target.value)}
                >
                  <option value="">Filter By Niche</option>
                  {nichesArray.map((nicheOption, index) => (
                    <option value={nicheOption} key={index}>
                      {nicheOption}
                    </option>
                  ))}
                </select>
              </div>

              <div className="jobs_container">
                {jobs && jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div className="card" key={job._id}>
                      {job.hiringMultipleCandidates === "Yes" ? (
                        <p className="hiring-multiple">
                          Hiring Multiple Candidates
                        </p>
                      ) : (
                        <p className="hiring">Hiring</p>
                      )}
                      <p className="title">{job.title}</p>
                      <p className="company">{job.companyName}</p>
                      <p className="location">{job.location}</p>
                      <p className="salary">
                        <span>Salary:</span> Rs. {job.salary}
                      </p>
                      <p className="posted">
                        <span>Posted On:</span>{" "}
                        {job.jobPostedOn.substring(0, 10)}
                      </p>
                      <div className="btn-wrapper">
                        <Link
                          className="btn"
                          to={`/post/application/${job._id}`}
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-jobs">
                    <img
                      src="./error-404-06.jpg"
                      alt="No jobs found"
                      style={{ width: "70%" }}
                    />
                    <p>No jobs found. Try adjusting your filters or search keywords.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
