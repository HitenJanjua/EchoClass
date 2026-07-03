import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import Navbar from "./components/Navbar";
import ClassCard from "./components/ClassCard";
import ClassGridContainer from "./components/ClassGridContainer";
import { GraduationCap } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    filter?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const session = await getServerSession(authOptions);

  // If not signed in, show a minimal landing
  if (!session?.user?.email) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center text-center py-16 px-8 gap-6">
          <div className="w-[120px] h-[120px] rounded-full bg-accent flex items-center justify-center text-primary">
            <GraduationCap size={56} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground m-0">
              Welcome to EchoClass
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-[380px] leading-relaxed mx-auto">
              Sign in with your institutional Google account to create or join
              classes.
            </p>
            <a
              href="/api/auth/signin?callbackUrl=/"
              className="inline-flex items-center gap-2 mt-6 px-7 py-3 rounded-lg font-semibold text-sm shadow transition-all"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Sign in with Google
            </a>
          </div>
        </div>
      </>
    );
  }

  // Look up the user in the DB (may not exist yet if they just signed in)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      taughtClasses: {
        include: {
          teacher: true,
          enrollments: true,
        },
        orderBy: { createdAt: "desc" },
      },
      enrolledClasses: {
        include: {
          class: {
            include: {
              teacher: true,
              enrollments: true,
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      },
    },
  });

  // Build a unified list of classes
  const taughtClasses = (user?.taughtClasses ?? []).map((cls) => ({
    id: cls.id,
    name: cls.name,
    section: cls.section,
    subject: cls.subject,
    coverColor: cls.coverColor,
    teacherName: cls.teacher.name,
    teacherImage: cls.teacher.image,
    enrollmentCount: cls.enrollments.length,
    code: cls.code,
    role: "TEACHER" as const,
  }));

  const enrolledClasses = (user?.enrolledClasses ?? []).map((enrollment) => ({
    id: enrollment.class.id,
    name: enrollment.class.name,
    section: enrollment.class.section,
    subject: enrollment.class.subject,
    coverColor: enrollment.class.coverColor,
    teacherName: enrollment.class.teacher.name,
    teacherImage: enrollment.class.teacher.image,
    enrollmentCount: enrollment.class.enrollments.length,
    code: null, // Students don't need to see the code once joined
    role: "STUDENT" as const,
  }));

  const allClasses = [...taughtClasses, ...enrolledClasses];

  return (
    <>
      <Navbar />
      <main className="max-w-[1400px] mx-auto p-6">
        <ClassGridContainer
          taughtClasses={taughtClasses}
          enrolledClasses={enrolledClasses}
          initialFilter={filter}
        />
      </main>
    </>
  );
}
