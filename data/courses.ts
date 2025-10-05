export type TimelineItem = { time: string; title: string }
export type Exercise = { id: string; text: string }
export type Task = { id: string; text: string }

export type Course = {
id: string
title: string
description: string
image: string
isNew: boolean
isFree: boolean
price: string
category: string
color: "purple" | "teal" | "orange" | "pink"
// If the source is a single video (recommended for unlisted video), set youtubeId.
// If the source is a playlist, set youtubePlaylistId.
youtubeId: string
youtubePlaylistId: string
longDescription: string
timeline: TimelineItem[]
topics: string[]
exercises: Exercise[]
tasks: Task[]
}

export const courses: Course[] = [
    {
    id: "db",
    title: "Database Design & SQL",
    description: "Learn how to design databases and write SQL queries",
    image: "/placeholder.svg?height=200&width=350",
    isNew: true,
    isFree: false,
    price: "₹999",
    category: "Programming",
    color: "purple",
    youtubeId: "",
    youtubePlaylistId: "",
    longDescription: "Covers normalization, transactions, and practical SQL for analytics.",
    timeline: [{ time: "00:00", title: "Introduction to Databases" }],
    topics: ["SQL", "Normalization", "Transactions"],
    exercises: [{ id: "db-ex-1", text: "Design normalized schema for a blog" }],
    tasks: [{ id: "db-task-1", text: "Write SQL queries for analytics" }]
    },
    {
    id: "adv-algo",
    title: "Advanced Algorithms",
    description: "Deep dive into complex algorithmic techniques",
    image: "/placeholder.svg?height=200&width=350",
    isNew: true,
    isFree: false,
    price: "₹1299",
    category: "Programming",
    color: "teal",
    youtubeId: "",
    youtubePlaylistId: "",
    longDescription: "Graph algorithms, flows, geometry, FFT and tricks used in contests.",
    timeline: [{ time: "00:00", title: "Divide & Conquer" }],
    topics: ["Graphs", "Flows", "Number Theory"],
    exercises: [{ id: "aa-ex-1", text: "Implement Dinic's algorithm" }],
    tasks: [{ id: "aa-task-1", text: "Solve 10 medium problems on graph flows" }],
    },
    {
    id: "ml",
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML concepts and algorithms",
    image: "/placeholder.svg?height=200&width=350",
    isNew: true,
    isFree: false,
    price: "₹1499",
    category: "AI",
    color: "orange",
    youtubeId: "",
    youtubePlaylistId: "",
    longDescription: "Supervised learning, unsupervised learning, model evaluation and practical projects.",
    timeline: [{ time: "00:00", title: "Intro to ML" }],
    topics: ["Regression", "Classification", "Evaluation"],
    exercises: [{ id: "ml-ex-1", text: "Train a simple linear regression model" }],
    tasks: [{ id: "ml-task-1", text: "Prepare dataset and run experiments" }],
    },
    {
    id: "webdev",
    title: "Web Development Bootcamp",
    description: "Full-stack web development with modern technologies",
    image: "/placeholder.svg?height=200&width=350",
    isNew: false,
    isFree: false,
    price: "₹1999",
    category: "Web",
    color: "pink",
    youtubeId: "",
    youtubePlaylistId: "",
    longDescription: "HTML, CSS, JS, React, Node and deployment. Build full-stack apps from scratch.",
    timeline: [{ time: "00:00", title: "HTML & CSS" }],
    topics: ["HTML", "CSS", "JS", "React", "Node"],
    exercises: [{ id: "web-ex-1", text: "Build a personal portfolio site" }],
    tasks: [{ id: "web-task-1", text: "Deploy your app to Vercel" }],
    },
]