"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

// Courses array (same as before)
  const courses = [
    {
      id: "dsa",
      title: "Data Structures & Algorithms",
      description: "Master the fundamentals of DSA with practical examples",
      category: "Programming",
      color: "purple",
      timeline: "6 hours (12 lessons)",
      topics: ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs"],
      exercises: ["Implement Stack using Arrays", "Graph Traversal Problems"],
      tasks: ["Submit code for 3 problems", "Write short notes on Graphs"],
      videos: [
        {
          title: "Introduction to DSA",
          videoId: "8hly31xKli0",
          duration: "12:34",
        },
        {
          title: "Arrays & Linked Lists",
          videoId: "YJZCUhxNCv8",
          duration: "15:22",
        },
        {
          title: "Stacks, Queues & Trees",
          videoId: "oDqjPvD54Ss",
          duration: "18:10",
        },
      ],
    },
    {
      id: "coa",
      title: "Computer Organization & Architecture",
      description: "Understand the inner workings of computer systems",
      category: "Systems",
      color: "teal",
      timeline: "4 hours (8 lessons)",
      topics: ["CPU Architecture", "Memory Hierarchy", "Pipelining"],
      exercises: ["Draw CPU datapath", "Simulate instruction execution"],
      tasks: ["Create memory hierarchy notes"],
      videos: [
        {
          title: "CPU Architecture Basics",
          videoId: "L9X7XXfHYdU",
          duration: "14:20",
        },
        {
          title: "Memory Hierarchy Explained",
          videoId: "Ol8D69VKX2k",
          duration: "12:50",
        },
      ],
    },
    {
      id: "os",
      title: "Operating Systems",
      description: "Learn about process management, memory, and file systems",
      category: "Systems",
      color: "orange",
      timeline: "5 hours (10 lessons)",
      topics: ["Processes", "Threads", "Memory Management", "File Systems"],
      exercises: ["Implement process scheduling", "Simulate page replacement"],
      tasks: ["Prepare OS cheat sheet"],
      videos: [
        { title: "Intro to OS", videoId: "By6lWjiPpVI", duration: "10:45" },
        {
          title: "Process Management",
          videoId: "_TpOHMCODXo",
          duration: "13:20",
        },
        {
          title: "Memory Management",
          videoId: "bkSWJJZNgf8",
          duration: "14:18",
        },
      ],
    },
    {
      id: "dm",
      title: "Discrete Mathematics",
      description: "Essential mathematical concepts for computer science",
      category: "Mathematics",
      color: "purple",
      timeline: "5 hours (9 lessons)",
      topics: ["Sets", "Relations", "Functions", "Graphs", "Logic"],
      exercises: ["Solve set theory problems"],
      tasks: ["Submit logic proof assignments"],
      videos: [
        {
          title: "Sets & Relations",
          videoId: "wGLTV8MgLlA",
          duration: "12:00",
        },
        {
          title: "Functions & Graphs",
          videoId: "p2b2Vb-cYCs",
          duration: "14:45",
        },
      ],
    },
    {
      id: "automata",
      title: "Automata Theory",
      description: "Understand formal languages and computational models",
      category: "Theory",
      color: "teal",
      timeline: "6 hours (11 lessons)",
      topics: ["Finite Automata", "CFG", "Turing Machines"],
      exercises: ["Draw DFA for languages", "Convert NFA to DFA"],
      tasks: ["Prepare automata summary notes"],
      videos: [
        {
          title: "Introduction to Automata",
          videoId: "XslI8h7cGDs",
          duration: "11:30",
        },
        {
          title: "Introduction to Automata",
          videoId: "58N2N7zJGrQ",
          duration: "10:30",
        },
      ],
    },
    {
      id: "c-programming",
      title: "C Programming",
      description: "Learn the fundamentals of C programming language",
      category: "Programming",
      color: "orange",
      timeline: "7 hours (13 lessons)",
      topics: ["Syntax", "Loops", "Pointers", "Arrays"],
      exercises: ["Implement sorting algorithms in C"],
      tasks: ["Write 3 programs using pointers"],
      videos: [
        { title: "C Basics", videoId: "rQoqCP7LX60", duration: "15:00" },
        { title: "C Basics", videoId: "YmgI8Rq7F0E", duration: "15:00" },
      ],
    },
    {
      id: "cpp",
      title: "C++ Programming",
      description: "Master object-oriented programming with C++",
      category: "Programming",
      color: "pink",
      timeline: "6 hours (12 lessons)",
      topics: ["OOP Concepts", "Inheritance", "Polymorphism"],
      exercises: ["Create class hierarchies"],
      tasks: ["Build mini project in C++"],
      videos: [
        { title: "C++ OOP Basics", videoId: "z2jDamkbBF0", duration: "14:00" },
        { title: "C++ OOP Basics", videoId: "j8nAHeVKL08", duration: "14:00" },
      ],
    },
  ];

export default function WatchCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  const localStorageKey = `completedVideos_${id}`;

  useEffect(() => {
    const found = courses.find((c) => c.id === id);
    if (found) {
      setCourse(found);
      setActiveVideo(found.videos[0]);

      // Load completed videos from localStorage
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        setCompletedVideos(JSON.parse(saved));
      } else {
        setCompletedVideos([]);
      }
    } else {
      setCourse(null);
    }
  }, [id]);

  const toggleCompleted = (videoId: string) => {
    setCompletedVideos((prev) => {
      const updated = prev.includes(videoId)
        ? prev.filter((v) => v !== videoId)
        : [...prev, videoId];

      // Save to localStorage
      localStorage.setItem(localStorageKey, JSON.stringify(updated));
      return updated;
    });
  };

  if (!course) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link href="/courses">
          <Button className="mt-4">Go Back</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/courses">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <Badge className={`bg-${course.color}-500 text-white`}>
          {course.category}
        </Badge>
      </div>

      {/* Main Video Player */}
      <Card className="overflow-hidden mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{course.title}</CardTitle>
          <p className="text-muted-foreground mt-2">{course.description}</p>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-6">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo?.videoId}`}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Playlist */}
          <div>
            <h3 className="font-semibold text-lg mb-3">🎥 Lessons</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {course.videos.map((video, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-3 flex flex-col gap-2 transition-all hover:shadow-md ${
                    activeVideo?.videoId === video.videoId
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div
                    onClick={() => setActiveVideo(video)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-16 h-10 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                      <PlayCircle
                        className={`h-6 w-6 ${
                          activeVideo?.videoId === video.videoId
                            ? "text-purple-600"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {video.duration}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      completedVideos.includes(video.videoId)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleCompleted(video.videoId)}
                    className="flex items-center gap-2 mt-1"
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${
                        completedVideos.includes(video.videoId)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    {completedVideos.includes(video.videoId)
                      ? "Completed"
                      : "Mark as Completed"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <h3 className="font-semibold mb-2">📅 Timeline</h3>
              <p className="text-sm text-muted-foreground">{course.timeline}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🧩 Topics Covered</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {course.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🧠 Exercises</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {course.exercises.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">📝 Tasks</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {course.tasks.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
