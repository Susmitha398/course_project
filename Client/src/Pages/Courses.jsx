import CourseCard from '@/components/CourseCard'
import { setCourse } from '@/redux/courseSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const coursesJson = [
  {
    "id": 1,
    "title": "Complete JavaScript Mastery",
    "description": "Learn JavaScript from basics to advanced, including ES6+, DOM manipulation, and practical projects.",
    "image": "https://example.com/images/javascript-course.jpg"
  },
  {
    "id": 2,
    "title": "React Development Bootcamp",
    "description": "Master React.js with hands-on projects, hooks, context API, and state management.",
    "image": "https://example.com/images/react-course.jpg"
  },
  {
    "id": 3,
    "title": "Node.js and Express Essentials",
    "description": "Understand backend development with Node.js, Express.js, and REST API creation.",
    "image": "https://example.com/images/node-course.jpg"
  },
  {
    "id": 4,
    "title": "Mastering MongoDB",
    "description": "Learn MongoDB database concepts, CRUD operations, and how to integrate it with Node.js.",
    "image": "https://example.com/images/mongodb-course.jpg"
  },
  {
    "id": 5,
    "title": "Full-Stack MERN Development",
    "description": "Become a full-stack developer by mastering the MERN stack: MongoDB, Express, React, and Node.js.",
    "image": "https://example.com/images/mern-course.jpg"
  },
  {
    "id": 6,
    "title": "WordPress for Beginners",
    "description": "Learn to create and manage websites using WordPress, including themes, plugins, and SEO.",
    "image": "https://example.com/images/wordpress-course.jpg"
  },
  {
    "id": 7,
    "title": "Digital Marketing Masterclass",
    "description": "Explore digital marketing strategies including SEO, social media, email campaigns, and PPC ads.",
    "image": "https://example.com/images/digital-marketing-course.jpg"
  },
  {
    "id": 8,
    "title": "Tailwind CSS Crash Course",
    "description": "Learn how to use Tailwind CSS to create beautiful, responsive websites with utility-first classes.",
    "image": "https://example.com/images/tailwind-course.jpg"
  },
  {
    "id": 9,
    "title": "Building an LMS with MERN Stack",
    "description": "Create a Learning Management System using React, Node.js, Express.js, and MongoDB.",
    "image": "https://example.com/images/lms-course.jpg"
  },
  {
    "id": 10,
    "title": "Advanced JavaScript Patterns",
    "description": "Dive deeper into JavaScript with advanced concepts like closures, prototypal inheritance, and design patterns.",
    "image": "https://example.com/images/advanced-js-course.jpg"
  }
]


const Courses = () => {
  const dispatch = useDispatch()
  const {course} = useSelector(store => store.course)

  useEffect(()=> {
    const getAllPublishedCourse = async ()=> {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/course/published-courses`, {withCredentials:true})
        if(res.data.success){
          dispatch(setCourse(res.data.courses))
        }

        console.log({res:res.data});
        
      } catch (error) {
        console.log(error);
        
      }
    }
    getAllPublishedCourse()
  }, [])
  return (
    <div className='bg-gray-100 pt-14'>
      <div className='min-h-screen max-w-7xl mx-auto py-10'>
        <div className='px-4'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Our Courses</h1>
          <p className='text-center text-gray-600 mb-12'>Explore our curated courses to boost your skills and career. Whether you're a beginner or an expert, we have something for everyone.</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
             {
              course?.map((course)=> {
               return <CourseCard course={course}/>
              })
             }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
