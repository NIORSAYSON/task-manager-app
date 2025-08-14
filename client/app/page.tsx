"use client";

import AddTaskModal from "@/components/AddTaskModal";
import { DashboardComponent } from "@/components/Dashboard";
import DeleteModal from "@/components/DeleteModal";
import { useModalStore } from "@/store/modalStore";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const { isAddModalOpen, setIsAddModalOpen } = useModalStore();

  return (
    <>
      <DashboardComponent />
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <DeleteModal />
      <Toaster />
    </>
  );
}
