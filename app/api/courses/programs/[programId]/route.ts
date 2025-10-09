import { type NextRequest, NextResponse } from "next/server"

const getCourseProgram = async (id: string) => {
const programs = [
    {
      id: "dsa",
      title: "Data Structures & Algorithms",
      description: "Master the fundamentals of DSA with practical examples",
      image: "/placeholder.svg?height=200&width=350",
      isNew: true,
      isFree: true,
      category: "Programming",
      color: "purple",
      youtubeLink: "https://www.youtube.com/watch?v=8hly31xKli0",
      videoId: "8hly31xKli0",
    },
    {
      id: "coa",
      title: "Computer Organization & Architecture",
      description: "Understand the inner workings of computer systems",
      image: "/placeholder.svg?height=200&width=350",
      isNew: true,
      isFree: true,
      category: "Systems",
      color: "teal",
      youtubeLink: "https://www.youtube.com/watch?v=KfLhD0nRXzE",
      videoId: "KfLhD0nRXzE",
    },
    {
      id: "os",
      title: "Operating Systems",
      description: "Learn about process management, memory, and file systems",
      image: "/placeholder.svg?height=200&width=350",
      isNew: false,
      isFree: true,
      category: "Systems",
      color: "orange",
      youtubeLink: "https://www.youtube.com/watch?v=Z3VZKMEZ0LE",
      videoId: "Z3VZKMEZ0LE",
    },
    {
      id: "adv-java",
      title: "Advanced Java Programming",
      description: "Take your Java skills to the next level",
      image: "/placeholder.svg?height=200&width=350",
      isNew: false,
      isFree: false,
      price: "₹999",
      category: "Programming",
      color: "pink",
    },
    {
      id: "dm",
      title: "Discrete Mathematics",
      description: "Essential mathematical concepts for computer science",
      image: "/placeholder.svg?height=200&width=350",
      isNew: false,
      isFree: true,
      category: "Mathematics",
      color: "purple",
      youtubeLink: "https://www.youtube.com/watch?v=ZqZsMqaQBRs",
      videoId: "ZqZsMqaQBRs",
    },
    {
      id: "automata",
      title: "Automata Theory",
      description: "Understand formal languages and computational models",
      image: "/placeholder.svg?height=200&width=350",
      isNew: false,
      isFree: true,
      category: "Theory",
      color: "teal",
      youtubeLink: "https://www.youtube.com/watch?v=3FOBCz5H0pA",
      videoId: "3FOBCz5H0pA",
    },
    {
      id: "c-programming",
      title: "C Programming",
      description: "Learn the fundamentals of C programming language",
      image: "/placeholder.svg?height=200&width=350",
      isNew: false,
      isFree: true,
      category: "Programming",
      color: "orange",
      youtubeLink: "https://www.youtube.com/watch?v=ZSPZob_1TOk",
      videoId: "ZSPZob_1TOk",
    },
    {
      id: "cpp",
      title: "C++ Programming",
      description: "Master object-oriented programming with C++",
      image: "/placeholder.svg?height=200&width=350",
      isNew: false,
      isFree: true,
      category: "Programming",
      color: "pink",
      youtubeLink: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
      videoId: "vLnPwxZdW4Y",
    },
    {
      id: "dbms",
      title: "Database Management Systems",
      description: "Learn SQL and database design principles",
      image: "/placeholder.svg?height=200&width=350",
      isNew: false,
      isFree: false,
      price: "₹799",
      category: "Systems",
      color: "purple",
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
    },
  ];

  return programs.find((program) => program.id === id && !program.isFree) || null
}

export async function GET(request: NextRequest, { params }: { params: { programId: string } }) {
  try {
    const program = await getCourseProgram(params.programId)

    if (!program) {
      return NextResponse.json({ success: false, error: "Program not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: program })
  } catch (error) {
    console.error("Error fetching program:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch training program" }, { status: 500 })
  }
}
