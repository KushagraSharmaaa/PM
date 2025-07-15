import { useGetMyTasksQuery, useAchievedTaskMutation } from "@/hooks/use-task";
import { Loader } from "@/components/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router";
import { format } from "date-fns";
import React from "react";

const sortOptions = [
  { label: "Recently Archived", value: "archivedDesc" },
  { label: "Oldest Archived", value: "archivedAsc" },
  { label: "Due Date", value: "dueDate" },
  { label: "Title", value: "title" },
];

const Achieved = () => {
  const { data: myTasks, isLoading, refetch } = useGetMyTasksQuery() as {
    data: any[];
    isLoading: boolean;
    refetch: () => void;
  };
  const { mutate: unarchiveTask, isPending: isUnarchiving } = useAchievedTaskMutation();
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("archivedDesc");

  let achievedTasks = myTasks?.filter((task) => task.isArchived) || [];

  // Search filter
  if (search) {
    achievedTasks = achievedTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Sort
  achievedTasks = [...achievedTasks].sort((a, b) => {
    if (sort === "archivedDesc") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sort === "archivedAsc") {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sort === "dueDate") {
      return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
    } else if (sort === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleUnarchive = (taskId: string) => {
    unarchiveTask(
      { taskId },
      {
        onSuccess: () => {
          toast.success("Task unarchived");
          refetch();
        },
        onError: () => {
          toast.error("Failed to unarchive task");
        },
      }
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 transition-colors duration-300">Achieved Tasks</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          placeholder="Search achieved tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="border rounded-md px-3 py-2 bg-background text-foreground transition-colors duration-200 focus:ring focus:ring-primary/20"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {achievedTasks.length === 0 ? (
        <div className="text-muted-foreground transition-opacity duration-300">No achieved tasks found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {achievedTasks.map((task, idx) => (
            <Card
              key={task._id}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background/80 backdrop-blur-md border border-border/60 animate-fade-in"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {task.title}
                  <Badge variant="outline" className="ml-2">Archived</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-sm text-muted-foreground">
                  {task.description || "No description"}
                </div>
                <div className="text-xs text-muted-foreground space-y-1 mb-2">
                  {task.dueDate && (
                    <div>Due: {format(new Date(task.dueDate), "PPPP")}</div>
                  )}
                  <div>Modified on: {format(new Date(task.updatedAt), "PPPP")}</div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                    className="text-blue-600 hover:underline transition-colors duration-200"
                  >
                    View Task
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnarchive(task._id)}
                    disabled={isUnarchiving}
                    className="transition-all duration-200"
                  >
                    Unarchive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achieved;

// Add fade-in animation to global CSS if not present:
// .animate-fade-in { @apply opacity-0 animate-[fadeIn_0.6s_ease-in-out_forwards]; }
// @keyframes fadeIn { to { opacity: 1; } } 