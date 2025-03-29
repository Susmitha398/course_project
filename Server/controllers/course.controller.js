import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// Create a new course
export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({ message: "Course title and category are required", success: false });
        }
        const course = await Course.create({ courseTitle, category, creator: req.id });
        return res.status(201).json({ success: true, course, message: "Course created successfully" });
    } catch (error) {
        console.error("Error in createCourse:", error);
        return res.status(500).json({ message: "Failed to create course", success: false });
    }
};

// Get all published courses
export const getPublishedCourse = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl description" });
        return res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error("Error in getPublishedCourse:", error);
        return res.status(500).json({ message: "Failed to get courses", success: false });
    }
};

// Get courses created by a specific user
export const getCreatorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ creator: req.id }).populate('lectures');
        return res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error("Error in getCreatorCourses:", error);
        return res.status(500).json({ message: "Failed to get courses", success: false });
    }
};

// Edit course details
export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const file = req.file;
        let course = await Course.findById(courseId).populate("lectures");
        if (!course) return res.status(404).json({ message: "Course not found!" });
        let courseThumbnail;
        if (file) {
            const fileUri = getDataUri(file);
            const uploadedImage = await cloudinary.uploader.upload(fileUri);
            courseThumbnail = uploadedImage.secure_url;
        }
        course = await Course.findByIdAndUpdate(courseId, { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail }, { new: true });
        return res.status(200).json({ success: true, course, message: "Course updated successfully" });
    } catch (error) {
        console.error("Error in editCourse:", error);
        return res.status(500).json({ message: "Failed to update course", success: false });
    }
};

// Get course by ID
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: "Course not found", success: false });
        return res.status(200).json({ success: true, course });
    } catch (error) {
        console.error("Error in getCourseById:", error);
        return res.status(500).json({ message: "Failed to get course", success: false });
    }
};

// Create lecture
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;
        if (!lectureTitle || !courseId) return res.status(400).json({ message: "Lecture title and course ID are required" });
        const lecture = await Lecture.create({ lectureTitle });
        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(201).json({ success: true, lecture, message: "Lecture created successfully" });
    } catch (error) {
        console.error("Error in createLecture:", error);
        return res.status(500).json({ message: "Failed to create Lecture" });
    }
};

// Get lectures for a course
export const getCourseLecture = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('lectures');
        if (!course) return res.status(404).json({ message: "Course not found" });
        return res.status(200).json({ success: true, lectures: course.lectures });
    } catch (error) {
        console.error("Error in getCourseLecture:", error);
        return res.status(500).json({ message: "Failed to get lectures" });
    }
};

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) return res.status(404).json({ message: "Lecture not found!" });
        await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } });
        return res.status(200).json({ success: true, message: "Lecture removed successfully" });
    } catch (error) {
        console.error("Error in removeLecture:", error);
        return res.status(500).json({ message: "Failed to remove lecture" });
    }
};

export const togglePublishedCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found!" });
        course.isPublished = !course.isPublished;
        await course.save();
        return res.status(200).json({ success: true, message: `Course is ${course.isPublished ? "Published" : "Unpublished"}` });
    } catch (error) {
        console.error("Error in togglePublishedCourse:", error);
        return res.status(500).json({ message: "Failed to update status" });
    }
};
