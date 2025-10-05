"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WatchCoursePage() {
  const { id } = useParams();

//   https://www.youtube.com/watch?v=AT14lCXuMKI&list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU&index=1

  const courses = [
    {
      id: "dsa",
      title: "Data Structures & Algorithms",
      description: "Master the fundamentals of DSA with practical examples",
      category: "Programming",
      color: "purple",
      videoId: "AT14lCXuMKI&list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU&index=1",
      timeline: "6 hours (12 lessons)",
      topics: ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs"],
      exercises: ["Implement Stack using Arrays", "Graph Traversal Problems"],
      tasks: ["Submit code for 3 problems", "Write short notes on Graphs"],
    },
    {
      id: "coa",
      title: "Computer Organization & Architecture",
      description: "Understand the inner workings of computer systems",
      category: "Systems",
      color: "teal",
      videoId: "KfLhD0nRXzE",
      timeline: "4 hours (8 lessons)",
      topics: ["CPU Architecture", "Memory Hierarchy", "Pipelining"],
      exercises: ["Draw CPU datapath", "Simulate instruction execution"],
      tasks: ["Create memory hierarchy notes"],
    },
    {
      id: "os",
      title: "Operating Systems",
      description: "Learn about process management, memory, and file systems",
      category: "Systems",
      color: "orange",
      videoId: "Z3VZKMEZ0LE",
      timeline: "5 hours (10 lessons)",
      topics: ["Processes", "Threads", "Memory Management", "File Systems"],
      exercises: ["Implement process scheduling", "Simulate page replacement"],
      tasks: ["Prepare OS cheat sheet"],
    },
    {
      id: "dm",
      title: "Discrete Mathematics",
      description: "Essential mathematical concepts for computer science",
      category: "Mathematics",
      color: "purple",
      videoId: "ZqZsMqaQBRs",
      timeline: "5 hours (9 lessons)",
      topics: ["Sets", "Relations", "Functions", "Graphs", "Logic"],
      exercises: ["Solve set theory problems"],
      tasks: ["Submit logic proof assignments"],
    },
    {
      id: "automata",
      title: "Automata Theory",
      description: "Understand formal languages and computational models",
      category: "Theory",
      color: "teal",
      videoId: "3FOBCz5H0pA",
      timeline: "6 hours (11 lessons)",
      topics: ["Finite Automata", "CFG", "Turing Machines"],
      exercises: ["Draw DFA for languages", "Convert NFA to DFA"],
      tasks: ["Prepare automata summary notes"],
    },
    {
      id: "c-programming",
      title: "C Programming",
      description: "Learn the fundamentals of C programming language",
      category: "Programming",
      color: "orange",
      videoId: "ZSPZob_1TOk",
      timeline: "7 hours (13 lessons)",
      topics: ["Syntax", "Loops", "Pointers", "Arrays"],
      exercises: ["Implement sorting algorithms in C"],
      tasks: ["Write 3 programs using pointers"],
    },
    {
      id: "cpp",
      title: "C++ Programming",
      description: "Master object-oriented programming with C++",
      category: "Programming",
      color: "pink",
      videoId: "vLnPwxZdW4Y",
      timeline: "6 hours (12 lessons)",
      topics: ["OOP Concepts", "Inheritance", "Polymorphism"],
      exercises: ["Create class hierarchies"],
      tasks: ["Build mini project in C++"],
    },
  ];

  const course = courses.find((c) => c.id === id);

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
        <Badge className={`bg-${course.color}`}>{course.category}</Badge>
      </div>

      <Card className="overflow-hidden mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{course.title}</CardTitle>
          <p className="text-muted-foreground mt-2">{course.description}</p>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-6">
            <iframe
              src={`https://www.youtube.com/embed/${course.videoId}`}

            //   https://www.youtube.com/watch?v=AT14lCXuMKI&list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU&index=1


              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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