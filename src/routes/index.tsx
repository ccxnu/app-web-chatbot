import LandingPage from "@/features/webpage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/')({
  component: LandingPage,
})
