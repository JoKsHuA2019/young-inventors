import data from "@/content/lessons.json";
import type { Lesson } from "@/lib/types";
import LessonPlayer from "@/components/LessonPlayer";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
const lessons = data as unknown as Lesson[];
export const generateStaticParams = () =>
  lessons.map((l) => ({ slug: l.slug }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = lessons.find((l) => l.slug === slug);
  return { title: l?.title || "Project" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) notFound();
  const code = lesson.helper.code_path
    ? fs.readFileSync(
        path.join(process.cwd(), "public", lesson.helper.code_path),
        "utf8",
      )
    : "";
  return <LessonPlayer lesson={lesson} code={code} />;
}
