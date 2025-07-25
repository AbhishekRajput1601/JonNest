import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body;
  if (
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    !qualifications ||
    !salary ||
    !jobNiche
  ) {
    return next(new ErrorHandler(400, "Please provide full job details."));
  }
  if (
    (personalWebsiteTitle && !personalWebsiteUrl) ||
    (!personalWebsiteTitle && personalWebsiteUrl)
  ) {
    return next(
      new ErrorHandler(
        "Provide both the website url and title, or leave both blank.",
        400
      )
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite: {
      title: personalWebsiteTitle,
      url: personalWebsiteUrl,
    },
    jobNiche,
    postedBy,
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });

});

//  req.query is an object containing a property for each query string parameter in the route.
//  If there is no query string, it is the empty object, {}.
// http://localhost:5000/api/v1/jobs/job1?keyword=IT will return { keyword: 'IT' } keyword is the query string parameter

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
    const { city, niche, searchKeyword } = req.query; 
    const query = {};
    if (city) {
      query.location = city;
    }
    if (niche) {
      query.jobNiche = niche;
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
      ];
    }
    const jobs = await Job.find(query);
    res.status(200).json({
      success: true,
      jobs,
      count: jobs.length,
    });
  });
  
  export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
      success: true,
      myJobs,
    });
  });
  
  export const deleteJob = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler(404, "Oops! Job not found."));
    }
    await job.deleteOne();
    res.status(200).json({
      success: true,
      message: "Job deleted.",
    });
  });
  
  export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler(404, "Job not found."));
    }
    res.status(200).json({
      success: true,
      job,
    });
  });