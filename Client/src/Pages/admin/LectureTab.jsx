import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { setLecture } from '@/redux/lectureSlice'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const LectureTab = () => {
    const params = useParams();
    const { courseId, lectureId } = params;
    const { lecture } = useSelector(store => store.lecture)
    const selectedLecture = lecture.find(lecture => lecture._id === lectureId)
    const [lectureTitle, setLectureTitle] = useState(selectedLecture.lectureTitle)
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null)
    const [isFree, setIsFree] = useState(selectedLecture.isPreviewFree)
    const [mediaProgress, setMediaProgress] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [loading, setLoading] = useState(false)
    const [removeLoading, setRemoveLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`https://lms-nswg.onrender.com/api/v1/media/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total))
                    }
                })
                if (res.data.success) {
                    setUploadVideoInfo({
                        videoUrl: res.data.data.url,
                        publicId: res.data.data.public_id,
                    })
                    toast.success(res.data.message)
                }
            } catch (error) {
                console.log(error);
                toast.error("Video upload failed")

            } finally {
                setMediaProgress(false)
            }
        }
    }

    const editLectureHandler = async (e) => {
        e.preventDefault();
        const data = {
            lectureTitle,
            videoInfo: uploadVideoInfo,
            isPreviewFree: isFree,
        }
        try {
            setLoading(true)
            const res = await axios.post(`https://lms-nswg.onrender.com/api/v1/course/${courseId}/lecture/${lectureId}`, data, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch([...lecture, setLecture(res.data.lecture)]) 
                console.log([...lecture, setLecture(res.data.lecture)]);
                             
                toast.success(res.data.message)                
            }
        } catch (error) {
            console.log(error);           
            toast.success("Lecture updated successfully")

        } finally {
            setLoading(false)
        }
    }

    const removeLectureHandler = async (e) => {
        e.preventDefault()
        try {
            setRemoveLoading(true)
            const res = await axios.delete(`https://lms-nswg.onrender.com/api/v1/course/lecture/${lectureId}`, { withCredentials: true })
            if (res.data.success) {
                navigate(`/admin/course/${courseId}/lecture`)
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete lecture")

        } finally {
            setRemoveLoading(false)
        }
    }
    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes and click save when done.</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
                        {
                            removeLoading ? <><Loader2 className='mr-1 w-4 h-4 animate-spin' />Please wait</> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        placeholder="Ex. Introduction to javascript"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        type="file"
                        accept="video/*"
                        className="w-fit"
                        onChange={fileChangeHandler}
                    />
                </div>
                <div className='flex items-center space-x-2 my-5'>
                    <Switch checked={isFree} onCheckedChange={setIsFree} className="bg-gray-800" />
                    <Label>Is this video FREE</Label>
                </div>
                {
                    mediaProgress && (
                        <div className='my-4'>
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }
                <div className='mt-4'>
                    <Button disabled={loading} onClick={editLectureHandler} className="bg-gray-800 hover:bg-gray-800">
                        {
                            loading ? <><Loader2 className='mr-1 w-4 h-4 animate-spin' />Please wait</> : "Update Lecture"
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab
