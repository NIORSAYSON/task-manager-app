"use client";

import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useModalStore } from "@/store/modalStore";
import { useTaskStore } from "@/store/taskStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const DeleteModal = () => {
  const { toast } = useToast();
  const { setTaskToDelete, taskToDelete, deleteTask } = useTaskStore();
  const { setIsDeleteModalOpen, isDeleteModalOpen } = useModalStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCloseDeleteModal = () => {
    setTaskToDelete("");
    setIsDeleteModalOpen(false);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      setIsDeleting(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskToDelete}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token || ""}`,
            },
          }
        );
        const data = await res.json();

        if (data.success) {
          deleteTask(taskToDelete);
          toast({
            title: "Success",
            description: "Task deleted successfully!",
          });
        } else {
          throw new Error(data.message || "Failed to delete task");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete task",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setTaskToDelete("");
        setIsDeleteModalOpen(false);
      }
    }
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={handleCloseDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteTask}
            disabled={isDeleting}>
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
